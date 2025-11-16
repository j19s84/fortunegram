'use client'

import { useState, useEffect } from 'react'
import TypewriterText from './TypewriterText'
import type { DivinationMethod } from './MethodSelector'

interface RitualRevealProps {
  method: DivinationMethod
  onComplete: () => void
}

const TAROT_CARDS = [
  { name: 'The Fool', symbol: '○' },
  { name: 'The Magician', symbol: '⚡' },
  { name: 'The High Priestess', symbol: '◯' },
  { name: 'The Empress', symbol: '👑' },
  { name: 'The Emperor', symbol: '⬢' },
  { name: 'The Hierophant', symbol: '†' },
  { name: 'The Lovers', symbol: '∞' },
  { name: 'The Chariot', symbol: '◆' },
  { name: 'Strength', symbol: '✦' },
  { name: 'The Hermit', symbol: '◈' },
  { name: 'The Tower', symbol: '⚡' },
  { name: 'The Star', symbol: '✦' },
]

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

function TarotReveal({ onComplete }: { onComplete: () => void }) {
  const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)]
  const [showCard, setShowCard] = useState(false)

  return (
    <div className="text-center space-y-8">
      <div className="text-6xl mb-4">
        {!showCard ? (
          <div className="animate-pulse">🂠</div>
        ) : (
          <div className="animate-fade-in">{card.symbol}</div>
        )}
      </div>
      {showCard && (
        <div className="animate-fade-in space-y-4">
          <h3 className="text-3xl font-serif text-neutral-950">{card.name}</h3>
          <button
            onClick={onComplete}
            className="btn btn-primary mx-auto"
          >
            Reveal Fortune
          </button>
        </div>
      )}
      {!showCard && (
        <button
          onClick={() => setShowCard(true)}
          className="btn btn-secondary mx-auto"
        >
          Draw Card
        </button>
      )}
    </div>
  )
}

function OracleReveal({ onComplete }: { onComplete: () => void }) {
  const figure = ORACLE_FIGURES[Math.floor(Math.random() * ORACLE_FIGURES.length)]
  const [shown, setShown] = useState(false)

  return (
    <div className="text-center space-y-8">
      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="btn btn-secondary mx-auto"
        >
          Consult the Oracle
        </button>
      ) : (
        <div className="animate-fade-in space-y-6">
          <div className="font-mono text-neutral-700 whitespace-pre leading-snug">
            <TypewriterText text={figure} speed={50} showCursor={false} />
          </div>
          <p className="text-neutral-600 italic font-serif">The oracle speaks...</p>
          <button
            onClick={onComplete}
            className="btn btn-primary mx-auto"
          >
            Reveal Fortune
          </button>
        </div>
      )}
    </div>
  )
}

function NumerologyReveal({ onComplete }: { onComplete: () => void }) {
  const number = Math.floor(Math.random() * 9) + 1
  const [shown, setShown] = useState(false)

  return (
    <div className="text-center space-y-8">
      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="btn btn-secondary mx-auto"
        >
          Calculate Number
        </button>
      ) : (
        <div className="animate-fade-in space-y-6">
          <div className="text-8xl font-bold text-neutral-950 font-serif">
            {number}
          </div>
          <p className="text-neutral-600 italic font-serif">Your number is {number}</p>
          <button
            onClick={onComplete}
            className="btn btn-primary mx-auto"
          >
            Reveal Fortune
          </button>
        </div>
      )}
    </div>
  )
}

function AstrologyReveal({ onComplete }: { onComplete: () => void }) {
  const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  const symbol = symbols[Math.floor(Math.random() * symbols.length)]
  const [shown, setShown] = useState(false)

  return (
    <div className="text-center space-y-8">
      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="btn btn-secondary mx-auto"
        >
          Read the Stars
        </button>
      ) : (
        <div className="animate-fade-in space-y-6">
          <div className="text-8xl font-bold">
            {symbol}
          </div>
          <p className="text-neutral-600 italic font-serif">The stars align...</p>
          <button
            onClick={onComplete}
            className="btn btn-primary mx-auto"
          >
            Reveal Fortune
          </button>
        </div>
      )}
    </div>
  )
}

function RunesReveal({ onComplete }: { onComplete: () => void }) {
  const rune = RUNE_STONES[Math.floor(Math.random() * RUNE_STONES.length)]
  const [shown, setShown] = useState(false)

  return (
    <div className="text-center space-y-8">
      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="btn btn-secondary mx-auto"
        >
          Cast the Runes
        </button>
      ) : (
        <div className="animate-fade-in space-y-6">
          <div className="text-8xl font-bold font-serif">
            {rune.symbol}
          </div>
          <p className="text-lg font-serif text-neutral-950">{rune.name}</p>
          <button
            onClick={onComplete}
            className="btn btn-primary mx-auto"
          >
            Reveal Fortune
          </button>
        </div>
      )}
    </div>
  )
}

function DadaismReveal({ onComplete }: { onComplete: () => void }) {
  const word = DADA_WORDS[Math.floor(Math.random() * DADA_WORDS.length)]
  const [shown, setShown] = useState(false)

  return (
    <div className="text-center space-y-8">
      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="btn btn-secondary mx-auto"
        >
          Cut the Text
        </button>
      ) : (
        <div className="animate-fade-in space-y-6">
          <p className="text-neutral-600 italic font-serif mb-6">The word chooses:</p>
          <p className="text-5xl font-serif font-bold text-neutral-950">
            {word}
          </p>
          <button
            onClick={onComplete}
            className="btn btn-primary mx-auto"
          >
            Reveal Fortune
          </button>
        </div>
      )}
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
      {method === 'dadaism' && <DadaismReveal onComplete={onComplete} />}
    </div>
  )
}
