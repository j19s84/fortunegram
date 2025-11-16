'use client'

import { useState, useEffect } from 'react'
import CorpseBuilder, { type CorpseChoices } from '@/components/CorpseBuilder'
import FortuneDisplay from '@/components/FortuneDisplay'
import DailyLimitNotice from '@/components/DailyLimitNotice'
import { hasUsedFortune, markFortuneAsUsed } from '@/lib/dailyLimit'

type PageState = 'landing' | 'corpse-builder' | 'result' | 'daily-limit'

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing')
  const [corpseChoices, setCorpseChoices] = useState<CorpseChoices | null>(null)
  const [hasUsedToday, setHasUsedToday] = useState(false)

  useEffect(() => {
    // TEMPORARILY DISABLED FOR TESTING
    // TODO: Re-enable daily limit by uncommenting this code
    /*
    const used = hasUsedFortune()
    setHasUsedToday(used)
    if (used) {
      setPageState('daily-limit')
    }
    */
  }, [])

  const handleStartClick = () => {
    setPageState('corpse-builder')
  }

  const handleCorpseComplete = (choices: CorpseChoices) => {
    setCorpseChoices(choices)
    setPageState('result')
  }

  const handleReset = () => {
    setPageState('landing')
    setCorpseChoices(null)
  }

  return (
    <main className="min-h-screen bg-neutral-0 relative z-0">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-neutral-0 to-neutral-50 opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-neutral-950 mb-4 tracking-tight">
            Fortunegram
          </h1>
          <p className="text-neutral-600 text-xl font-serif italic">
            Daily directions from the beyond.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Landing Page */}
          {pageState === 'landing' && (
            <div className="animate-fade-in flex flex-col items-center justify-center transition-opacity duration-500">
              <button
                onClick={handleStartClick}
                className="px-8 py-6 border border-neutral-200 rounded-lg bg-neutral-0 hover:bg-neutral-50 transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                <h2 className="text-lg font-semibold text-neutral-950 mb-2">
                  Begin Your Reading
                </h2>
                <p className="text-sm text-neutral-600">
                  Let the wheel decide your path
                </p>
              </button>
            </div>
          )}

          {/* Wheel Page */}
          {/* Corpse Builder Page */}
          {pageState === 'corpse-builder' && (
            <div className="animate-fade-in">
              <CorpseBuilder onComplete={handleCorpseComplete} />
            </div>
          )}

          {/* Result Page */}
          {pageState === 'result' && corpseChoices && (
            <FortuneDisplay
              fortuneChoices={corpseChoices}
            />
          )}

          {/* TEMPORARILY DISABLED FOR TESTING */}
          {/* {pageState === 'daily-limit' && (
            <DailyLimitNotice onReset={handleReset} />
          )} */}
        </div>

        {/* Navigation */}
        {(pageState === 'corpse-builder' || pageState === 'result') && (
          <button
            onClick={handleReset}
            className="mt-12 btn btn-secondary text-sm"
          >
            ← Start Over
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-neutral-500 text-sm">
        <p>One fortune per day • Midnight resets in your local timezone</p>
      </footer>
    </main>
  )
}
