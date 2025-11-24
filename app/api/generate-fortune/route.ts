import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Rate limiting: Store IP -> timestamps for request tracking
const rateLimitStore: Map<string, number[]> = new Map()
const RATE_LIMIT_WINDOW = 3600000 // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per hour

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, [now])
    return true
  }

  const timestamps = rateLimitStore.get(ip)!
  const recentTimestamps = timestamps.filter((t) => t > windowStart)

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  recentTimestamps.push(now)
  rateLimitStore.set(ip, recentTimestamps)
  return true
}

// Oracle-specific prompts
const ORACLE_PROMPTS: Record<string, (persona: string, timeline: string, energy: string) => string> = {
  'the cards': (persona: string, timeline: string, energy: string) => `You are a reader of archetypal patterns and human psychology.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Reflect the psychological significance of what the cards reveal about their situation. Be grounded and specific—no "beloved," "cosmic," "sacred," "souls," "whisper," or flowery language. Sound like someone offering true perspective.`,

  'the stones': (persona: string, timeline: string, energy: string) => `You are an interpreter of ancient rune wisdom, connecting elemental forces to practical insight.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Ground the rune's ancient meaning in their real situation. Use primal, elemental language but stay direct. No "illuminate," "beacon," "sacred fire," or abstract mysticism.`,

  'the stars': (persona: string, timeline: string, energy: string) => `You are an astrologer observing cosmic patterns and their earthly parallels.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Connect planetary/celestial patterns to practical observation. Be precise and surprising. Use one astronomical reference but keep it grounded. Avoid flowery language.`,

  'the numbers': (persona: string, timeline: string, energy: string) => `You are a numerologist seeing patterns in rhythm and cycles.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Reveal numerical patterns that illuminate their path. Be rhythmic but not mystical. Connect numbers to concrete insight about timing or cycles.`,

  'the coins': (persona: string, timeline: string, energy: string) => `You are an I Ching interpreter, reading patterns of change and balance.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Focus on balance, flow, and the nature of change. Be philosophical but concrete. Avoid "beloved," "cosmic," "sacred," "souls," "whisper," or mystical jargon.`,

  'the poets': (persona: string, timeline: string, energy: string) => `You are a reader of human nature through literary observation and metaphor.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Use vivid, specific imagery that reveals emotional truth. Sound like a poet watching life unfold, not mystifying it. No flowery abstractions.`,

  'the dream': (persona: string, timeline: string, energy: string) => `You are exploring the subconscious through surreal imagery and unexpected connections that somehow make sense.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Create dreamlike juxtapositions that reveal hidden truth. Be mysterious but not flowery. Avoid generic mystical language—make strange connections that actually land.`,
}

interface GenerateFortuneRequest {
  character?: string
  timeframe?: string
  energy?: string
  lens?: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const clientIp = getClientIp(request)
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 10 requests per hour.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body: GenerateFortuneRequest = await request.json()
    const { character = 'seeker', timeframe = 'present', energy = 'balanced', lens = 'the stars' } = body

    // Validate lens/oracle is one we support
    if (!ORACLE_PROMPTS[lens]) {
      return NextResponse.json(
        { error: `Oracle "${lens}" not yet configured for AI generation. Using default: "the stars"` },
        { status: 501 }
      )
    }

    // Get the appropriate prompt for this oracle
    const systemPrompt = ORACLE_PROMPTS[lens](character, timeframe, energy)

    // Call Claude API
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: 'Generate the fortune now.',
        },
      ],
      system: systemPrompt,
    })

    // Extract fortune from response
    const fortune =
      message.content[0].type === 'text'
        ? message.content[0].text
        : 'The oracle fell silent. Try again later.'

    return NextResponse.json({
      success: true,
      fortune,
      oracle: lens,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Fortune generation error:', error)

    // Don't expose internal error details to client
    const errorMessage =
      error instanceof Anthropic.AuthenticationError
        ? 'API authentication failed. Please check your configuration.'
        : error instanceof Anthropic.RateLimitError
          ? 'API rate limit hit. Please try again in a moment.'
          : 'The stars are obscured today. Please try again.'

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    )
  }
}
