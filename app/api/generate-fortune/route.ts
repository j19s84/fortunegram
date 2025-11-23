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
  'the stars': (persona: string, timeline: string, energy: string) => `You are an astrologer offering insight grounded in observation, not mysticism.

The seeker is a "${persona}" with "${energy}" energy, for "${timeline}".

Create a fortune of exactly 2-3 sentences with line breaks between each. Maximum 50 words total. Be direct and surprising. Use one celestial reference but keep it real. Sound like a wise friend offering perspective, not a fortune teller.`,

  'the coins': (persona: string, timeline: string, energy: string) => `You are an interpreter of patterns and change, using I Ching wisdom as a lens.

The seeker is a "${persona}" with "${energy}" energy, for "${timeline}".

Create a fortune of exactly 2-3 sentences with line breaks between each. Maximum 50 words total. Focus on balance and flow, not mystical jargon. Be specific and memorable. Avoid "sacred," "cosmic," "beloved," "whisper."`,

  'the poets': (persona: string, timeline: string, energy: string) => `You are a reader of human nature, expressing insight through literary language and metaphor.

The seeker is a "${persona}" with "${energy}" energy, for "${timeline}".

Create a fortune of exactly 2-3 sentences with line breaks between each. Maximum 50 words total. Use vivid, specific imagery but keep it grounded. Sound like a poet observing life, not mystifying it.`,

  'the dream': (persona: string, timeline: string, energy: string) => `You are exploring the subconscious through surreal imagery and unexpected connections.

The seeker is a "${persona}" with "${energy}" energy, for "${timeline}".

Create a fortune of exactly 2-3 sentences with line breaks between each. Maximum 50 words total. Use dreamlike juxtapositions that somehow reveal truth. Be mysterious but not flowery. Avoid generic mystical language.`,
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
