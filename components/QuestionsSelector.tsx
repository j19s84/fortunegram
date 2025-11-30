'use client'

import { useState, useEffect } from 'react'
import { PERSONAS, getRandomPersonas } from '@/lib/personas'
import { TIMELINES, getRandomTimelines } from '@/lib/timelines'
import { ENERGIES, getRandomEnergies } from '@/lib/energies'

export interface Answers {
  character: string | null
  timeframe: string | null
  energy: string | null
}

interface QuestionsSelectorProps {
  onComplete: (answers: Answers) => void
}

const capitalize = (str: string): string => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export default function QuestionsSelector({ onComplete }: QuestionsSelectorProps) {
  const [characterOptions, setCharacterOptions] = useState<string[]>([])
  const [timelineOptions, setTimelineOptions] = useState<string[]>([])
  const [energyOptions, setEnergyOptions] = useState<string[]>([])

  const [answers, setAnswers] = useState<Answers>({
    character: null,
    timeframe: null,
    energy: null,
  })

  const [currentQuestion, setCurrentQuestion] = useState<'character' | 'timeframe' | 'energy'>('character')
  const [showQuestion, setShowQuestion] = useState(true)

  // Initialize options on mount
  useEffect(() => {
    setCharacterOptions(getRandomPersonas(3))
    setTimelineOptions(getRandomTimelines(2))
    setEnergyOptions(getRandomEnergies(2))
  }, [])

  const handleCharacterSelect = (char: string) => {
    setShowQuestion(false)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, character: char }))
      setCurrentQuestion('timeframe')
      setShowQuestion(true)
    }, 300)
  }

  const handleTimeframeSelect = (time: string) => {
    setShowQuestion(false)
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, timeframe: time }))
      setCurrentQuestion('energy')
      setShowQuestion(true)
    }, 300)
  }

  const handleEnergySelect = (energy: string) => {
    setShowQuestion(false)
    setTimeout(() => {
      const updatedAnswers = { ...answers, energy }
      setAnswers(updatedAnswers)
      // Auto-complete after brief delay to show selection
      setTimeout(() => {
        onComplete(updatedAnswers)
      }, 300)
    }, 300)
  }

  const progressPercentage = {
    character: 33,
    timeframe: 66,
    energy: 100,
  }[currentQuestion]

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col items-center justify-start min-h-screen pt-16 sm:pt-24 px-4">
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8 sm:mb-12">
          <div className="flex justify-between mb-2 text-xs sm:text-sm text-gray-300">
            <span>Question {currentQuestion === 'character' ? '1' : currentQuestion === 'timeframe' ? '2' : '3'} of 3</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="w-full max-w-2xl">
          {/* Character Question */}
          {currentQuestion === 'character' && (
            <div className={`transition-opacity duration-300 ${showQuestion ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 sm:mb-12 drop-shadow-lg">
                Who seeks wisdom today?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                {characterOptions.map((char, idx) => (
                  <button
                    key={char}
                    onClick={() => handleCharacterSelect(char)}
                    className="btn btn-secondary capitalize animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {char}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-200 drop-shadow">
                Choose a persona that resonates with your mindset today.
              </p>
            </div>
          )}

          {/* Timeline Question */}
          {currentQuestion === 'timeframe' && (
            <div className={`transition-opacity duration-300 ${showQuestion ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 sm:mb-12 drop-shadow-lg">
                What timeline calls to you?
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4 mb-8">
                {timelineOptions.map((timeline) => (
                  <button
                    key={timeline}
                    onClick={() => handleTimeframeSelect(timeline)}
                    className="px-4 py-3 border border-white/20 rounded-lg hover:bg-white/15 transition-colors text-center text-sm font-semibold text-white capitalize"
                  >
                    {timeline}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-200 drop-shadow">
                Choose a timeframe you want guidance on.
              </p>
            </div>
          )}

          {/* Energy Question */}
          {currentQuestion === 'energy' && (
            <div className={`transition-opacity duration-300 ${showQuestion ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 sm:mb-12 drop-shadow-lg">
                What energy guides you?
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4 mb-8">
                {energyOptions.map((energy) => (
                  <button
                    key={energy}
                    onClick={() => handleEnergySelect(energy)}
                    className="px-4 py-3 border border-white/20 rounded-lg hover:bg-white/15 transition-colors text-center text-sm font-semibold text-white capitalize"
                  >
                    {energy}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-200 drop-shadow">
                Choose an energy that is grounding you today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
