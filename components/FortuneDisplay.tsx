'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { CorpseChoices } from './CorpseBuilder'
import type { DivinationMethod } from './MethodSelector'
import { getTarotCards, getRandomTarotCard, getCardWisdom } from '@/lib/tarot'
import type { TarotCardWithImages } from '@/lib/tarot'
import { selectNumber } from '@/lib/numerology'
import type { NumerologyNumber } from '@/lib/numerology'
import { selectRune } from '@/lib/runes'
import type { RuneData } from '@/lib/runes'

// Helper function to map oracle names to their tradition names
const getOracleDisplayName = (oracleName: string | null): string => {
  if (!oracleName) return ''

  const oracleMap: Record<string, string> = {
    'the cards': 'The Cards (Tarot)',
    'the stones': 'The Stones (Runes)',
    'the coins': 'The Coins (I Ching)',
    'the stars': 'The Stars (Astrology)',
    'the numbers': 'The Numbers (Numerology)',
    'the poets': 'The Poets (Literary Oracle)',
    'the dream': 'The Dream (Surrealism)',
  }

  return oracleMap[oracleName.toLowerCase()] || oracleName
}

// Helper function to generate a Dada corpse interpretation
const generateCorpseInterpretation = (corpseText: string | undefined, choices: CorpseChoices): string => {
  if (!corpseText) {
    return `Your hybrid form whispers of transformation. In the collision of ${choices.character} with ${choices.energy} energy, find the message meant for you. The cut-up reveals: your path forward embraces the unexpected.`
  }

  // Generate different interpretations based on the corpse
  const interpretations = [
    `Your exquisite corpse speaks: a creature born of ${choices.character}'s spirit now guides you through ${choices.timeframe} with ${choices.energy} energy. What emerges is strange and true—your transformation is already underway.`,
    `The hybrid form you've assembled reveals: strength from unexpected places, a convergence of the ${choices.character} and the ${choices.energy}. Trust this strange wisdom for your ${choices.timeframe}—the absurd path is sometimes the truest one.`,
    `Your cut-up creation suggests a daring shift: the ${choices.character} within you, powered by ${choices.energy}, must venture into ${choices.timeframe} without fear. The corpse you've built from fragments points toward liberation.`,
    `In this assembled form—part ${choices.character}, part dream—lies a secret: ${choices.timeframe} asks you to embrace the contradictions. Your ${choices.energy} energy becomes the binding force holding meaning together from chaos.`,
  ]

  return interpretations[Math.floor(Math.random() * interpretations.length)]
}

interface FortuneDisplayProps {
  fortuneChoices?: CorpseChoices
  fortuneType?: string
  selections?: Record<string, string>
  method?: DivinationMethod
  tarotCard?: TarotCardWithImages
  onReset?: () => void
}

