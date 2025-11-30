import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Load poets quotes library
let poetsQuotes: Record<string, Array<{ text: string; author: string }>> | null = null

function loadPoetsQuotes() {
  if (poetsQuotes) return poetsQuotes
  try {
    const filePath = path.join(process.cwd(), 'lib', 'poets-quotes.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    poetsQuotes = JSON.parse(fileContent)
    return poetsQuotes
  } catch (error) {
    console.error('Failed to load poets quotes:', error)
    return null
  }
}

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

// Map persona/timeline/energy to quote theme from poets-quotes.json
function getThemeFromContext(persona: string, timeline: string, energy: string): string {
  const lowerPersona = persona.toLowerCase()
  const lowerTimeline = timeline.toLowerCase()
  const lowerEnergy = energy.toLowerCase()

  // Theme scoring system
  const themeScores: Record<string, number> = {
    transformation: 0,
    courage: 0,
    love: 0,
    uncertainty: 0,
    time: 0,
    self: 0,
    loss: 0,
    joy: 0,
    beginnings: 0,
    endings: 0,
  }

  // TRANSFORMATION: change, growth, evolution, metamorphosis
  if (lowerEnergy.includes('transform') || lowerEnergy.includes('evolv') || lowerEnergy.includes('change')) {
    themeScores.transformation += 3
  }
  if (lowerPersona.includes('seeker') || lowerPersona.includes('wanderer')) themeScores.transformation += 2

  // COURAGE: challenges, new beginnings, bold timelines, overcoming
  if (lowerEnergy.includes('bold') || lowerEnergy.includes('courageous') || lowerEnergy.includes('brave')) {
    themeScores.courage += 3
  }
  if (lowerTimeline.includes('challenge') || lowerTimeline.includes('difficult')) themeScores.courage += 2
  if (lowerEnergy.includes('afraid') || lowerEnergy.includes('fearful')) themeScores.courage += 2

  // LOVE: relationship, connection, heart-centered, intimacy
  if (lowerEnergy.includes('love') || lowerEnergy.includes('heart') || lowerEnergy.includes('connection')) {
    themeScores.love += 3
  }
  if (lowerPersona.includes('lover') || lowerPersona.includes('romantic')) themeScores.love += 2
  if (lowerEnergy.includes('yearning') || lowerEnergy.includes('longing')) themeScores.love += 2

  // UNCERTAINTY: unclear paths, questioning, confusion, doubt
  if (lowerEnergy.includes('uncertain') || lowerEnergy.includes('lost') || lowerEnergy.includes('confused')) {
    themeScores.uncertainty += 3
  }
  if (lowerTimeline.includes('unknown') || lowerTimeline.includes('unclear')) themeScores.uncertainty += 2
  if (lowerPersona.includes('seeker') || lowerPersona.includes('wanderer')) themeScores.uncertainty += 1

  // TIME: patience, waiting, "the year ahead", tempo, seasons
  if (lowerTimeline.includes('future') || lowerTimeline.includes('ahead') || lowerTimeline.includes('year')) {
    themeScores.time += 3
  }
  if (lowerEnergy.includes('patient') || lowerEnergy.includes('waiting')) themeScores.time += 2
  if (lowerTimeline.includes('time') || lowerTimeline.includes('season')) themeScores.time += 2

  // SELF: identity, authenticity, self-discovery, knowing oneself
  if (lowerEnergy.includes('authentic') || lowerEnergy.includes('true self') || lowerEnergy.includes('identity')) {
    themeScores.self += 3
  }
  if (lowerPersona.includes('self') || lowerPersona.includes('authentic')) themeScores.self += 2
  if (lowerEnergy.includes('finding') || lowerEnergy.includes('discovering')) themeScores.self += 2

  // LOSS: grief, endings, letting go, absence
  if (lowerEnergy.includes('grief') || lowerEnergy.includes('loss') || lowerEnergy.includes('mourning')) {
    themeScores.loss += 3
  }
  if (lowerTimeline.includes('past') || lowerTimeline.includes('memory')) themeScores.loss += 2
  if (lowerEnergy.includes('sad') || lowerEnergy.includes('melancholy')) themeScores.loss += 1

  // JOY: celebration, abundance, lightness, delight
  if (lowerEnergy.includes('joyful') || lowerEnergy.includes('celebrat') || lowerEnergy.includes('abundant')) {
    themeScores.joy += 3
  }
  if (lowerEnergy.includes('light') || lowerEnergy.includes('delight')) themeScores.joy += 2
  if (lowerPersona.includes('celebrat')) themeScores.joy += 2

  // BEGINNINGS: fresh starts, "what's next", new chapters, initiation
  if (lowerTimeline.includes('beginning') || lowerTimeline.includes('start') || lowerTimeline.includes('new')) {
    themeScores.beginnings += 3
  }
  if (lowerEnergy.includes('hopeful') || lowerEnergy.includes('optimistic')) themeScores.beginnings += 2
  if (lowerPersona.includes('pioneer') || lowerPersona.includes('starter')) themeScores.beginnings += 2

  // ENDINGS: closure, completion, transitions, finality
  if (lowerTimeline.includes('ending') || lowerTimeline.includes('finish') || lowerTimeline.includes('complete')) {
    themeScores.endings += 3
  }
  if (lowerEnergy.includes('closure') || lowerEnergy.includes('finish')) themeScores.endings += 2
  if (lowerPersona.includes('closer') || lowerPersona.includes('finisher')) themeScores.endings += 2

  // Find highest scoring theme, with fallback
  let selectedTheme = 'self' // Default theme
  let maxScore = -1

  for (const [theme, score] of Object.entries(themeScores)) {
    if (score > maxScore) {
      maxScore = score
      selectedTheme = theme
    }
  }

  return selectedTheme
}

// Select a random quote from a specific theme
function selectRandomQuoteFromTheme(
  theme: string,
  quotes: Record<string, Array<{ text: string; author: string }>>
): { text: string; author: string } | null {
  const themeQuotes = quotes[theme]
  if (!themeQuotes || themeQuotes.length === 0) return null
  return themeQuotes[Math.floor(Math.random() * themeQuotes.length)]
}

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
    // Return a special marker for quote-based poets oracle (will be handled in POST handler)
    return `__POETS_ORACLE__:${persona}:${timeline}:${energy}`
  }

  const ORACLE_PROMPTS: Record<string, string> = {
    'the cards': `You are a reader fluent in archetypal patterns. Your job isn't to describe cards—it's to reveal what they mirror in the seeker's psyche.

Seeker: ${persona}. Energy: ${energy}. Time focus: ${timeline}.

Output: 2-3 sentences, line breaks between each. Max 60 words.

Write like you've seen this person's shadow before. Name the inner pattern playing out. Connect it to one concrete choice they're facing now. No flowery words, no "the universe," no mystical hedging. This is psychological truth dressed plainly.`,

    'the stones': `You speak the language of elemental forces. You read runes as frozen wisdom about power, constraint, timing, and flow.

Seeker: ${persona}. Energy: ${energy}. Time focus: ${timeline}.

Output: 2-3 sentences, line breaks between each. Max 60 words.

Think: What would stone itself teach this person right now? Don't name specific runes—evoke their raw meaning. Use short, declarative sentences. Sound like earth speaking directly. Ground this in their actual situation, not mystical abstraction.`,

    'the stars': `You observe how cosmic timing and terrestrial life collide. Planets don't change people—but their movements reflect the seasons we're already in.

Seeker: ${persona}. Energy: ${energy}. Time focus: ${timeline}.

Output: 2-3 sentences, line breaks between each. Max 60 words.

Name one real shift they should feel coming, tied to actual timing. Use one specific celestial reference (planet, phase, constellation)—make it grounded, not poetic. Tell them what weather they're actually moving into.`,

    'the numbers': `Numbers reveal the rhythm underneath. You see patterns, cycles, frequencies—how energy builds and releases.

Seeker: ${persona}. Energy: ${energy}. Time focus: ${timeline}.

Output: 2-3 sentences, line breaks between each. Max 60 words.

Find the number that matches their actual moment (not numerology speak—real patterns in their life right now). What is this number showing them about timing, sequence, or cycle? Ground it in what they're actually building or completing.`,

    'the coins': `You interpret change itself—when to act, when to yield, how resistance and flow trade places.

Seeker: ${persona}. Energy: ${energy}. Time focus: ${timeline}.

Output: 2-3 sentences, line breaks between each. Max 60 words.

Don't cite I Ching hexagrams. Instead: What does this moment teach about balance? Where are they rigid when they should bend? Where are they soft when they need spine? Speak like someone who's watched power move through systems.`,

    'the dream': `You think in surreal leaps—finding the metaphor embedded in contradiction and strangeness.

Seeker: ${persona}. Energy: ${energy}. Time focus: ${timeline}.

Output: 2-3 sentences, line breaks between each. Max 60 words.

Create one vivid juxtaposition that somehow reveals their situation. Don't be cryptic—be specific. ("You're moving between worlds" = abstract. "You're part mystic, part skeptic, and that friction is your real gift" = the dream made clear). Make it strange but immediately recognizable.`,
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

    let fortune: string

    // Handle "the poets" oracle specially (uses curated quotes instead of AI)
    if (systemPrompt.startsWith('__POETS_ORACLE__')) {
      const quotes = loadPoetsQuotes()
      if (!quotes) {
        return NextResponse.json(
          { error: 'Unable to load quote library. Please try again.' },
          { status: 500 }
        )
      }

      // Extract persona, timeline, energy from marker
      const [, personaPart, timelinePart, energyPart] = systemPrompt.split(':')

      // Get the matching theme for this context
      const theme = getThemeFromContext(personaPart, timelinePart, energyPart)

      // Select a random quote from the matched theme
      const selectedQuote = selectRandomQuoteFromTheme(theme, quotes)

      if (!selectedQuote) {
        return NextResponse.json(
          { error: 'No quotes available for this theme.' },
          { status: 500 }
        )
      }

      // Format the fortune as: "[Quote text]" —[Author name]
      fortune = `"${selectedQuote.text}"\n— ${selectedQuote.author}`
    } else {
      // Call Claude API for other oracles
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
      fortune =
        message.content[0].type === 'text'
          ? message.content[0].text
          : 'The oracle fell silent. Try again later.'
    }

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
