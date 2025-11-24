'use client'

import { useState, useEffect } from 'react'
import TypewriterText from './TypewriterText'
import type { DivinationMethod } from './MethodSelector'
import { getTarotCards, getRandomTarotCard, getCardWisdom } from '@/lib/tarot'
import type { TarotCardWithImages } from '@/lib/tarot'
import { selectRune } from '@/lib/runes'
import type { RuneData } from '@/lib/runes'

interface RitualRevealProps {
  method: DivinationMethod
  onComplete: (card?: TarotCardWithImages) => void
}

const ORACLE_FIGURES = [
  `   ◆ ◇ ◆
   ◆ • ◆
  ◇ ◆ ◇ ◆
   ◆ ◇ ◆
   ◆ • ◆`,
  `  ∿ ◇ ∿
  ◇ ◆ ◇
 ∿ ◆ • ◆ ∿
  ◇ ◆ ◇
  ∿ ◇ ∿`,
  `  ☆ • ☆
 ◇ ◆ ◆ ◆ ◇
  ◇ ◆ • ◆ ◇
 ☆ ◆ ◇ ◆ ☆
  ◆ • ◆`,
]

const RUNE_STONES = [
  { symbol: 'ᚠ', name: 'Fehu - Cattle' },
  { symbol: 'ᚢ', name: 'Uruz - Aurochs' },
  { symbol: 'ᚦ', name: 'Thurisaz - Thorn' },
  { symbol: 'ᚨ', name: 'Ansuz - Mouth' },
  { symbol: 'ᚱ', name: 'Raido - Ride' },
  { symbol: 'ᚲ', name: 'Kenaz - Torch' },
  { symbol: 'ᚳ', name: 'Gebo - Gift' },
  { symbol: 'ᚹ', name: 'Wunjo - Joy' },
]

const DADA_WORDS = [
  'shimmer', 'void', 'cascade', 'whisper', 'mirror',
  'shadow', 'bloom', 'echo', 'spiral', 'threshold',
  'luminous', 'drift', 'unfold', 'arise', 'dissolve',
]

function TarotReveal({ onComplete }: { onComplete: (card?: TarotCardWithImages) => void }) {
  useEffect(() => {
    const loadCard = async () => {
      const cards = await getTarotCards()
      const selectedCard = getRandomTarotCard(cards)
      // Auto-complete after loading (1s delay for animation)
      setTimeout(() => {
        if (selectedCard) {
          onComplete(selectedCard)
        } else {
          onComplete()
        }
      }, 1000)
    }
    loadCard()
  }, [onComplete])

  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="w-24 h-24 mx-auto border-2 border-neutral-200 rounded-full animate-spin" />
      <p className="text-neutral-600 italic font-serif mt-6">Channeling the cards...</p>
    </div>
  )
}

function OracleReveal({ onComplete }: { onComplete: () => void }) {
  const figure = ORACLE_FIGURES[Math.floor(Math.random() * ORACLE_FIGURES.length)]

  useEffect(() => {
    // Auto-complete after showing oracle figure
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="font-mono text-neutral-700 whitespace-pre leading-snug">
        <TypewriterText text={figure} speed={50} showCursor={false} />
      </div>
      <p className="text-neutral-600 italic font-serif">The oracle speaks...</p>
    </div>
  )
}

function NumerologyReveal({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Auto-complete after animation
    const timer = setTimeout(() => {
      onComplete()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="text-9xl font-bold text-neutral-950 font-serif">?</div>
      <div className="w-24 h-24 mx-auto border-2 border-neutral-200 rounded-full animate-spin" />
      <p className="text-neutral-600 italic font-serif">Calculating your number...</p>
    </div>
  )
}

function AstrologyReveal({ onComplete }: { onComplete: () => void }) {
  const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]

  useEffect(() => {
    // Auto-complete after showing symbol
    const timer = setTimeout(() => {
      onComplete()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="text-8xl font-bold">{symbol}</div>
      <p className="text-neutral-600 italic font-serif">The stars align...</p>
    </div>
  )
}

function RunesReveal({ onComplete }: { onComplete: () => void }) {
  const [rune, setRune] = useState<RuneData | null>(null)

  useEffect(() => {
    // Auto-select rune and auto-proceed after animation
    const selectedRune = selectRune()
    setRune(selectedRune)
    const timer = setTimeout(() => {
      onComplete()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!rune) {
    return (
      <div className="text-center space-y-8">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="text-9xl font-bold font-serif">{rune.symbol}</div>
      <div className="w-24 h-24 mx-auto border-2 border-neutral-200 rounded-full animate-spin" />
      <p className="text-neutral-600 italic font-serif">Channeling rune wisdom...</p>
    </div>
  )
}

function DadaismReveal({ onComplete }: { onComplete: () => void }) {
  const word = DADA_WORDS[Math.floor(Math.random() * DADA_WORDS.length)]

  useEffect(() => {
    // Auto-complete after showing word
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="text-center space-y-8 animate-fade-in">
      <p className="text-neutral-600 italic font-serif mb-6">The word chooses:</p>
      <p className="text-5xl font-serif font-bold text-neutral-950">{word}</p>
    </div>
  )
}

export default function RitualReveal({ method, onComplete }: RitualRevealProps) {
  return (
    <div className="w-full max-w-md mx-auto py-12">
      {method === 'tarot' && <TarotReveal onComplete={onComplete} />}
      {method === 'oracle' && <OracleReveal onComplete={onComplete} />}
      {method === 'numerology' && <NumerologyReveal onComplete={onComplete} />}
      {method === 'astrology' && <AstrologyReveal onComplete={onComplete} />}
      {method === 'runes' && <RunesReveal onComplete={onComplete} />}
      {method === 'surrealism' && <DadaismReveal onComplete={onComplete} />}
    </div>
  )
}
