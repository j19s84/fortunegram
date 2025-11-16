'use client'

import { useState } from 'react'

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

const CHARACTER_OPTIONS = [
  { key: 'witch', label: 'The Witch', icon: '🧙' },
  { key: 'robot', label: 'The Robot', icon: '🤖' },
  { key: 'poet', label: 'The Poet', icon: '✒️' },
  { key: 'wanderer', label: 'The Wanderer', icon: '🧭' },
  { key: 'dreamer', label: 'The Dreamer', icon: '💫' },
  { key: 'rebel', label: 'The Rebel', icon: '⚡' },
  { key: 'mystic', label: 'The Mystic', icon: '✨' },
  { key: 'fool', label: 'The Fool', icon: '🃏' },
]

const ASCII_HEADS: Record<string, string> = {
  witch: `
   /\\_/\\
  ( o.o )
   > ^ <
  /|   |\\
   |   |`,
  robot: `
  .-=""=""-.
  (         )
   \\_______/
    |___|_
    |   |
   /|   |\\`,
  poet: `
    /^_^\\
   ( > < )
    \\ ~ /
   ._| |_.
    / | \\`,
  wanderer: `
   .-""-.
  /      \\
  | o  o |
  |   >  |
  \\ \\_-_/
   "-----"`,
  dreamer: `
   *~*~*
  (o o o)
   \\ - /
   (   )
  /|   |\\`,
  rebel: `
  //\\\\||//\\\\
  (  XX  )
   \\ -- /
   /|  |\\
   | || |`,
  mystic: `
  (((•)))
   ( @ @ )
    \\ ∴ /
  .-| | |-.
  | | | | |`,
  fool: `
   /-\\_-\\
  (  O O )
   > ^ <
  /|   |\\
   |   |`,
}

const ASCII_TORSOS: Record<string, string> = {
  now: `
  |  O  |
  | /|\\ |
  | / \\ |`,
  ahead: `
  | (O) |
  |/|\\\\|
  | / \\ |`,
}

const ASCII_LEGS: Record<string, string> = {
  bold: `
   | | |
   | | |
  /  |  \\
  -  -  -`,
  gentle: `
   |   |
  /|   |\\
  | |_| |
  |     |`,
}

const ASCII_FEET: Record<string, string> = {
  practical: `
  |_____| |_____|
   \\ _ /   \\ _ /`,
  mystical: `
  ~~~|~~~|~~~
  ~~~|~~~|~~~
  ~~~|~~~|~~~`,
}

interface CorpseBuilderProps {
  onComplete: (choices: CorpseChoices) => void
}

