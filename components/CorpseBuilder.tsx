'use client'

import { useState, useEffect } from 'react'
import TypewriterText from './TypewriterText'
import { PERSONAS, getRandomPersonas } from '@/lib/personas'
import { TIMELINES, getRandomTimelines } from '@/lib/timelines'
import { ENERGIES, getRandomEnergies } from '@/lib/energies'
import { ORACLES, getRandomOracles } from '@/lib/oracles'

export interface CorpseChoices {
  character: string | null
  timeframe: string | null
  energy: string | null
  lens: string | null
}

interface CorpseBuildSteps {
  character: string | null
  timeframe: string | null
  energy: string | null
  lens: string | null
}


// Generic head design that works for any persona
const ASCII_HEAD = `   ( • )
  / ~ \\
  | ◇ |
   \\ ~ /
    ~~~`

const ASCII_TORSO = ` / ◇ • ◇ \\
| ◆ ◆ ◆ |
| • ~ • |
 \\ ◇ ◆ /`

const ASCII_LEGS = ` / ▲ | ▲ \\
| • | • |
| ◆ | ◆ |
 \\ ▼ | ▼ /`

const ASCII_FEET = ` / ◯ | ◯ \\
|_✦___|_✦_|
 ◇◇◇◇◇◇◇◇◇`

interface CorpseBuilderProps {
  onComplete: (choices: CorpseChoices) => void
}

