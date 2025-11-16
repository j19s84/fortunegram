'use client'

import { useState, useEffect } from 'react'
import FortuneWheel, { type FortuneType } from '@/components/FortuneWheel'
import ChoiceFlow from '@/components/ChoiceFlow'
import FortuneDisplay from '@/components/FortuneDisplay'
import DailyLimitNotice from '@/components/DailyLimitNotice'
import AuraButtons from '@/components/AuraButtons'
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
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-neutral-950 mb-4 tracking-tight">
            Fortunegram
          </h1>
          <p className="text-neutral-600 text-xl font-serif italic">
            Daily directions from the beyond.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl">
          {/* Landing Page */}
          {pageState === 'landing' && (
            <div className="animate-fade-in flex flex-col items-center justify-center transition-opacity duration-500">
              <AuraButtons
                onControlClick={() => handleLandingChoice('controlled')}
                onChaosClick={() => handleLandingChoice('chaos')}
              />
            </div>
          )}

          {/* Wheel Page */}
          {pageState === 'wheel' && controlMode && (
            <div className="animate-fade-in flex flex-col items-center gap-6 transition-opacity duration-500">
              {/* Instruction Text */}
              <p className="text-neutral-600 text-sm font-medium">
                {controlMode === 'controlled' ? 'Choose your method' : 'Let fate guide you'}
              </p>

              {/* Wheel - auto-spins for chaos mode */}
              <FortuneWheel
                onSpinComplete={handleWheelComplete}
                onSegmentClick={handleSegmentClick}
                isSpinning={isSpinning}
                isStatic={controlMode === 'controlled'}
                landedSegment={landedSegment}
                autoSpin={controlMode === 'chaos'}
              />
            </div>
          )}

          {/* Questions Page */}
          {pageState === 'questions' && selectedFortuneType && (
            <div className="animate-slide-in-up">
              {/* Wheel at top (smaller - 200px) */}
              <div className="mb-12 flex justify-center">
                <div style={{ width: '200px', height: '200px' }}>
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
