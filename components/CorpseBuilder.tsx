'use client'

import { useState, useEffect } from 'react'

export interface CorpseChoices {
  character: string | null
  timeframe: string | null
  energy: string | null
  lens: string | null
}

interface CorpseBuildSteps {
  character: 'witch' | 'robot' | 'poet' | 'wanderer' | 'dreamer' | 'rebel' | 'mystic' | 'fool' | null
  timeframe: 'now' | 'ahead' | null
  energy: 'bold' | 'gentle' | null
  lens: 'practical' | 'mystical' | null
}

const ALL_CHARACTER_OPTIONS = [
  { key: 'witch', label: 'The Witch' },
  { key: 'robot', label: 'The Robot' },
  { key: 'poet', label: 'The Poet' },
  { key: 'wanderer', label: 'The Wanderer' },
  { key: 'dreamer', label: 'The Dreamer' },
  { key: 'rebel', label: 'The Rebel' },
  { key: 'mystic', label: 'The Mystic' },
  { key: 'fool', label: 'The Fool' },
]

const TIMEFRAME_OPTIONS = [
  { key: 'now', label: 'Right Now', desc: 'Immediate guidance' },
  { key: 'ahead', label: 'The Year Ahead', desc: 'Future direction' },
]

const ENERGY_OPTIONS = [
  { key: 'bold', label: 'Bold & Direct', desc: 'Confident action' },
  { key: 'gentle', label: 'Gentle & Flowing', desc: 'Intuitive wisdom' },
]

const LENS_OPTIONS = [
  { key: 'practical', label: 'The Practical', desc: 'Grounded wisdom' },
  { key: 'mystical', label: 'The Mystical', desc: 'Cosmic insights' },
]

const ASCII_HEADS: Record<string, string> = {
  witch: ` /\\_/\\\n( o.o )\n > ^ <\n/|   |\\`,
  robot: ` .-=""=""-.
(         )
 \\_______/
  |___|_`,
  poet: `  /^_^\\\n ( > < )\n  \\ ~ /
 ._| |_.`,
  wanderer: ` .-""-.
/      \\
| o  o |
|   >  |
\\ \\_-_/`,
  dreamer: ` *~*~*
(o o o)
 \\ - /
 (   )`,
  rebel: ` //\\\\||//\\\\
(  XX  )
 \\ -- /
 /|  |\\`,
  mystic: ` (((•)))
  ( @ @ )
   \\ ∴ /
 .-| | |-.`,
  fool: `  /-\\_-\\
 (  O O )
  > ^ <
 /|   |\\`,
}

const ASCII_TORSOS: Record<string, string> = {
  now: ` |  O  |
 | /|\\ |
 | / \\ |`,
  ahead: ` | (O) |
 |/|\\\\|
 | / \\ |`,
}

const ASCII_LEGS: Record<string, string> = {
  bold: `  | | |
  | | |
 /  |  \\
 -  -  -`,
  gentle: `  |   |
 /|   |\\
 | |_| |
 |     |`,
}

const ASCII_FEET: Record<string, string> = {
  practical: ` |_____| |_____|
  \\ _ /   \\ _ /`,
  mystical: ` ~~~|~~~|~~~
 ~~~|~~~|~~~
 ~~~|~~~|~~~`,
}

