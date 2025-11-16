'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
import RitualReveal from './RitualReveal'
import { type DivinationMethod } from './MethodSelector'

interface OracleRitualProps {
  oracle: string
  onComplete: () => void
}

// Map oracle names to divination methods
const ORACLE_TO_METHOD: Record<string, DivinationMethod> = {
  'the cards': 'tarot',
  'the stones': 'runes',
  'the stars': 'astrology',
  'the numbers': 'numerology',
  'the cut-up': 'dadaism',
  'the bones': 'runes',
  'the tea leaves': 'oracle',
  'the mirror': 'oracle',
  'the smoke': 'oracle',
  'the coins': 'runes',
  'the water': 'oracle',
  'the ink': 'oracle',
  'the poets': 'dadaism',
}

export default function OracleRitual({ oracle, onComplete }: OracleRitualProps) {
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState<DivinationMethod | null>(null)

  useEffect(() => {
    // Simulate loading for 2.5 seconds
    const timer = setTimeout(() => {
      const divMethod = ORACLE_TO_METHOD[oracle] || 'oracle'
      setMethod(divMethod)
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [oracle])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!method) {
    return null
  }

  return (
    <div className="animate-fade-in">
      <RitualReveal method={method} onComplete={onComplete} />
    </div>
  )
}
