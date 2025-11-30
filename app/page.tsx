'use client'

import { useState, useEffect } from 'react'
import AnimatedOrb from '@/components/AnimatedOrb'
import OracleSelector from '@/components/OracleSelector'
import QuestionsSelector, { type Answers } from '@/components/QuestionsSelector'
import SurrealistCorpseGame from '@/components/SurrealistCorpseGame'
import OracleFortune from '@/components/OracleFortune'
import type { Oracle } from '@/lib/oracles'

type PageState = 'landing' | 'oracle-select' | 'questions' | 'surrealist-corpse' | 'fortune' | 'daily-limit'

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing')
  const [selectedOracle, setSelectedOracle] = useState<Oracle | null>(null)
  const [answers, setAnswers] = useState<Answers | null>(null)
  const [corpse, setCorpse] = useState<string>('')

  const handleOracleSelect = (oracle: Oracle) => {
    setSelectedOracle(oracle)
    setPageState('questions')
  }

  const handleQuestionsComplete = (newAnswers: Answers) => {
    setAnswers(newAnswers)
    // Route to oracle-specific path
    if (selectedOracle?.name === 'the dream') {
      // Surrealist oracle goes to corpse game
      setPageState('surrealist-corpse')
    } else {
      // All other oracles go directly to fortune
      setPageState('fortune')
    }
  }

  const handleSurrealistComplete = (fullCorpse: string) => {
    setCorpse(fullCorpse)
    setPageState('fortune')
  }

  const handleReset = () => {
    setPageState('landing')
    setSelectedOracle(null)
    setAnswers(null)
    setCorpse('')
  }

  return (
    <main suppressHydrationWarning className="min-h-screen relative overflow-hidden">
      {/* Animated Orb Background */}
      <AnimatedOrb />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12">
        {/* Header Area (hidden on fortune/surrealist corpse pages) */}
        {pageState !== 'fortune' && pageState !== 'surrealist-corpse' && (
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-2 sm:mb-4 tracking-tight drop-shadow-lg">
                Fortunegram
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-serif italic text-gray-200 drop-shadow">
                Daily directions from the beyond.
              </p>
            </div>
          </div>
        )}

        {/* Main Content - Routes based on page state */}
        {pageState === 'landing' && (
          <div className="w-full animate-fade-in">
            <div className="flex flex-col items-center justify-start min-h-screen pt-16 sm:pt-24 px-4">
              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 sm:mb-12 md:mb-16 drop-shadow-lg">
                Which oracle calls to you?
              </h3>
              <button
                onClick={() => setPageState('oracle-select')}
                className="px-8 py-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-white/40 shadow-2xl"
              >
                <h2 className="text-lg font-semibold text-white mb-2">
                  Begin Your Reading
                </h2>
                <p className="text-sm text-gray-200">
                  Let the wheel decide your path
                </p>
              </button>
            </div>
          </div>
        )}

        {pageState === 'oracle-select' && (
          <OracleSelector onSelect={handleOracleSelect} />
        )}

        {pageState === 'questions' && (
          <QuestionsSelector onComplete={handleQuestionsComplete} />
        )}

        {pageState === 'surrealist-corpse' && selectedOracle && answers && (
          <SurrealistCorpseGame answers={answers} onComplete={handleSurrealistComplete} />
        )}

        {pageState === 'fortune' && selectedOracle && answers && (
          <OracleFortune
            oracle={selectedOracle.name}
            answers={answers}
            corpse={corpse}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-400 text-sm">
        <p>One fortune per day • Midnight resets in your local timezone</p>
      </footer>
    </main>
  )
}
