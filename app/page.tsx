'use client'

import { useState, useEffect } from 'react'
import FortuneWheel, { type FortuneType } from '@/components/FortuneWheel'
import ChoiceFlow from '@/components/ChoiceFlow'
import FortuneDisplay from '@/components/FortuneDisplay'
import DailyLimitNotice from '@/components/DailyLimitNotice'
import { hasUsedFortune, markFortuneAsUsed } from '@/lib/dailyLimit'

type PageState = 'landing' | 'wheel' | 'questions' | 'result' | 'daily-limit'
type ControlMode = 'controlled' | 'chaos' | null

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing')
  const [controlMode, setControlMode] = useState<ControlMode>(null)
  const [selectedFortuneType, setSelectedFortuneType] = useState<FortuneType | null>(null)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [landedSegment, setLandedSegment] = useState<FortuneType | null>(null)
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

  const handleLandingChoice = (mode: ControlMode) => {
    setControlMode(mode)
    setPageState('wheel')

    if (mode === 'chaos') {
      // Auto-spin immediately
      setIsSpinning(true)
      setTimeout(() => {
        setIsSpinning(false)
      }, 5000)
    }
  }

  const handleWheelComplete = (fortuneType: FortuneType) => {
    setLandedSegment(fortuneType)
    setSelectedFortuneType(fortuneType)
    // Auto-advance to questions after brief pause
    setTimeout(() => {
      setPageState('questions')
    }, 1500)
  }

  const handleSegmentClick = (fortuneType: FortuneType) => {
    setSelectedFortuneType(fortuneType)
    setLandedSegment(fortuneType)
    setPageState('questions')
  }

  const handleChoicesComplete = (userSelections: Record<string, string>) => {
    setSelections(userSelections)
    // TEMPORARILY DISABLED FOR TESTING
    // markFortuneAsUsed()
    setPageState('result')
  }

  const handleReset = () => {
    setPageState('landing')
    setControlMode(null)
    setSelectedFortuneType(null)
    setSelections({})
    setIsSpinning(false)
    setLandedSegment(null)
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
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-neutral-950 mb-3">
            Fortunegram
          </h1>
          <p className="text-neutral-600 text-lg italic">
            Your destiny awaits
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl">
          {/* Landing Page */}
          {pageState === 'landing' && (
            <div className="animate-fade-in flex flex-col items-center gap-8">
              <div className="text-center">
                <p className="text-neutral-600 mb-12 text-lg max-w-lg">
                  Will you seize control of your destiny, or surrender to the mysteries of the universe?
                </p>

                {/* Two main buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                  {/* Control Button */}
                  <button
                    onClick={() => handleLandingChoice('controlled')}
                    className="group relative px-8 py-6 bg-white border-2 border-neutral-900 rounded-lg font-serif font-bold text-neutral-900 transition-all duration-300 hover:bg-neutral-50 hover:shadow-lg hover:-translate-y-1 active:scale-95 max-w-xs"
                  >
                    <span className="block text-2xl mb-2">👑</span>
                    <span className="block text-lg mb-2">I&apos;m in Control</span>
                    <span className="block text-xs text-neutral-600 italic">Choose your own path</span>
                  </button>

                  {/* Chaos Button */}
                  <button
                    onClick={() => handleLandingChoice('chaos')}
                    className="group relative px-8 py-6 bg-gradient-to-br from-purple-900 to-purple-800 border-2 border-purple-600 rounded-lg font-serif font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-purple-500 active:scale-95 max-w-xs"
                  >
                    <span className="block text-2xl mb-2">🌀</span>
                    <span className="block text-lg mb-2">Totally Not in Control</span>
                    <span className="block text-xs text-purple-200 italic">Let fate decide</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wheel Page */}
          {pageState === 'wheel' && controlMode && (
            <div className="animate-slide-in-up flex flex-col items-center gap-8">
              {/* Wheel */}
              <FortuneWheel
                onSpinComplete={handleWheelComplete}
                onSegmentClick={handleSegmentClick}
                isSpinning={isSpinning}
                isStatic={controlMode === 'controlled'}
                landedSegment={landedSegment}
              />
            </div>
          )}

          {/* Questions Page */}
          {pageState === 'questions' && selectedFortuneType && (
            <div className="animate-slide-in-up">
              {/* Wheel at top (smaller) */}
              <div className="mb-12 flex justify-center">
                <div className="w-40 h-40">
                  <FortuneWheel
                    onSpinComplete={() => {}}
                    onSegmentClick={() => {}}
                    isSpinning={false}
                    isStatic={true}
                    landedSegment={selectedFortuneType}
                  />
                </div>
              </div>

              {/* Questions below */}
              <ChoiceFlow
                fortuneType={selectedFortuneType}
                onComplete={handleChoicesComplete}
              />
            </div>
          )}

          {/* Result Page */}
          {pageState === 'result' && selectedFortuneType && (
            <FortuneDisplay
              fortuneType={selectedFortuneType}
              selections={selections}
            />
          )}

          {/* TEMPORARILY DISABLED FOR TESTING */}
          {/* {pageState === 'daily-limit' && (
            <DailyLimitNotice onReset={handleReset} />
          )} */}
        </div>

        {/* Navigation */}
        {(pageState === 'wheel' || pageState === 'questions' || pageState === 'result') && (
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