export default function CorpseBuilder({ onComplete }: CorpseBuilderProps) {
  const [characterOptions, setCharacterOptions] = useState<string[]>([])
  const [timelineOptions, setTimelineOptions] = useState<string[]>([])
  const [energyOptions, setEnergyOptions] = useState<string[]>([])
  const [oracleOptions, setOracleOptions] = useState<string[]>([])
  const [steps, setSteps] = useState<CorpseBuildSteps>({
    character: null,
    timeframe: null,
    energy: null,
    lens: null,
  })
  const [currentSection, setCurrentSection] = useState<'character' | 'timeframe' | 'energy' | 'lens' | 'complete'>('character')
  const [showTypewriter, setShowTypewriter] = useState(false)
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [showQuestion, setShowQuestion] = useState(true)
  const [choiceConfirmation, setChoiceConfirmation] = useState<string | null>(null)

  // Initialize random character, timeline, energy, and oracle options on mount
  useEffect(() => {
    setCharacterOptions(getRandomPersonas(3))
    setTimelineOptions(getRandomTimelines(2))
    setEnergyOptions(getRandomEnergies(2))
    setOracleOptions(getRandomOracles(2))
  }, [])

  const handleTypewriterComplete = () => {
    setTypewriterComplete(true)
    // Move to next section after typewriter completes + brief pause
    setTimeout(() => {
      // Clear choice confirmation
      setChoiceConfirmation(null)
      // Move to next section
      if (currentSection === 'character') {
        setCurrentSection('timeframe')
      } else if (currentSection === 'timeframe') {
        setCurrentSection('energy')
      } else if (currentSection === 'energy') {
        setCurrentSection('lens')
      } else if (currentSection === 'lens') {
        setCurrentSection('complete')
      }
      setShowTypewriter(false)
      setTypewriterComplete(false)
      // Fade in new question after a moment
      setTimeout(() => {
        setShowQuestion(true)
      }, 200)
    }, 400) // Brief pause after typing completes before moving to next section
  }

  const handleCharacterSelect = (char: string) => {
    setChoiceConfirmation(char)
    setShowQuestion(false) // Fade out question
    setTimeout(() => {
      setSteps({ ...steps, character: char })
      setShowTypewriter(true)
      setTypewriterComplete(false)
    }, 500) // Wait for fade-out, then show confirmation + start typewriter
  }

  const handleTimeframeSelect = (time: string) => {
    setChoiceConfirmation(time)
    setShowQuestion(false) // Fade out question
    setTimeout(() => {
      setSteps({ ...steps, timeframe: time })
      setShowTypewriter(true)
      setTypewriterComplete(false)
    }, 500)
  }

  const handleEnergySelect = (e: string) => {
    setChoiceConfirmation(e)
    setShowQuestion(false)
    setTimeout(() => {
      setSteps({ ...steps, energy: e })
      setShowTypewriter(true)
      setTypewriterComplete(false)
    }, 500)
  }

  const handleLensSelect = (l: string) => {
    setChoiceConfirmation(l)
    setShowQuestion(false)
    setTimeout(() => {
      setSteps({ ...steps, lens: l })
      setShowTypewriter(true)
      setTypewriterComplete(false)
    }, 500)
  }

  const handleRevealFortune = () => {
    const choices: CorpseChoices = {
      character: steps.character,
      timeframe: steps.timeframe,
      energy: steps.energy,
      lens: steps.lens,
    }
    onComplete(choices)
  }

  const handleShare = async () => {
    const corpseText = `Check out my Exquisite Corpse fortune:\n\n${steps.character ? ASCII_HEAD : ''}\n${steps.timeframe ? ASCII_TORSO : ''}\n${steps.energy ? ASCII_LEGS : ''}\n${steps.lens ? ASCII_FEET : ''}`

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
            {characterOptions.map((char) => (
              <button
                key={char}
                onClick={() => handleCharacterSelect(char)}
                className="px-6 py-4 text-sm border border-neutral-300 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-all text-center font-medium capitalize"
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
              <h3 className={`text-center text-2xl font-serif text-neutral-950 mb-6 transition-opacity duration-500 capitalize ${
                showTypewriter ? 'opacity-100' : 'opacity-0'
              }`}>
                {steps.character}
              </h3>
            )}

            {/* Corpse body framework - tightly stacked sections */}
            <div className="flex justify-center mb-8">
              <div className="font-mono text-sm leading-snug whitespace-pre text-neutral-700 space-y-0">
                {/* Head Section */}
                <div className={`transition-all duration-300 ${steps.character ? 'opacity-100 h-auto' : 'opacity-30 h-16'}`}>
                  {steps.character && showTypewriter && currentSection === 'character' ? (
                    <TypewriterText
                      text={ASCII_HEAD}
                      speed={50}
                      onComplete={handleTypewriterComplete}
                      showCursor={true}
                    />
                  ) : steps.character ? (
                    <div>{ASCII_HEAD}</div>
                  ) : (
                    <div className="w-24 h-16 border border-dashed border-neutral-300 rounded"></div>
                  )}
                </div>

                {/* Torso Section */}
                <div className={`transition-all duration-300 ${steps.timeframe ? 'opacity-100 h-auto' : 'opacity-30 h-12'}`}>
                  {steps.timeframe && showTypewriter && currentSection === 'timeframe' ? (
                    <TypewriterText
                      text={ASCII_TORSO}
                      speed={50}
                      onComplete={handleTypewriterComplete}
                      showCursor={true}
                    />
                  ) : steps.timeframe ? (
                    <div>{ASCII_TORSO}</div>
                  ) : (
                    <div className="w-24 h-12 border border-dashed border-neutral-300 rounded"></div>
                  )}
                </div>

                {/* Legs Section */}
                <div className={`transition-all duration-300 ${steps.energy ? 'opacity-100 h-auto' : 'opacity-30 h-14'}`}>
                  {steps.energy && showTypewriter && currentSection === 'energy' ? (
                    <TypewriterText
                      text={ASCII_LEGS}
                      speed={50}
                      onComplete={handleTypewriterComplete}
                      showCursor={true}
                    />
                  ) : steps.energy ? (
                    <div>{ASCII_LEGS}</div>
                  ) : (
                    <div className="w-24 h-14 border border-dashed border-neutral-300 rounded"></div>
                  )}
                </div>

                {/* Feet Section */}
                <div className={`transition-all duration-300 ${steps.lens ? 'opacity-100 h-auto' : 'opacity-30 h-10'}`}>
                  {steps.lens && showTypewriter && currentSection === 'lens' ? (
                    <TypewriterText
                      text={ASCII_FEET}
                      speed={50}
                      onComplete={handleTypewriterComplete}
                      showCursor={true}
                    />
                  ) : steps.lens ? (
                    <div>{ASCII_FEET}</div>
                  ) : (
                    <div className="w-24 h-10 border border-dashed border-neutral-300 rounded"></div>
                  )}
                </div>
              </div>
            </div>

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
                  <p className="text-center text-sm text-neutral-500">
                    Choose a timeframe you want guidance on.
                  </p>
                </div>
              )}

              {/* Section 3: Energy */}
              {currentSection === 'energy' && (
                <div className={`transition-opacity duration-500 ${showQuestion ? 'opacity-100' : 'opacity-0'} space-y-4`}>
                  <h4 className="text-center text-lg font-serif text-neutral-950 mb-4">
                    What energy guides you?
                  </h4>
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
                  <p className="text-center text-sm text-neutral-500">
                    Choose an energy that is grounding you today.
                  </p>
                </div>
              )}

              {/* Section 4: Oracle/Lens */}
              {currentSection === 'lens' && (
                <div className={`transition-opacity duration-500 ${showQuestion ? 'opacity-100' : 'opacity-0'} space-y-4`}>
                  <h4 className="text-center text-lg font-serif text-neutral-950 mb-4">
                    What oracle speaks today?
                  </h4>
                  <div className="flex gap-2 flex-col mb-6">
                    {oracleOptions.map((oracle) => (
                      <button
                        key={oracle}
                        onClick={() => handleLensSelect(oracle)}
                        className="px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center text-sm font-semibold text-neutral-950 capitalize"
                      >
                        {oracle}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-neutral-500">
                    Choose the voice that will deliver your message.
                  </p>
                </div>
              )}

              {/* Complete State */}
              {currentSection === 'complete' && (
                <div className="animate-fade-in text-center space-y-4">
                  <p className="text-neutral-600 text-sm">Your exquisite corpse is complete</p>
                  <div className="flex gap-3 flex-col">
                    <button
                      onClick={handleRevealFortune}
                      className="btn btn-primary text-base px-6 py-3"
                    >
                      Reveal Your Fortune
                    </button>
                    <button
                      onClick={handleShare}
                      className="btn btn-secondary text-base px-6 py-3"
                    >
                      Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
