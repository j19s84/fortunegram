'use client'

import { useEffect, useState } from 'react'
import { FortuneType } from './FortuneWheel'
import { getFortune } from '@/lib/fortunes'

interface FortuneDisplayProps {
  fortuneType: FortuneType
  selections: Record<string, string>
}

const FORTUNE_LABELS: Record<FortuneType, string> = {
  tarot: 'Your Tarot Reading',
  runes: 'Your Rune Divination',
  iching: 'Your I Ching Wisdom',
  numerology: 'Your Numerology Insight',
  aiWitch: 'Your Witch\'s Guidance',
}

export default function FortuneDisplay({ fortuneType, selections }: FortuneDisplayProps) {
  const [fortune, setFortune] = useState<string>('')
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    // Simulate fortune generation based on selections
    setTimeout(() => {
      const generatedFortune = getFortune(fortuneType, selections)
      setFortune(generatedFortune)
      setIsRevealing(true)
    }, 500)
  }, [fortuneType, selections])

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
            {FORTUNE_LABELS[fortuneType]}
          </span>
        </div>
      </div>

      {/* Fortune Card */}
      <div className="card p-8 mb-8">
        <p className="text-lg leading-relaxed text-neutral-700 font-serif text-center">
          "{fortune}"
        </p>
      </div>

      {/* Selection Summary */}
      <div className="bg-neutral-50 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-neutral-900 mb-4">Your Selections</h4>
        <div className="grid grid-cols-1 gap-2 text-sm text-neutral-600">
          {Object.entries(selections).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key.replace('question_', 'Question ')}</span>
              <span className="font-medium text-neutral-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8 justify-center">
        <button className="btn btn-secondary">Save Fortune</button>
        <button className="btn btn-secondary">Share</button>
      </div>
    </div>
  )
}