export default function FortuneDisplay({ fortuneChoices, method, tarotCard: initialCard, onReset }: FortuneDisplayProps) {
  const [fortune, setFortune] = useState<string>('')
  const [isRevealing, setIsRevealing] = useState(false)
  const [tarotCard, setTarotCard] = useState<TarotCardWithImages | null>(initialCard || null)
  const [numerologyNumber, setNumerologyNumber] = useState<NumerologyNumber | null>(null)
  const [runeData, setRuneData] = useState<RuneData | null>(null)

  useEffect(() => {
    // Generate fortune based on corpse choices and divination method
    if (fortuneChoices) {
      setTimeout(async () => {
        const generatedFortune = await generateContextualFortune(fortuneChoices, method, initialCard)
        setFortune(generatedFortune)
        setIsRevealing(true)
        if (initialCard) {
          setTarotCard(initialCard)
        }
      }, 500)
    }
  }, [fortuneChoices, method, initialCard])

  const generateContextualFortune = async (choices: CorpseChoices, method?: DivinationMethod, card?: TarotCardWithImages): Promise<string> => {
    const oracleName = choices.lens || 'the cards'

    // Special handling for Surrealist oracle: interpret the exquisite corpse
    if (oracleName === 'the dream' && method === 'surrealism') {
      return generateCorpseInterpretation(choices.corpse, choices)
    }

    // List of oracles that use Claude AI
    const aiOracleMap: Record<string, boolean> = {
      'the stars': true,
      'the coins': true,
      'the poets': true,
    }

    // Check if we should use API for this oracle
    if (aiOracleMap[oracleName]) {
      try {
        const response = await fetch('/api/generate-fortune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            character: choices.character,
            timeframe: choices.timeframe,
            energy: choices.energy,
            lens: oracleName,
          }),
        })

        const data = await response.json()
        if (data.success && data.fortune) {
          return data.fortune
        } else if (!response.ok) {
          console.error('API error:', data.error)
          return data.error || 'The oracle fell silent. Please try again.'
        }
      } catch (error) {
        console.error('Fortune API error:', error)
        return 'The stars are obscured today. Please try again.'
      }
    }

    // For non-AI oracles, use template-based fortunes
    // For tarot, use provided card or load new one
    let cardWisdom = ''
    if (method === 'tarot') {
      try {
        const cardToUse = card || getRandomTarotCard(await getTarotCards())
        if (cardToUse) {
          setTarotCard(cardToUse)
          cardWisdom = getCardWisdom(cardToUse)
        }
      } catch (error) {
        console.error('Failed to load tarot card:', error)
      }
    }

    // For numerology, select a number
    let numberData: NumerologyNumber | null = null
    if (method === 'numerology') {
      numberData = selectNumber()
      setNumerologyNumber(numberData)
    }

    // For runes, select a rune
    let selectedRune: RuneData | null = null
    if (method === 'runes') {
      selectedRune = selectRune()
      setRuneData(selectedRune)
    }

    // Method-specific fortune templates - pure guidance without literal choice listing
    const fortunesByMethod: Record<DivinationMethod, (wisdom?: string | NumerologyNumber | RuneData) => string[]> = {
      tarot: (wisdom?: string | NumerologyNumber | RuneData) => {
        const wisdomLine = (typeof wisdom === 'string' ? wisdom : '') || 'Trust the path before you.'
        return [
          `${wisdomLine} This wisdom guides your path forward with clarity and purpose.`,
          `The cards reveal: ${wisdomLine} Let this be your witness in the moments ahead.`,
          `The universe whispers: ${wisdomLine} See this truth illuminated in your journey.`,
          `The oracle speaks: ${wisdomLine} Trust what unfolds before you now.`,
        ]
      },
      oracle: (wisdom?: string | NumerologyNumber | RuneData) => [
        `Ancient knowing awakens within you. Step forward with grace and trust the wisdom that emerges.`,
        `The universe sends currents of possibility through your path. See through eyes of clarity and understanding.`,
        `Your truth unfolds with revelation. Trust the vision that emerges from within.`,
      ],
      numerology: (num?: string | NumerologyNumber | RuneData) => {
        const number = (typeof num === 'object' && !('symbol' in num) ? num : null) as NumerologyNumber | null
        if (!number) return [`The numbers speak, but remain silent for now. Trust the rhythm.`]
        return [
          `${number.number}—${number.keyword}. ${number.detailed_meaning.substring(0, 120)}... This is your moment to embody this energy and transform your path.`,
          `You are ${number.number}—${number.keyword}. ${number.detailed_meaning.substring(0, 100)}... Your path is illuminated by this cosmic truth.`,
          `${number.number}—${number.keyword} emerges as your guide. ${number.detailed_meaning.substring(0, 110)}... Let this wisdom be your compass.`,
        ]
      },
      runes: (rune?: string | NumerologyNumber | RuneData) => {
        const runeObj = (typeof rune === 'object' && 'symbol' in rune ? rune : null) as RuneData | null
        if (!runeObj) return [`The stones remain silent. The runes will speak in their own time.`]
        return [
          `${runeObj.name}—${runeObj.keyword}. ${runeObj.detailed_meaning.substring(0, 120)}... This ancient stone speaks truth to your journey ahead.`,
          `${runeObj.name}—${runeObj.keyword}. ${runeObj.detailed_meaning.substring(0, 110)}... The Elder Futhark reveals itself as your guide.`,
          `${runeObj.name} emerges as your sign. ${runeObj.detailed_meaning.substring(0, 120)}... The stones have spoken. Trust the path that reveals itself.`,
        ]
      },
      astrology: (wisdom?: string | NumerologyNumber | RuneData) => [
        `The stars align with your intention. This passage asks for movement and presence. Trust the cosmic counsel that guides you.`,
        `Your constellation burns bright. The stellar influence brings wisdom and clarity. Trust what the heavens show you.`,
        `The planets speak to your spirit. In this season, harness the cosmic force that flows through you. The astral plane reveals what you need to know.`,
      ],
      surrealism: (wisdom?: string | NumerologyNumber | RuneData) => [
        `The dream reveals what waking cannot. In the irrational lies your deepest truth. Follow the strange logic of your inner landscape.`,
        `Here, time bends and forms shift like water. Your exquisite corpse speaks of becoming. Trust the wisdom of the unconscious unfolding.`,
        `In the realm between worlds, opposites dance together. Your path blooms from contradiction. Let the surreal show you what is most real.`,
      ],
    }

    // Get fortunes for the selected method, or use tarot as default
    let wisdomData: string | NumerologyNumber | RuneData | undefined
    if (method === 'numerology') {
      wisdomData = numberData || undefined
    } else if (method === 'runes') {
      wisdomData = selectedRune || undefined
    } else {
      wisdomData = cardWisdom
    }
    const methodFortunes = method && fortunesByMethod[method]
      ? fortunesByMethod[method](wisdomData)
      : fortunesByMethod.tarot(cardWisdom)
    return methodFortunes[Math.floor(Math.random() * methodFortunes.length)]
  }

  if (!fortune) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 py-12 relative z-10 ${isRevealing ? 'animate-fade-in' : ''}`}>
      {/* 1. Page Header */}
      <div className="text-center mb-12 animate-slide-in-up">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-neutral-950 mb-2 tracking-tight">Fortunegram</h1>
        <p className="text-neutral-600 font-serif italic">Daily directions from the beyond.</p>
      </div>

      {/* 2. "YOUR READING" Label */}
      <div className="text-center mb-10 animate-scale-in" style={{animationDelay: '0.1s'}}>
        <div className="inline-block px-4 py-2 card backdrop-blur-lg">
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Your Reading
          </span>
        </div>
      </div>

      {/* 3. Oracle Card - displays the divination object (tarot, rune, number, etc) */}
      <div className="card p-12 mb-12 flex flex-col items-center animate-scale-in" style={{animationDelay: '0.2s'}}>
        {/* AI Oracle Card Display */}
        {method === 'astrology' && fortuneChoices?.lens === 'the stars' && (
          <>
            <div className="font-mono text-sm leading-relaxed text-neutral-700 mb-6 whitespace-pre">
{`   *  .-.  *
  .  (   )
    . \`~' .
  *     *`}
            </div>
            <h2 className="text-2xl font-serif text-neutral-950 mb-2">The Stars</h2>
            <p className="text-sm text-neutral-600">Astrology</p>
          </>
        )}

        {method === 'surrealism' && fortuneChoices?.lens === 'the coins' && (
          <>
            <div className="font-mono text-sm leading-relaxed text-neutral-700 mb-6 whitespace-pre">
{`  ═══════    ═══ ═══
  ═══ ═══    ═══════
  ═══════    ═══ ═══`}
            </div>
            <h2 className="text-2xl font-serif text-neutral-950 mb-2">The Coins</h2>
            <p className="text-sm text-neutral-600">I Ching</p>
          </>
        )}

        {method === 'oracle' && fortuneChoices?.lens === 'the poets' && (
          <>
            <div className="font-mono text-sm leading-relaxed text-neutral-700 mb-6 whitespace-pre">
{`   ___
  |___|
  | | |
  | | |
   \\|/
    V`}
            </div>
            <h2 className="text-2xl font-serif text-neutral-950 mb-2">The Poets</h2>
            <p className="text-sm text-neutral-600">Literary Oracle</p>
          </>
        )}

        {method === 'surrealism' && fortuneChoices?.lens === 'the dream' && (
          <>
            <div className="font-mono text-sm leading-relaxed text-neutral-700 mb-6 whitespace-pre">
{`     ______
    /  12  \\
   |    •   |
   | 9    3 |~
   |    6   |~~
    \\______/~~~
       ||~~~~
      ~~~`}
            </div>
            <h2 className="text-2xl font-serif text-neutral-950 mb-2">The Dream</h2>
            <p className="text-sm text-neutral-600">Surrealism</p>
          </>
        )}
        {/* Tarot Card Display */}
        {tarotCard && method === 'tarot' && (
          <>
            <div className="relative w-40 h-72 mb-8 rounded-lg shadow-md bg-white flex items-center justify-center">
              <Image
                src={`/tarot-cards/${tarotCard.img}`}
                alt={tarotCard.name}
                width={160}
                height={280}
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-serif text-neutral-950 mb-2">{tarotCard.name}</h2>
            <p className="text-sm text-neutral-600">{tarotCard.arcana}</p>
          </>
        )}

        {/* Numerology Number Display */}
        {numerologyNumber && method === 'numerology' && (
          <>
            <div className="font-mono text-xs leading-relaxed text-neutral-700 mb-6 whitespace-pre">
{`    *  ┌────┬────┬────┐
       │ 1  │ 2  │ 3  │
       ├────┼────┼────┤  *
       │ 4  │ 5  │ 6  │
    *  ├────┼────┼────┤
       │ 7  │ 8  │ 9  │
       ├────┼────┼────┤
       │ 11 │ 22 │ 33 │
       └────┴────┴────┘  *`}
            </div>
            <h2 className="text-2xl font-serif text-neutral-950 mb-2">{numerologyNumber.keyword}</h2>
            <p className="text-sm text-neutral-600 max-w-sm text-center">{numerologyNumber.meaning}</p>
          </>
        )}

        {/* Runes Display */}
        {runeData && method === 'runes' && (
          <>
            <div className="text-9xl font-bold font-serif text-neutral-950 mb-4 leading-none">
              {runeData.symbol}
            </div>
            <h2 className="text-2xl font-serif text-neutral-950 mb-2">{runeData.name}</h2>
            <p className="text-sm text-neutral-600 italic">{runeData.keyword}</p>
          </>
        )}
      </div>

      {/* 4. Fortune Reading - displays the synthesized reading (moved before corpse) */}
      <div className="card p-12 mb-12 animate-scale-in" style={{animationDelay: '0.3s'}}>
        <div className="text-xl leading-8 text-neutral-800 font-serif text-center italic space-y-4">
          {fortune.split(/(?<=[.!?])\s+/).map((sentence, index) => (
            <p key={index} className="animate-fade-in" style={{animationDelay: `${0.4 + index * 0.05}s`}}>
              {sentence.trim()}
            </p>
          ))}
        </div>
      </div>

      {/* 5. ASCII Corpse Display (moved after fortune) */}
      {fortuneChoices?.corpse && (
        <div className="card p-8 mb-12 flex flex-col items-center animate-scale-in" style={{animationDelay: '0.4s'}}>
          <div className="font-mono text-sm leading-snug text-neutral-700 whitespace-pre overflow-x-auto">
            {fortuneChoices.corpse}
          </div>
        </div>
      )}

      {/* 6. "YOUR JOURNEY" Section with table format */}
      {fortuneChoices && (
        <div className="mb-12 animate-slide-in-up" style={{animationDelay: '0.5s'}}>
          <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-6 text-center">Your Journey</h3>
          <div className="card overflow-hidden">
            <div className="divide-y divide-neutral-200">
              <div className="flex">
                <div className="w-1/3 px-4 py-3 bg-neutral-50 border-r border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Persona</p>
                </div>
                <div className="w-2/3 px-4 py-3">
                  <p className="text-sm text-neutral-950 capitalize">{fortuneChoices.character}</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 px-4 py-3 bg-neutral-50 border-r border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Timeline</p>
                </div>
                <div className="w-2/3 px-4 py-3">
                  <p className="text-sm text-neutral-950 capitalize">{fortuneChoices.timeframe}</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 px-4 py-3 bg-neutral-50 border-r border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Energy</p>
                </div>
                <div className="w-2/3 px-4 py-3">
                  <p className="text-sm text-neutral-950 capitalize">{fortuneChoices.energy}</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 px-4 py-3 bg-neutral-50 border-r border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Oracle</p>
                </div>
                <div className="w-2/3 px-4 py-3">
                  <p className="text-sm text-neutral-950 capitalize">
                    {getOracleDisplayName(fortuneChoices.lens)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap mb-8">
        <button className="btn btn-secondary">Share</button>
        {onReset && (
          <button onClick={onReset} className="btn btn-secondary">
            New Reading
          </button>
        )}
      </div>
    </div>
  )
}
