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

// Public domain literary quotes (pre-1928, or authors who died before 1928)
const LITERARY_QUOTES = [
  // Rumi (1207-1273)
  { text: "The wound is the place where the Light enters you.", author: 'Rumi', themes: ['pain', 'growth', 'transformation'] },
  { text: "Stop acting so small. You are the universe in ecstatic motion.", author: 'Rumi', themes: ['potential', 'expansion', 'present'] },
  { text: "Don't grieve. Anything you lose comes round in another form.", author: 'Rumi', themes: ['loss', 'change', 'future'] },
  { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: 'Rumi', themes: ['wholeness', 'identity', 'present'] },

  // Walt Whitman (1819-1892)
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: 'Walt Whitman', themes: ['focus', 'future', 'growth'] },
  { text: "I am large, I contain multitudes.", author: 'Walt Whitman', themes: ['potential', 'self', 'present'] },
  { text: "Resist much, obey little.", author: 'Walt Whitman', themes: ['rebellion', 'power', 'present'] },

  // Emily Dickinson (1830-1886)
  { text: "Hope is the thing with feathers that perches in the soul.", author: 'Emily Dickinson', themes: ['hope', 'potential', 'future'] },
  { text: "The Brain—is wider than the Sky.", author: 'Emily Dickinson', themes: ['potential', 'mind', 'present'] },
  { text: "That it will never come again is what makes life so sweet.", author: 'Emily Dickinson', themes: ['present', 'transience', 'appreciation'] },

  // William Blake (1757-1827)
  { text: "If the doors of perception were cleansed every thing would appear to man as it is, Infinite.", author: 'William Blake', themes: ['vision', 'perception', 'present'] },
  { text: "Do what you will, this life's a fiction and is made up of contradiction.", author: 'William Blake', themes: ['paradox', 'acceptance', 'present'] },

  // Oscar Wilde (1854-1900)
  { text: "Be yourself; everyone else is already taken.", author: 'Oscar Wilde', themes: ['identity', 'authenticity', 'present'] },
  { text: "The only way to get rid of a temptation is to yield to it.", author: 'Oscar Wilde', themes: ['desire', 'acceptance', 'present'] },
  { text: "Experience is simply the name we give our mistakes.", author: 'Oscar Wilde', themes: ['learning', 'growth', 'past'] },

  // Rainer Maria Rilke (1875-1926)
  { text: "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and bravery.", author: 'Rilke', themes: ['fear', 'transformation', 'courage'] },
  { text: "The only journey is the one within.", author: 'Rilke', themes: ['introspection', 'growth', 'present'] },

  // Fyodor Dostoevsky (1821-1881)
  { text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.", author: 'Dostoevsky', themes: ['purpose', 'meaning', 'future'] },
  { text: "There is something in the Russian soul that makes it alien to Europe.", author: 'Dostoevsky', themes: ['identity', 'otherness', 'present'] },

  // Leo Tolstoy (1828-1910)
  { text: "All happy families are alike; each unhappy family is unhappy in its own way.", author: 'Tolstoy', themes: ['family', 'uniqueness', 'present'] },
  { text: "The more we live by our intellect, the less we understand the meaning of life.", author: 'Tolstoy', themes: ['understanding', 'intuition', 'growth'] },

  // Charles Baudelaire (1821-1867)
  { text: "I love the beautiful season when heaven rains fire and the air is transformed into copper.", author: 'Baudelaire', themes: ['transformation', 'beauty', 'present'] },

  // Herman Melville (1819-1891)
  { text: "It is better to fail in originality than to succeed in imitation.", author: 'Melville', themes: ['authenticity', 'courage', 'present'] },
  { text: "Call me Ishmael.", author: 'Melville', themes: ['identity', 'beginning', 'present'] },

  // Franz Kafka (1883-1924)
  { text: "The test of a first-rate intelligence is the ability to hold two opposed ideas in mind and still retain the ability to function.", author: 'Kafka', themes: ['paradox', 'mind', 'present'] },
  { text: "One must have chaos within oneself to give birth to a dancing star.", author: 'Kafka', themes: ['creativity', 'struggle', 'transformation'] },
]

