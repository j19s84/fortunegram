'use client'

import { useState, useEffect } from 'react'
import { Answers } from './QuestionsSelector'

interface Round {
  section: 'head' | 'torso' | 'legs'
  content: string
  isBlurred: boolean
}

interface SurrealistCorpseGameProps {
  answers: Answers
  onComplete: (corpse: string) => void
}

export default function SurrealistCorpseGame({
  answers,
  onComplete,
}: SurrealistCorpseGameProps) {
  const [currentRound, setCurrentRound] = useState<'head' | 'torso' | 'legs'>('head')
  const [rounds, setRounds] = useState<Record<'head' | 'torso' | 'legs', string>>({
    head: '',
    torso: '',
    legs: '',
  })
  const [userTorsoInput, setUserTorsoInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [unblurProgress, setUnblurProgress] = useState(0)

  // Round 1: Generate Head
  useEffect(() => {
    if (currentRound === 'head' && !rounds.head) {
      const generateHead = async () => {
        setIsGenerating(true)
        try {
          const response = await fetch('/api/generate-corpse-section', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section: 'head',
              persona: answers.character,
            }),
          })
          const data = await response.json()
          setRounds(prev => ({ ...prev, head: data.ascii || 'A mysterious form emerges...' }))
        } catch (error) {
          console.error('Failed to generate head:', error)
          setRounds(prev => ({ ...prev, head: '(The head is obscured by shadow)' }))
        }
        setIsGenerating(false)
      }
      generateHead()
    }
  }, [currentRound, rounds.head, answers.character])

  // Round 3: Generate Legs
  useEffect(() => {
    if (currentRound === 'legs' && !rounds.legs) {
      const generateLegs = async () => {
        setIsGenerating(true)
        try {
          const response = await fetch('/api/generate-corpse-section', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section: 'legs',
              energy: answers.energy,
            }),
          })
          const data = await response.json()
          setRounds(prev => ({ ...prev, legs: data.ascii || 'Two feet find their ground...' }))
        } catch (error) {
          console.error('Failed to generate legs:', error)
          setRounds(prev => ({ ...prev, legs: '(The legs fade into mist)' }))
        }
        setIsGenerating(false)
      }
      generateLegs()
    }
  }, [currentRound, rounds.legs, answers.energy])

  const handleTorsoSubmit = async () => {
    if (!userTorsoInput.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-corpse-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'torso',
          description: userTorsoInput,
          timeline: answers.timeframe,
        }),
      })
      const data = await response.json()
      setRounds(prev => ({ ...prev, torso: data.ascii || userTorsoInput }))
      setCurrentRound('legs')
      setUserTorsoInput('')
    } catch (error) {
      console.error('Failed to generate torso:', error)
      setRounds(prev => ({ ...prev, torso: userTorsoInput }))
      setCurrentRound('legs')
    }
    setIsGenerating(false)
  }

  const handleReveal = async () => {
    setIsRevealing(true)
    // Animate unblur from top to bottom
    for (let i = 0; i <= 100; i += 2) {
      setUnblurProgress(i)
      await new Promise(resolve => setTimeout(resolve, 15))
    }
    setUnblurProgress(100)

    // Construct full corpse
    const fullCorpse = `${rounds.head}\n\n✂ - - - - - - - ✂\n\n${rounds.torso}\n\n✂ - - - - - - - ✂\n\n${rounds.legs}`
    setTimeout(() => {
      onComplete(fullCorpse)
    }, 500)
  }

  const getBlurFilter = (): string => {
    if (currentRound === 'head' || currentRound === 'legs') {
      return `blur(${Math.max(0, 10 - unblurProgress / 10)}px)`
    }
    return 'blur(0px)'
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col items-center justify-start min-h-screen pt-16 sm:pt-24 px-4">
        {/* Progress Indicator */}
        <div className="w-full max-w-2xl mb-8 sm:mb-12">
          <div className="flex justify-center gap-2 mb-4">
            <div className={`h-3 w-8 rounded-full transition-all ${currentRound === 'head' ? 'bg-purple-400' : 'bg-white/20'}`} />
            <div className={`h-3 w-8 rounded-full transition-all ${currentRound === 'torso' ? 'bg-purple-400' : 'bg-white/20'}`} />
            <div className={`h-3 w-8 rounded-full transition-all ${currentRound === 'legs' ? 'bg-purple-400' : 'bg-white/20'}`} />
          </div>
        </div>

        {/* Round 1: AI Generated Head */}
        {currentRound === 'head' && (
          <div className="w-full max-w-2xl">
            <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 drop-shadow-lg">
              The AI draws a head...
            </h3>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-8 text-center mb-8">
              {isGenerating ? (
                <div className="animate-pulse text-gray-300 font-mono text-sm">
                  Channeling the form...
                </div>
              ) : (
                <div
                  className="font-mono text-xs sm:text-sm leading-relaxed text-gray-100 whitespace-pre"
                  style={{ filter: getBlurFilter() }}
                >
                  {rounds.head}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-6 italic">✂ - - - - - - - ✂</p>
              <button
                onClick={() => setCurrentRound('torso')}
                disabled={isGenerating || !rounds.head}
                className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'See Your Torso'}
              </button>
            </div>
          </div>
        )}

        {/* Round 2: User Describes Torso */}
        {currentRound === 'torso' && (
          <div className="w-full max-w-2xl">
            <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 drop-shadow-lg">
              Describe the torso
            </h3>
            <p className="text-center text-gray-300 mb-6 italic">
              (You cannot see what came before)
            </p>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-8 mb-8">
              <textarea
                value={userTorsoInput}
                onChange={e => setUserTorsoInput(e.target.value)}
                placeholder="Describe the body, chest, arms, or essence that emerges..."
                className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows={4}
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleTorsoSubmit}
                disabled={isGenerating || !userTorsoInput.trim()}
                className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isGenerating ? 'Converting to ASCII...' : 'Complete the Body'}
              </button>
            </div>
          </div>
        )}

        {/* Round 3: AI Generated Legs + Reveal */}
        {currentRound === 'legs' && (
          <div className="w-full max-w-2xl">
            <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 drop-shadow-lg">
              The AI adds the legs...
            </h3>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-8 text-center mb-8">
              {isGenerating ? (
                <div className="animate-pulse text-gray-300 font-mono text-sm">
                  Grounding the form...
                </div>
              ) : (
                <div
                  className="font-mono text-xs sm:text-sm leading-relaxed text-gray-100 whitespace-pre"
                  style={{ filter: getBlurFilter() }}
                >
                  {rounds.legs}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-6 italic">
                Everything hidden until the reveal...
              </p>
              <button
                onClick={handleReveal}
                disabled={isGenerating || !rounds.legs || isRevealing}
                className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isRevealing ? 'Revealing...' : 'Unfold the Creature'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
