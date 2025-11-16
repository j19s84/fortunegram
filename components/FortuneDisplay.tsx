'use client'

import { useEffect, useState } from 'react'
import type { CorpseChoices } from './CorpseBuilder'

interface FortuneDisplayProps {
  fortuneChoices?: CorpseChoices
  fortuneType?: string
  selections?: Record<string, string>
}

export default function FortuneDisplay({ fortuneChoices, fortuneType, selections }: FortuneDisplayProps) {
  const [fortune, setFortune] = useState<string>('')
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    // Simulate fortune generation based on corpse choices
    if (fortuneChoices) {
      setTimeout(() => {
        const generatedFortune = generateCorpseFortune(fortuneChoices)
        setFortune(generatedFortune)
        setIsRevealing(true)
      }, 500)
    }
  }, [fortuneChoices])

  const generateCorpseFortune = (choices: CorpseChoices): string => {
    const fortunes = [
      `Your ${choices.character} seeks wisdom ${choices.timeframe?.toLowerCase()}. Move with a ${choices.energy?.toLowerCase()} approach through ${choices.lens?.toLowerCase()} perspective.`,
      `The universe speaks through ${choices.character}. In this moment of ${choices.timeframe?.toLowerCase()}, embrace ${choices.energy?.toLowerCase()} energy. View all through ${choices.lens?.toLowerCase()} eyes.`,
      `${choices.character} awakens to possibility. What calls to you ${choices.timeframe?.toLowerCase()} arrives with ${choices.energy?.toLowerCase()} force. Trust ${choices.lens?.toLowerCase()} wisdom.`,
      `In the dance of fate, ${choices.character} moves ${choices.energy?.toLowerCase()}. The ${choices.timeframe?.toLowerCase()} unfolds with ${choices.lens?.toLowerCase()} revelation awaiting.`,
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
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
    <div className={`w-full max-w-2xl mx-auto ${isRevealing ? 'animate-fade-in' : ''}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 bg-neutral-100 rounded-full mb-4">
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Your Exquisite Corpse
          </span>
        </div>
      </div>

      {/* Fortune Card */}
      <div className="card p-8 mb-8">
        <p className="text-2xl leading-relaxed text-neutral-800 font-serif text-center italic">
          &quot;{fortune}&quot;
        </p>
      </div>

      {/* Selection Summary */}
      {fortuneChoices && (
        <div className="bg-neutral-50 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-neutral-900 mb-4">Your Corpse Composition</h4>
          <div className="grid grid-cols-1 gap-2 text-sm text-neutral-600">
            <div className="flex justify-between">
              <span>Character (Head)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.character}</span>
            </div>
            <div className="flex justify-between">
              <span>Timeframe (Torso)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.timeframe}</span>
            </div>
            <div className="flex justify-between">
              <span>Energy (Legs)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.energy}</span>
            </div>
            <div className="flex justify-between">
              <span>Lens (Feet)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.lens}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-8 justify-center">
        <button className="btn btn-secondary">Save Fortune</button>
        <button className="btn btn-secondary">Share</button>
      </div>
    </div>
  )
}