function selectQuoteForContext(persona: string, timeline: string, energy: string): typeof LITERARY_QUOTES[0] {
  // Filter quotes by theme relevance
  const lowerPersona = persona.toLowerCase()
  const lowerTimeline = timeline.toLowerCase()
  const lowerEnergy = energy.toLowerCase()

  // Map context to themes
  const relevantThemes: string[] = []

  if (lowerTimeline.includes('future') || lowerTimeline.includes('tomorrow')) relevantThemes.push('future')
  if (lowerTimeline.includes('past') || lowerTimeline.includes('memory')) relevantThemes.push('past')
  if (lowerTimeline.includes('now') || lowerTimeline.includes('present')) relevantThemes.push('present')

  if (lowerEnergy.includes('anxious') || lowerEnergy.includes('fear')) relevantThemes.push('fear')
  if (lowerEnergy.includes('hopeful') || lowerEnergy.includes('optimistic')) relevantThemes.push('hope')
  if (lowerEnergy.includes('creative')) relevantThemes.push('creativity')
  if (lowerEnergy.includes('lost') || lowerEnergy.includes('searching')) relevantThemes.push('purpose')
  if (lowerEnergy.includes('rebellious') || lowerEnergy.includes('bold')) relevantThemes.push('rebellion')

  // Find best matching quote
  let bestMatch = LITERARY_QUOTES[0]
  let bestScore = 0

  for (const quote of LITERARY_QUOTES) {
    let score = 0
    for (const theme of relevantThemes) {
      if (quote.themes.includes(theme)) score++
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = quote
    }
  }

  // If no theme matches, pick a random one weighted toward present/universal themes
  if (bestScore === 0) {
    const universalQuotes = LITERARY_QUOTES.filter(q => q.themes.includes('present') || q.themes.includes('growth'))
    return universalQuotes[Math.floor(Math.random() * universalQuotes.length)]
  }

  return bestMatch
}

// Helper to get oracle prompt
function getOraclePrompt(oracle: string, persona: string, timeline: string, energy: string): string {
  if (oracle === 'the poets') {
    const selectedQuote = selectQuoteForContext(persona, timeline, energy)
    return `You are a keeper of literary wisdom, weaving timeless insights into contemporary guidance.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

The quote you're reflecting on: "${selectedQuote.text}" — ${selectedQuote.author}

In 1-2 sentences total, briefly interpret how this quote speaks to their current situation. Be direct and specific. No mysticism. Focus on the truth it reveals about their life right now.`
  }

  const ORACLE_PROMPTS: Record<string, string> = {
    'the cards': `You are a reader of archetypal patterns and human psychology.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Reflect the psychological significance of what the cards reveal about their situation. Be grounded and specific—no "beloved," "cosmic," "sacred," "souls," "whisper," or flowery language. Sound like someone offering true perspective.`,

    'the stones': `You are an interpreter of ancient rune wisdom, connecting elemental forces to practical insight.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Ground the rune's ancient meaning in their real situation. Use primal, elemental language but stay direct. No "illuminate," "beacon," "sacred fire," or abstract mysticism.`,

    'the stars': `You are an astrologer observing cosmic patterns and their earthly parallels.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Connect planetary/celestial patterns to practical observation. Be precise and surprising. Use one astronomical reference but keep it grounded. Avoid flowery language.`,

    'the numbers': `You are a numerologist seeing patterns in rhythm and cycles.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Reveal numerical patterns that illuminate their path. Be rhythmic but not mystical. Connect numbers to concrete insight about timing or cycles.`,

    'the coins': `You are an I Ching interpreter, reading patterns of change and balance.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Focus on balance, flow, and the nature of change. Be philosophical but concrete. Avoid "beloved," "cosmic," "sacred," "souls," "whisper," or mystical jargon.`,

    'the dream': `You are exploring the subconscious through surreal imagery and unexpected connections that somehow make sense.

The seeker is a "${persona}" with "${energy}" energy, seeking guidance for "${timeline}".

Generate exactly 2-3 sentences separated by line breaks. Max 50 words. Create dreamlike juxtapositions that reveal hidden truth. Be mysterious but not flowery. Avoid generic mystical language—make strange connections that actually land.`,
  }

  return ORACLE_PROMPTS[oracle] || ORACLE_PROMPTS['the stars']
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
    const SUPPORTED_ORACLES = ['the cards', 'the stones', 'the stars', 'the numbers', 'the coins', 'the poets', 'the dream']
    if (!SUPPORTED_ORACLES.includes(lens)) {
      return NextResponse.json(
        { error: `Oracle "${lens}" not yet configured for AI generation. Using default: "the stars"` },
        { status: 501 }
      )
    }

    // Get the appropriate prompt for this oracle
    const systemPrompt = getOraclePrompt(lens, character, timeframe, energy)

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