// Utility to get random 3 characters
const getRandomCharacterOptions = (count: number = 3) => {
  const shuffled = [...ALL_CHARACTER_OPTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

interface CorpseBuilderProps {
  onComplete: (choices: CorpseChoices) => void
}

export default function CorpseBuilder({ onComplete }: CorpseBuilderProps) {
  const [characterOptions, setCharacterOptions] = useState<typeof ALL_CHARACTER_OPTIONS>([])
  const [steps, setSteps] = useState<CorpseBuildSteps>({
    character: null,
    timeframe: null,
    energy: null,
    lens: null,
  })
  const [currentSection, setCurrentSection] = useState<'character' | 'timeframe' | 'energy' | 'lens' | 'complete'>('character')

  // Initialize random character options on mount
  useEffect(() => {
    setCharacterOptions(getRandomCharacterOptions(3))
  }, [])

  const handleCharacterSelect = (char: string) => {
    setSteps({ ...steps, character: char as CorpseBuildSteps['character'] })
    setCurrentSection('timeframe')
  }

  const handleTimeframeSelect = (time: string) => {
    setSteps({ ...steps, timeframe: time as CorpseBuildSteps['timeframe'] })
    setCurrentSection('energy')
  }

  const handleEnergySelect = (e: string) => {
    setSteps({ ...steps, energy: e as CorpseBuildSteps['energy'] })
    setCurrentSection('lens')
  }

  const handleLensSelect = (l: string) => {
    setSteps({ ...steps, lens: l as CorpseBuildSteps['lens'] })
    setCurrentSection('complete')
  }

  const handleRevealFortune = () => {
    const choices: CorpseChoices = {
      character: steps.character ? ALL_CHARACTER_OPTIONS.find(c => c.key === steps.character)?.label || null : null,
      timeframe: steps.timeframe === 'now' ? 'Right Now' : steps.timeframe === 'ahead' ? 'The Year Ahead' : null,
      energy: steps.energy === 'bold' ? 'Bold & Direct' : steps.energy === 'gentle' ? 'Gentle & Flowing' : null,
      lens: steps.lens === 'practical' ? 'The Practical' : steps.lens === 'mystical' ? 'The Mystical' : null,
    }
    onComplete(choices)
  }

  const handleShare = async () => {
    const corpseText = `Check out my Exquisite Corpse fortune:\n\n${steps.character ? ASCII_HEADS[steps.character] : ''}\n${steps.timeframe ? ASCII_TORSOS[steps.timeframe] : ''}\n${steps.energy ? ASCII_LEGS[steps.energy] : ''}\n${steps.lens ? ASCII_FEET[steps.lens] : ''}`

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Corpse Display Area - Always visible */}
      <div className="mb-8">
        {/* Show current choice as heading */}
        {steps.character && (
          <h3 className="text-center text-xl font-serif text-neutral-950 mb-4">
            {ALL_CHARACTER_OPTIONS.find(c => c.key === steps.character)?.label}
          </h3>
        )}

        {/* Corpse body framework - tightly stacked sections */}
        <div className="mx-auto w-fit font-mono text-xs leading-tight whitespace-pre text-neutral-700 space-y-1">
          {/* Head Section */}
          <div className={`transition-all duration-300 ${steps.character ? 'opacity-100 h-auto' : 'opacity-30 h-14'}`}>
            {steps.character ? (
              <div>{ASCII_HEADS[steps.character]}</div>
            ) : (
              <div className="w-20 h-14 border border-dashed border-neutral-300 rounded"></div>
            )}
          </div>

          {/* Torso Section */}
          <div className={`transition-all duration-300 ${steps.timeframe ? 'opacity-100 h-auto' : 'opacity-30 h-12'}`}>
            {steps.timeframe ? (
              <div>{ASCII_TORSOS[steps.timeframe]}</div>
            ) : (
              <div className="w-20 h-12 border border-dashed border-neutral-300 rounded"></div>
            )}
          </div>

          {/* Legs Section */}
          <div className={`transition-all duration-300 ${steps.energy ? 'opacity-100 h-auto' : 'opacity-30 h-14'}`}>
            {steps.energy ? (
              <div>{ASCII_LEGS[steps.energy]}</div>
            ) : (
              <div className="w-20 h-14 border border-dashed border-neutral-300 rounded"></div>
            )}
          </div>

          {/* Feet Section */}
          <div className={`transition-all duration-300 ${steps.lens ? 'opacity-100 h-auto' : 'opacity-30 h-8'}`}>
            {steps.lens ? (
              <div>{ASCII_FEET[steps.lens]}</div>
            ) : (
              <div className="w-20 h-8 border border-dashed border-neutral-300 rounded"></div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Sections */}
      <div className="space-y-8">
        {/* Section 1: Character */}
        {currentSection === 'character' && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-center text-2xl font-serif text-neutral-950 mb-6">
              Who seeks wisdom today?
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {characterOptions.map((char) => (
                <button
                  key={char.key}
                  onClick={() => handleCharacterSelect(char.key)}
                  className="px-3 py-2 text-xs border border-neutral-300 rounded hover:bg-purple-50 hover:border-purple-400 transition-all text-center"
                >
                  {char.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Timeframe */}
        {currentSection === 'timeframe' && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-center text-2xl font-serif text-neutral-950 mb-6">
              What timeline calls to you?
            </h3>
            <div className="flex gap-4">
              {TIMEFRAME_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleTimeframeSelect(opt.key)}
                  className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
                >
                  <p className="text-lg font-semibold text-neutral-950">{opt.label}</p>
                  <p className="text-xs text-neutral-600 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Energy */}
        {currentSection === 'energy' && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-center text-2xl font-serif text-neutral-950 mb-6">
              What energy guides you?
            </h3>
            <div className="flex gap-4">
              {ENERGY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleEnergySelect(opt.key)}
                  className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
                >
                  <p className="text-lg font-semibold text-neutral-950">{opt.label}</p>
                  <p className="text-xs text-neutral-600 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Lens */}
        {currentSection === 'lens' && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-center text-2xl font-serif text-neutral-950 mb-6">
              Through what lens shall we see?
            </h3>
            <div className="flex gap-4">
              {LENS_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleLensSelect(opt.key)}
                  className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
                >
                  <p className="text-lg font-semibold text-neutral-950">{opt.label}</p>
                  <p className="text-xs text-neutral-600 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Complete State */}
        {currentSection === 'complete' && (
          <div className="animate-fade-in text-center space-y-6">
            <p className="text-neutral-600 text-sm">Your exquisite corpse is complete</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRevealFortune}
                className="btn btn-primary text-lg px-8 py-3"
              >
                Reveal Your Fortune
              </button>
              <button
                onClick={handleShare}
                className="btn btn-secondary text-lg px-8 py-3"
              >
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
