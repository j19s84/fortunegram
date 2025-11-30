'use client'

import { useState, useEffect } from 'react'
import { Answers } from './QuestionsSelector'

interface OracleFortuneProps {
  oracle: string
  answers: Answers
  corpse?: string
  onReset: () => void
}

export default function OracleFortune({
  oracle,
  answers,
  corpse,
  onReset,
}: OracleFortuneProps) {
  const [fortune, setFortune] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateFortune = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/generate-fortune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            character: answers.character,
            timeframe: answers.timeframe,
            energy: answers.energy,
            lens: oracle,
            corpse: corpse,
          }),
        })
        const data = await response.json()
        setFortune(data.fortune || 'The oracle speaks in silence...')
      } catch (error) {
        console.error('Fortune generation error:', error)
        setFortune('The oracle is obscured by shadow. Try again another day.')
      }
      setIsLoading(false)
    }

    generateFortune()
  }, [oracle, answers, corpse])

  const getOracleTitle = (): string => {
    const titles: Record<string, string> = {
      'the cards': 'The Tarot Speaks',
      'the stones': 'The Runes Reveal',
      'the stars': 'The Cosmos Whispers',
      'the numbers': 'The Numbers Align',
      'the coins': 'The I Ching Moves',
      'the poets': 'The Poets Sing',
      'the dream': 'Your Exquisite Corpse Speaks',
    }
    return titles[oracle] || 'Your Fortune'
  }

  const getOracleDescription = (): string => {
    const descriptions: Record<string, string> = {
      'the cards': 'In the dance of cards, your path is revealed',
      'the stones': 'Ancient stones carry wisdom from the earth',
      'the stars': 'The celestial bodies chart your course',
      'the numbers': 'Divine mathematics guides your way',
      'the coins': 'The great cycle turns, reflecting your journey',
      'the poets': 'Literary voices echo across time',
      'the dream': 'From the collision of the absurd, truth emerges',
    }
    return descriptions[oracle] || 'Listen to the voice that calls'
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col items-center justify-start min-h-screen pt-16 sm:pt-24 px-4">
        {/* Oracle Title */}
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 sm:mb-6 drop-shadow-lg capitalize">
          {getOracleTitle()}
        </h2>

        {/* Oracle Description */}
        <p className="text-center text-sm sm:text-base text-gray-300 mb-12 sm:mb-16 italic max-w-2xl">
          {getOracleDescription()}
        </p>

        {/* Your Answers Summary */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 sm:p-8 w-full max-w-2xl mb-8">
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Seeker</p>
              <p className="text-sm sm:text-base font-semibold text-white capitalize">
                {answers.character}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Timeline</p>
              <p className="text-sm sm:text-base font-semibold text-white capitalize">
                {answers.timeframe}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Energy</p>
              <p className="text-sm sm:text-base font-semibold text-white capitalize">
                {answers.energy}
              </p>
            </div>
          </div>

          {/* Corpse Display (for Surrealist) */}
          {corpse && (
            <div className="mb-6 pb-6 border-b border-white/20">
              <p className="text-xs sm:text-sm text-gray-400 mb-3">Your Exquisite Corpse</p>
              <div className="font-mono text-xs sm:text-sm leading-relaxed text-gray-100 whitespace-pre bg-black/30 rounded p-4 max-h-40 overflow-y-auto">
                {corpse}
              </div>
            </div>
          )}
        </div>

        {/* Fortune Display */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-8 sm:p-10 w-full max-w-2xl mb-12">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white mx-auto mb-4" />
              <p className="text-gray-300 italic">The oracle concentrates...</p>
            </div>
          ) : (
            <div>
              <p className="text-white leading-relaxed text-base sm:text-lg font-serif">
                {fortune}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <button
            onClick={onReset}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            New Reading
          </button>
          <button
            onClick={() => {
              const text = `${getOracleTitle()}\n\n${fortune}`
              if (navigator.share) {
                navigator.share({ title: 'Fortunegram', text })
              } else {
                navigator.clipboard.writeText(text)
                alert('Fortune copied to clipboard!')
              }
            }}
            className="flex-1 px-8 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 text-white font-semibold transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
