'use client'

import { useState, useEffect } from 'react'
import CorpseBuilder, { type CorpseChoices } from '@/components/CorpseBuilder'
import FortuneDisplay from '@/components/FortuneDisplay'
import DailyLimitNotice from '@/components/DailyLimitNotice'
import { hasUsedFortune, markFortuneAsUsed } from '@/lib/dailyLimit'
import type { DivinationMethod } from '@/components/MethodSelector'

type PageState = 'landing' | 'corpse-builder' | 'loading' | 'fortune' | 'daily-limit'

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing')
  const [corpseChoices, setCorpseChoices] = useState<CorpseChoices | null>(null)
  const [hasUsedToday, setHasUsedToday] = useState(false)
  const [method, setMethod] = useState<DivinationMethod | null>(null)
  const [tarotCard, setTarotCard] = useState<any>(null)

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
    // Immediately start loading animation (3.5s total)
    setPageState('loading')
    // Map oracle to method
    const ORACLE_TO_METHOD: Record<string, DivinationMethod> = {
      'the cards': 'tarot',
      'the stones': 'runes',
      'the stars': 'astrology',
      'the numbers': 'numerology',
      'the dream': 'surrealism',
      'the bones': 'runes',
      'the tea leaves': 'oracle',
      'the mirror': 'oracle',
      'the smoke': 'oracle',
      'the coins': 'oracle',
      'the water': 'oracle',
      'the ink': 'oracle',
      'the poets': 'oracle',
    }
    const oracleName = choices.lens || 'the cards'
    const divMethod = ORACLE_TO_METHOD[oracleName] || 'oracle'
    setMethod(divMethod)
    // Auto-advance to fortune after loading completes
    setTimeout(() => {
      setPageState('fortune')
    }, 3500)
  }

  const handleReset = () => {
    setPageState('landing')
    setCorpseChoices(null)
    setMethod(null)
    setTarotCard(null)
  }

  return (
    <main className="min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header - Hidden on fortune and loading pages */}
        {pageState !== 'fortune' && pageState !== 'loading' && (
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-neutral-950 mb-4 tracking-tight">
              Fortunegram
            </h1>
            <p className="text-neutral-600 text-xl font-serif italic">
              Daily directions from the beyond.
            </p>
          </div>
        )}

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

          {/* Corpse Builder Page */}
          {pageState === 'corpse-builder' && (
            <div className="animate-fade-in">
              <CorpseBuilder onComplete={handleCorpseComplete} />
            </div>
          )}

          {/* Loading Page - Shows loading animation, then auto-transitions to fortune */}
          {pageState === 'loading' && corpseChoices && (
            <div className="animate-fade-in min-h-screen flex items-center justify-center">
              <div className="text-center space-y-8">
                <div className="w-24 h-24 mx-auto border-2 border-neutral-200 rounded-full animate-spin" />
                <p className="text-neutral-600 italic font-serif text-lg">Channeling your path...</p>
              </div>
            </div>
          )}

          {/* Fortune Display Page */}
          {pageState === 'fortune' && corpseChoices && method && (
            <FortuneDisplay
              fortuneChoices={corpseChoices}
              method={method}
              tarotCard={tarotCard}
              onReset={handleReset}
            />
          )}

          {/* TEMPORARILY DISABLED FOR TESTING */}
          {/* {pageState === 'daily-limit' && (
            <DailyLimitNotice onReset={handleReset} />
          )} */}
        </div>

        {/* Navigation */}
        {(pageState === 'corpse-builder' || pageState === 'loading' || pageState === 'fortune') && (
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
