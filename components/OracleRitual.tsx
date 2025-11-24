'use client'

import { useState, useEffect } from 'react'
import LoadingAnimation from './LoadingAnimation'
import RitualReveal from './RitualReveal'
import { type DivinationMethod } from './MethodSelector'

interface OracleRitualProps {
  oracle: string
  onComplete: (method: DivinationMethod, card?: any) => void
}

// Map oracle names to divination methods
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

export default function OracleRitual({ oracle, onComplete }: OracleRitualProps) {
  useEffect(() => {
    // Initial loading animation (0.5 seconds), then ritual reveal (1-2.5 seconds)
    // Total: 1.5-3 seconds total before fortune display
    const divMethod = ORACLE_TO_METHOD[oracle] || 'oracle'
    const timer = setTimeout(() => {
      onComplete(divMethod)
    }, 3500) // Total time: 500ms loading + 3000ms ritual = 3.5s

    return () => clearTimeout(timer)
  }, [oracle, onComplete])

  return (
    <div className="animate-fade-in">
      <LoadingAnimation oracle={oracle} />
    </div>
  )
}
