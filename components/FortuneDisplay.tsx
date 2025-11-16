'use client'

import { useEffect, useState } from 'react'
import type { CorpseChoices } from './CorpseBuilder'
import type { DivinationMethod } from './MethodSelector'

interface FortuneDisplayProps {
  fortuneChoices?: CorpseChoices
  fortuneType?: string
  selections?: Record<string, string>
  method?: DivinationMethod
  onReset?: () => void
}

export default function FortuneDisplay({ fortuneChoices, method, onReset }: FortuneDisplayProps) {
  const [fortune, setFortune] = useState<string>('')
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    // Generate fortune based on corpse choices and divination method
    if (fortuneChoices) {
      setTimeout(() => {
        const generatedFortune = generateContextualFortune(fortuneChoices, method)
        setFortune(generatedFortune)
        setIsRevealing(true)
      }, 500)
    }
  }, [fortuneChoices, method])

  const generateContextualFortune = (choices: CorpseChoices, method?: DivinationMethod): string => {
    const methodName = method ? method.charAt(0).toUpperCase() + method.slice(1) : 'The cards'

    // Method-specific fortune templates
    const fortunesByMethod: Record<DivinationMethod, string[]> = {
      tarot: [
        `The ${methodName} reveal: Your ${choices.character} is drawn to seek wisdom ${choices.timeframe?.toLowerCase()}. The cards whisper: move with ${choices.energy?.toLowerCase()} intention, viewing through ${choices.lens?.toLowerCase()} truth.`,
        `In the arcana's wisdom, ${choices.character} finds their path. The moment of ${choices.timeframe?.toLowerCase()} calls for ${choices.energy?.toLowerCase()} action guided by ${choices.lens?.toLowerCase()} sight.`,
        `The cards speak through ${choices.character}. What the universe shows you ${choices.timeframe?.toLowerCase()}: embrace ${choices.energy?.toLowerCase()} energy, trust ${choices.lens?.toLowerCase()} knowing.`,
      ],
      oracle: [
        `The oracle's voice flows through ${choices.character}: In this ${choices.timeframe?.toLowerCase()} moment, step forward with ${choices.energy?.toLowerCase()} grace. Let ${choices.lens?.toLowerCase()} wisdom be your guide.`,
        `Ancient knowing speaks: ${choices.character} awakens to possibility. The universe sends ${choices.energy?.toLowerCase()} currents through your ${choices.timeframe?.toLowerCase()} path. See through ${choices.lens?.toLowerCase()} eyes.`,
        `The oracle whispers through ${choices.character}'s form: Your ${choices.timeframe?.toLowerCase()} unfolds with ${choices.energy?.toLowerCase()} revelation. Trust the ${choices.lens?.toLowerCase()} vision that emerges.`,
      ],
      numerology: [
        `The numbers align for ${choices.character}: In this ${choices.timeframe?.toLowerCase()} cycle, your path is lit by ${choices.energy?.toLowerCase()} vibration. Understand through ${choices.lens?.toLowerCase()} numerology.`,
        `Numerological truth: ${choices.character} moves in rhythm with ${choices.energy?.toLowerCase()} frequency ${choices.timeframe?.toLowerCase()}. The numbers reveal: see all through ${choices.lens?.toLowerCase()} calculation.`,
        `The sum of forces within ${choices.character}—this ${choices.timeframe?.toLowerCase()} asks for ${choices.energy?.toLowerCase()} expression. The number speaks: trust your ${choices.lens?.toLowerCase()} math.`,
      ],
      astrology: [
        `The stars align for ${choices.character}: This ${choices.timeframe?.toLowerCase()} passage requires ${choices.energy?.toLowerCase()} movement. The cosmos counsels you—perceive through ${choices.lens?.toLowerCase()} celestial light.`,
        `Astrological decree: ${choices.character}'s constellation burns bright. Your ${choices.timeframe?.toLowerCase()} brings ${choices.energy?.toLowerCase()} stellar influence. The heavens show: trust your ${choices.lens?.toLowerCase()} sight of the sky.`,
        `The planets speak through ${choices.character}. In this ${choices.timeframe?.toLowerCase()} season, harness ${choices.energy?.toLowerCase()} cosmic force. The astral plane reveals through your ${choices.lens?.toLowerCase()} understanding.`,
      ],
      runes: [
        `The runes cast for ${choices.character}: Ancient stones speak of your ${choices.timeframe?.toLowerCase()} journey. Move with ${choices.energy?.toLowerCase()} runic force, guided by ${choices.lens?.toLowerCase()} futhark wisdom.`,
        `Runic truth carved in stone: ${choices.character} stands at this ${choices.timeframe?.toLowerCase()} threshold with ${choices.energy?.toLowerCase()} power. The Elder Futhark reveals—see through ${choices.lens?.toLowerCase()} runes.`,
        `The stones have spoken through ${choices.character}. This ${choices.timeframe?.toLowerCase()} moment calls for ${choices.energy?.toLowerCase()} action. The runes counsel: trust your ${choices.lens?.toLowerCase()} reading.`,
      ],
      dadaism: [
        `The word dissolves into meaning around ${choices.character}. In this ${choices.timeframe?.toLowerCase()} chaos, find ${choices.energy?.toLowerCase()} freedom. The cut-up speaks: all is ${choices.lens?.toLowerCase()} and nothing.`,
        `Dada whispers through ${choices.character}: There is no logic to this ${choices.timeframe?.toLowerCase()}, only ${choices.energy?.toLowerCase()} absurdity. Yet meaning emerges—see it through ${choices.lens?.toLowerCase()} randomness.`,
        `The chance meeting of words around ${choices.character}: This ${choices.timeframe?.toLowerCase()} is ${choices.energy?.toLowerCase()} only. In the cut and paste of existence, find your ${choices.lens?.toLowerCase()} truth.`,
      ],
    }

    // Get fortunes for the selected method, or use tarot as default
    const methodFortunes = method && fortunesByMethod[method] ? fortunesByMethod[method] : fortunesByMethod.tarot
    return methodFortunes[Math.floor(Math.random() * methodFortunes.length)]
  }

  if (!fortune) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${isRevealing ? 'animate-fade-in' : ''}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 bg-neutral-100 rounded-full mb-4">
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Your Exquisite Corpse
          </span>
        </div>
      </div>

      {/* Fortune Card */}
      <div className="card p-8 mb-8">
        <p className="text-2xl leading-relaxed text-neutral-800 font-serif text-center italic">
          &quot;{fortune}&quot;
        </p>
      </div>

      {/* Selection Summary */}
      {fortuneChoices && (
        <div className="bg-neutral-50 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-neutral-900 mb-4">Your Reading</h4>
          <div className="grid grid-cols-1 gap-2 text-sm text-neutral-600">
            {method && (
              <div className="flex justify-between">
                <span>Divination Method</span>
                <span className="font-medium text-neutral-900 capitalize">{method}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Character (Head)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.character}</span>
            </div>
            <div className="flex justify-between">
              <span>Timeframe (Torso)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.timeframe}</span>
            </div>
            <div className="flex justify-between">
              <span>Energy (Legs)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.energy}</span>
            </div>
            <div className="flex justify-between">
              <span>Lens (Feet)</span>
              <span className="font-medium text-neutral-900">{fortuneChoices.lens}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-8 justify-center flex-wrap">
        <button className="btn btn-secondary">Save Fortune</button>
        <button className="btn btn-secondary">Share</button>
        {onReset && (
          <button onClick={onReset} className="btn btn-secondary">
            New Reading
          </button>
        )}
      </div>
    </div>
  )
}
