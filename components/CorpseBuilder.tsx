'use client'

import { useState, useEffect } from 'react'
import TypewriterText from './TypewriterText'
import { PERSONAS, getRandomPersonas } from '@/lib/personas'
import { TIMELINES, getRandomTimelines } from '@/lib/timelines'
import { ENERGIES, getRandomEnergies } from '@/lib/energies'
import { ORACLES, getRandomOracles, type Oracle } from '@/lib/oracles'
import { getHeadASCII, getTorsoASCII, getLegsASCII } from '@/lib/ascii-corpse-builder'

export interface CorpseChoices {
  character: string | null
  timeframe: string | null
  energy: string | null
  lens: string | null
  corpse?: string
}

interface CorpseBuildSteps {
  character: string | null
  timeframe: string | null
  energy: string | null
  lens: string | null
}

// Capitalize each word in a string (sentence case)
const capitalize = (str: string): string => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

interface CorpseBuilderProps {
  onComplete: (choices: CorpseChoices) => void
}

export default function CorpseBuilder({ onComplete }: CorpseBuilderProps) {
  const [characterOptions, setCharacterOptions] = useState<string[]>([])
  const [timelineOptions, setTimelineOptions] = useState<string[]>([])
  const [energyOptions, setEnergyOptions] = useState<string[]>([])
  const [oracleOptions, setOracleOptions] = useState<Oracle[]>([])
  const [steps, setSteps] = useState<CorpseBuildSteps>({
    character: null,
    timeframe: null,
    energy: null,
    lens: null,
  })
  const [currentSection, setCurrentSection] = useState<'character' | 'timeframe' | 'energy' | 'lens' | 'complete'>('character')
  const [showQuestion, setShowQuestion] = useState(true)
  const [choiceConfirmation, setChoiceConfirmation] = useState<string | null>(null)
  const [accumulatedCorpse, setAccumulatedCorpse] = useState<string>('')
  const [newPart, setNewPart] = useState<string>('')
  const [newPartAnimating, setNewPartAnimating] = useState(false)
  const [showTypewriterQuestion, setShowTypewriterQuestion] = useState(false)
  const [typewriterQuestionDone, setTypewriterQuestionDone] = useState(false)
  const [typewriterCaptionDone, setTypewriterCaptionDone] = useState(false)

  // Initialize random character, timeline, energy, oracle options on mount
  useEffect(() => {
    setCharacterOptions(getRandomPersonas(3))
    setTimelineOptions(getRandomTimelines(2))
    setEnergyOptions(getRandomEnergies(2))
    setOracleOptions(getRandomOracles(2))
  }, [])

  // Auto-advance to fortune after corpse is complete
  useEffect(() => {
    if (currentSection === 'complete') {
      const timer = setTimeout(() => {
        handleRevealFortune()
      }, 1500) // 1.5 second delay to show completed corpse

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection])


  // Show typewriter animation when entering a new section
  useEffect(() => {
    if (currentSection !== 'character' && currentSection !== 'complete') {
      setShowTypewriterQuestion(true)
      setTypewriterQuestionDone(false)
      setTypewriterCaptionDone(false)
    }
  }, [currentSection])


  const handleCharacterSelect = (char: string) => {
    setChoiceConfirmation(char)
    setShowQuestion(false) // Fade out question
    setTimeout(() => {
      setSteps((prevSteps) => {
        const newSteps = { ...prevSteps, character: char }
        // Get the head ASCII for this character
        const head = getHeadASCII(char)
        setAccumulatedCorpse(head)
        setNewPart(head)
        setNewPartAnimating(true)
        // Now transition to next section
        setTimeout(() => {
          setChoiceConfirmation(null)
          setCurrentSection('timeframe')
          setShowTypewriterQuestion(true)
          setTypewriterQuestionDone(false)
          setTypewriterCaptionDone(false)
          setTimeout(() => {
            setShowQuestion(true)
          }, 200)
        }, 400)
        return newSteps
      })
    }, 500)
  }

  const handleTimeframeSelect = (time: string) => {
    setChoiceConfirmation(time)
    setShowQuestion(false) // Fade out question
    setTimeout(() => {
      setSteps((prevSteps) => {
        const newSteps = { ...prevSteps, timeframe: time }
        // Get the torso ASCII for this timeline
        const torso = getTorsoASCII(time)
        // Append to accumulated
        setAccumulatedCorpse((prev) => prev + '\n' + torso)
        setNewPart(torso)
        setNewPartAnimating(true)
        setTimeout(() => {
          setChoiceConfirmation(null)
          setCurrentSection('energy')
          setShowTypewriterQuestion(true)
          setTypewriterQuestionDone(false)
          setTypewriterCaptionDone(false)
          setTimeout(() => {
            setShowQuestion(true)
          }, 200)
        }, 400)
        return newSteps
      })
    }, 500)
  }

  const handleEnergySelect = (e: string) => {
    setChoiceConfirmation(e)
    setShowQuestion(false)
    setTimeout(() => {
      setSteps((prevSteps) => {
        const newSteps = { ...prevSteps, energy: e }
        // Get the legs ASCII for this energy
        const legs = getLegsASCII(e)
        // Append to accumulated
        setAccumulatedCorpse((prev) => prev + '\n' + legs)
        setNewPart(legs)
        setNewPartAnimating(true)
        setTimeout(() => {
          setChoiceConfirmation(null)
          setCurrentSection('lens')
          setShowTypewriterQuestion(true)
          setTypewriterQuestionDone(false)
          setTypewriterCaptionDone(false)
          setTimeout(() => {
            setShowQuestion(true)
          }, 200)
        }, 400)
        return newSteps
      })
    }, 500)
  }

  const handleLensSelect = (l: string) => {
    setChoiceConfirmation(l)
    setShowQuestion(false)
    setTimeout(() => {
      setSteps((prevSteps) => {
        const newSteps = { ...prevSteps, lens: l }
        // Oracle selection doesn't add a new body part - corpse is complete
        setTimeout(() => {
          setChoiceConfirmation(null)
          setCurrentSection('complete')
          setShowQuestion(true)
        }, 400)
        return newSteps
      })
    }, 500)
  }

  const handleRevealFortune = () => {
    const choices: CorpseChoices = {
      character: steps.character,
      timeframe: steps.timeframe,
      energy: steps.energy,
      lens: steps.lens,
      corpse: accumulatedCorpse,
    }
    onComplete(choices)
  }

  const handleShare = async () => {
    const corpseText = `Check out my Exquisite Corpse fortune:\n\n${accumulatedCorpse}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Exquisite Corpse Fortune',
          text: corpseText,
        })
      } catch (err) {
        // Share cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(corpseText)
      alert('Corpse copied to clipboard!')
    }
  }

  // Check if building has started
  const hasStarted = steps.character !== null

  return (
    <div className="w-full">
      {/* BEFORE STARTING: Full-screen question at top */}
      {!hasStarted && currentSection === 'character' && (
        <div className="animate-fade-in flex flex-col items-center justify-start min-h-screen pt-24">
          <h3 className="text-center text-4xl font-serif text-neutral-950 mb-16">
            Who seeks wisdom today?
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {characterOptions.map((char, idx) => (
              <button
                key={char}
                onClick={() => handleCharacterSelect(char)}
                className="btn btn-secondary capitalize animate-scale-in"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                {char}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-500">
            Choose a persona that is resonating with your mindset today.
          </p>
        </div>
      )}

      {/* AFTER STARTING: Card-based corpse builder at center */}
      {hasStarted && (
        <div className="animate-fade-in flex flex-col items-center pt-12 min-h-screen">
          {/* Card container for corpse */}
          <div className="card p-8 w-full max-w-md">
            {/* Character heading */}
            {steps.character && (
              <h3 className="text-center text-2xl font-serif text-neutral-950 mb-6">
                {capitalize(steps.character)}
              </h3>
            )}

            {/* Progressive Corpse Display - accumulated + new part animating */}
            {accumulatedCorpse && (
              <div className="flex justify-center mb-8 min-h-32">
                <div className="font-mono text-sm leading-snug whitespace-pre text-neutral-700">
                  {/* Show accumulated corpse (static) */}
                  {accumulatedCorpse.replace(newPart, '')}
                  {/* Show new part with typewriter animation if animating */}
                  {newPartAnimating ? (
                    <TypewriterText
                      text={newPart}
                      speed={15}
                      showCursor={false}
                      onComplete={() => setNewPartAnimating(false)}
                    />
                  ) : (
                    newPart
                  )}
                </div>
              </div>
            )}

            {/* Questions and buttons below corpse */}
            <div className="border-t border-neutral-200 pt-6 mt-6 min-h-48">
              {/* Choice Confirmation (brief message during transition) */}
              {choiceConfirmation && (
                <div className="text-center mb-4 text-neutral-600 text-sm italic">
                  {choiceConfirmation}
                </div>
              )}

              {/* Section 2: Timeframe */}
              {currentSection === 'timeframe' && (
                <div className={`transition-opacity duration-500 ${showQuestion ? 'opacity-100' : 'opacity-0'} space-y-4`}>
                  <h4 className="text-center text-lg font-serif text-neutral-950 mb-4">
                    What timeline calls to you?
                  </h4>
                  <p className="text-center text-sm text-neutral-500">
                    Choose a timeframe you want guidance on.
                  </p>
                  <div className="flex gap-2 flex-col mb-6">
                    {timelineOptions.map((timeline) => (
                      <button
                        key={timeline}
                        onClick={() => handleTimeframeSelect(timeline)}
                        className="px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center text-sm font-semibold text-neutral-950 capitalize"
                      >
                        {timeline}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Energy */}
              {currentSection === 'energy' && (
                <div className={`transition-opacity duration-500 ${showQuestion ? 'opacity-100' : 'opacity-0'} space-y-4`}>
                  <h4 className="text-center text-lg font-serif text-neutral-950 mb-4">
                    What energy guides you?
                  </h4>
                  <p className="text-center text-sm text-neutral-500">
                    Choose an energy that is grounding you today.
                  </p>
                  <div className="flex gap-2 flex-col mb-6">
                    {energyOptions.map((energy) => (
                      <button
                        key={energy}
                        onClick={() => handleEnergySelect(energy)}
                        className="px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center text-sm font-semibold text-neutral-950 capitalize"
                      >
                        {energy}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 4: Oracle/Lens */}
              {currentSection === 'lens' && (
                <div className={`transition-opacity duration-500 ${showQuestion ? 'opacity-100' : 'opacity-0'} space-y-4`}>
                  <h4 className="text-center text-lg font-serif text-neutral-950 mb-4">
                    What oracle speaks today?
                  </h4>
                  <p className="text-center text-sm text-neutral-500">
                    Choose the voice that will deliver your message.
                  </p>
                  <div className="flex gap-2 flex-col mb-6">
                    {oracleOptions.map((oracle) => (
                      <button
                        key={oracle.name}
                        onClick={() => handleLensSelect(oracle.name)}
                        className="px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
                      >
                        <p className="text-sm font-semibold text-neutral-950 capitalize">{oracle.name}</p>
                        <p className="text-xs text-neutral-600 opacity-60">{oracle.subtitle}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete State - Auto-advances to fortune after 1.5 seconds */}
              {currentSection === 'complete' && (
                <div className="animate-fade-in text-center space-y-6">
                  <p className="text-neutral-600 text-sm">Your daily exquisite corpse is complete</p>
                  <p className="text-neutral-500 text-xs italic">Revealing your fortune...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
