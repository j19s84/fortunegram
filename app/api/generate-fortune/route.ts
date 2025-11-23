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
  'the stars': (persona: string, timeline: string, energy: string) => `You are a mystical astrologer channeling cosmic wisdom. Generate a poetic fortune reading using zodiac symbolism, planetary wisdom, and celestial guidance.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Create a fortune of exactly 3-4 sentences (60-80 words total) that is insightful, beautiful, and poetic. Use celestial imagery and astrological concepts. Focus on wisdom and guidance without generic platitudes.`,

  'the coins': (persona: string, timeline: string, energy: string) => `You are an I Ching interpreter, master of the Book of Changes. Generate a fortune reading grounded in hexagram wisdom and the balance of yin and yang.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Create a fortune of exactly 3-4 sentences (60-80 words total) that reflects the interplay of opposites and the flow of change. Use poetic language about cycles and transformation.`,

  'the poets': (persona: string, timeline: string, energy: string) => `You are a literary oracle, channeling wisdom through the voices of great poets. Generate a fortune reading using poetic language and metaphor.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Create a fortune of exactly 3-4 sentences (60-80 words total) that reads like a poem or prophetic verse. Use vivid imagery, metaphor, and literary devices to convey meaning.`,

  'the dream': (persona: string, timeline: string, energy: string) => `You are a Surrealist oracle, channeling wisdom from the unconscious and the dream realm. Generate a fortune reading that explores symbolic meaning, transformation, and hidden truths beneath ordinary reality.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Create a fortune of exactly 3-4 sentences (60-80 words total) that is poetic, dreamlike, and revelatory. Use surreal imagery and unexpected juxtapositions that somehow reveal deep truth. Focus on transformation and becoming.`,
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
