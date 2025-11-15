'use client'

import { useState, useEffect } from 'react'
import FortuneWheel, { type FortuneType } from '@/components/FortuneWheel'
import ChoiceFlow from '@/components/ChoiceFlow'
import FortuneDisplay from '@/components/FortuneDisplay'
import DailyLimitNotice from '@/components/DailyLimitNotice'
import { hasUsedFortune, markFortuneAsUsed } from '@/lib/dailyLimit'

type PageState = 'welcome' | 'spinning' | 'choices' | 'result' | 'daily-limit'

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('welcome')
  const [selectedFortuneType, setSelectedFortuneType] = useState<FortuneType | null>(null)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasUsedToday, setHasUsedToday] = useState(false)

  useEffect(() => {
    // Check if user has already used their fortune today
    const used = hasUsedFortune()
    setHasUsedToday(used)
    if (used) {
      setPageState('daily-limit')
    }
  }, [])

  const handleSpinComplete = (fortuneType: FortuneType) => {
    setIsSpinning(false)
    setSelectedFortuneType(fortuneType)
    setPageState('choices')
  }

  const handleChoicesComplete = (userSelections: Record<string, string>) => {
    setSelections(userSelections)
    markFortuneAsUsed()
    setPageState('result')
  }

  const handleReset = () => {
    setPageState('welcome')
    setSelectedFortuneType(null)
    setSelections({})
    setIsSpinning(false)
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-950 mb-2">
            Fortunegram
          </h1>
          <p className="text-neutral-600 text-lg">
            Spin the wheel. Choose your path. Discover your fortune.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-2xl">
          {pageState === 'welcome' && !hasUsedToday && (
            <div className="animate-fade-in">
              <p className="text-center text-neutral-600 mb-8">
                Select from five mystical methods to divine your future.
              </p>
              <FortuneWheel
                onSpinComplete={handleSpinComplete}
                isSpinning={isSpinning}
              />
              <button
                onClick={() => {
                  setIsSpinning(true)
                }}
                className="w-full mt-8 btn btn-accent text-lg py-3"
              >
                Begin Your Reading
              </button>
            </div>
          )}

          {pageState === 'choices' && selectedFortuneType && (
            <ChoiceFlow
              fortuneType={selectedFortuneType}
              onComplete={handleChoicesComplete}
            />
          )}

          {pageState === 'result' && selectedFortuneType && (
            <FortuneDisplay
              fortuneType={selectedFortuneType}
              selections={selections}
            />
          )}

          {pageState === 'daily-limit' && (
            <DailyLimitNotice onReset={handleReset} />
          )}
        </div>

        {/* Navigation */}
        {(pageState === 'choices' || pageState === 'result') && (
          <button
            onClick={handleReset}
            className="mt-8 btn btn-secondary text-sm"
          >
            ← Back Home
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