export default function CorpseBuilder({ onComplete }: CorpseBuilderProps) {
  const [steps, setSteps] = useState<CorpseBuildSteps>({
    character: null,
    timeframe: null,
    energy: null,
    lens: null,
  })

  const [currentSection, setCurrentSection] = useState<'character' | 'timeframe' | 'energy' | 'lens' | 'complete'>('character')

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
      character: steps.character ? CHARACTER_OPTIONS.find(c => c.key === steps.character)?.label || null : null,
      timeframe: steps.timeframe === 'now' ? 'Right Now' : steps.timeframe === 'ahead' ? 'The Year Ahead' : null,
      energy: steps.energy === 'bold' ? 'Bold & Direct' : steps.energy === 'gentle' ? 'Gentle & Flowing' : null,
      lens: steps.lens === 'practical' ? 'The Practical' : steps.lens === 'mystical' ? 'The Mystical' : null,
    }
    onComplete(choices)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Corpse Display Area */}
      <div className="mb-12 text-center font-mono text-sm leading-tight whitespace-pre">
        {/* Head Section */}
        <div className={`mb-4 transition-opacity duration-500 ${steps.character ? 'opacity-100' : 'opacity-40'}`}>
          {steps.character ? (
            <div className="text-neutral-700">
              {ASCII_HEADS[steps.character]}
            </div>
          ) : (
            <div className="text-neutral-300 h-16 flex items-center justify-center border border-neutral-200 rounded">
              Head
            </div>
          )}
        </div>

        {/* Torso Section */}
        <div className={`mb-4 transition-opacity duration-500 ${steps.timeframe ? 'opacity-100' : 'opacity-40'}`}>
          {steps.timeframe ? (
            <div className="text-neutral-700">
              {ASCII_TORSOS[steps.timeframe]}
            </div>
          ) : (
            <div className="text-neutral-300 h-12 flex items-center justify-center border border-neutral-200 rounded">
              Torso
            </div>
          )}
        </div>

        {/* Legs Section */}
        <div className={`mb-4 transition-opacity duration-500 ${steps.energy ? 'opacity-100' : 'opacity-40'}`}>
          {steps.energy ? (
            <div className="text-neutral-700">
              {ASCII_LEGS[steps.energy]}
            </div>
          ) : (
            <div className="text-neutral-300 h-12 flex items-center justify-center border border-neutral-200 rounded">
              Legs
            </div>
          )}
        </div>

        {/* Feet Section */}
        <div className={`transition-opacity duration-500 ${steps.lens ? 'opacity-100' : 'opacity-40'}`}>
          {steps.lens ? (
            <div className="text-neutral-700">
              {ASCII_FEET[steps.lens]}
            </div>
          ) : (
            <div className="text-neutral-300 h-10 flex items-center justify-center border border-neutral-200 rounded">
              Feet
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Section 1: Character */}
        {currentSection === 'character' && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-center text-2xl font-serif text-neutral-950 mb-6">
              Who seeks wisdom today?
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CHARACTER_OPTIONS.map((char) => (
                <button
                  key={char.key}
                  onClick={() => handleCharacterSelect(char.key)}
                  className="px-3 py-2 text-xs sm:text-sm border border-neutral-300 rounded hover:bg-purple-50 hover:border-purple-400 transition-all text-center"
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
              <button
                onClick={() => handleTimeframeSelect('now')}
                className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
              >
                <p className="text-lg font-semibold text-neutral-950">Right Now</p>
                <p className="text-xs text-neutral-600 mt-1">Immediate guidance</p>
              </button>
              <button
                onClick={() => handleTimeframeSelect('ahead')}
                className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
              >
                <p className="text-lg font-semibold text-neutral-950">The Year Ahead</p>
                <p className="text-xs text-neutral-600 mt-1">Future direction</p>
              </button>
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
              <button
                onClick={() => handleEnergySelect('bold')}
                className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
              >
                <p className="text-lg font-semibold text-neutral-950">Bold & Direct</p>
                <p className="text-xs text-neutral-600 mt-1">Confident action</p>
              </button>
              <button
                onClick={() => handleEnergySelect('gentle')}
                className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
              >
                <p className="text-lg font-semibold text-neutral-950">Gentle & Flowing</p>
                <p className="text-xs text-neutral-600 mt-1">Intuitive wisdom</p>
              </button>
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
              <button
                onClick={() => handleLensSelect('practical')}
                className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
              >
                <p className="text-lg font-semibold text-neutral-950">The Practical</p>
                <p className="text-xs text-neutral-600 mt-1">Grounded wisdom</p>
              </button>
              <button
                onClick={() => handleLensSelect('mystical')}
                className="flex-1 px-6 py-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-center"
              >
                <p className="text-lg font-semibold text-neutral-950">The Mystical</p>
                <p className="text-xs text-neutral-600 mt-1">Cosmic insights</p>
              </button>
            </div>
          </div>
        )}

        {/* Complete State */}
        {currentSection === 'complete' && (
          <div className="animate-fade-in text-center space-y-6">
            <p className="text-neutral-600 text-sm">Your exquisite corpse is complete</p>
            <button
              onClick={handleRevealFortune}
              className="btn btn-primary text-lg px-8 py-3"
            >
              Reveal Your Fortune
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
