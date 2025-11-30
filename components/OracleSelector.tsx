'use client'

import { ORACLES, type Oracle } from '@/lib/oracles'

interface OracleSelectorProps {
  onSelect: (oracle: Oracle) => void
}

// ASCII art representations of each oracle
const ORACLE_ICONS: Record<string, string> = {
  'the cards': `   ╭─────╮
   │ ∞ ∞ │
   │ ◇ ◇ │
   ╰─────╯`,
  'the numbers': `   ┌─────┐
   │ 1 2 │
   │ 3 4 │
   └─────┘`,
  'the stones': `   ◇ ◆ ◇
   ◆ ◇ ◆
   ◇ ◆ ◇`,
  'the stars': `   ✦ ✧ ✦
   ✧ ⭐ ✧
   ✦ ✧ ✦`,
  'the coins': `   ⊙ ⊗ ⊙
   ⊗ ◉ ⊗
   ⊙ ⊗ ⊙`,
  'the poets': `   ≈ ≈ ≈
   ≈ ❡ ≈
   ≈ ≈ ≈`,
  'the dream': `   ∿ ∼ ∿
   ∼ ◯ ∼
   ∿ ∼ ∿`,
}

export default function OracleSelector({ onSelect }: OracleSelectorProps) {
  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col items-center justify-start min-h-screen pt-16 sm:pt-24 px-4">
        {/* Title */}
        <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-8 sm:mb-12 md:mb-16 drop-shadow-lg">
          Which oracle calls to you?
        </h3>

        {/* Oracle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mb-8">
          {ORACLES.map((oracle, idx) => (
            <button
              key={oracle.name}
              onClick={() => onSelect(oracle)}
              className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 sm:p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-300 animate-scale-in focus:outline-none focus:ring-2 focus:ring-white/40"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Oracle Icon */}
              <div className="font-mono text-xs sm:text-sm text-gray-300 mb-4 flex justify-center whitespace-pre group-hover:text-white transition-colors">
                {ORACLE_ICONS[oracle.name]}
              </div>

              {/* Oracle Name */}
              <p className="text-sm sm:text-base font-semibold text-white mb-2 capitalize group-hover:text-purple-200 transition-colors">
                {oracle.name}
              </p>

              {/* Oracle Description */}
              <p className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
                {oracle.subtitle}
              </p>
            </button>
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-center text-sm text-gray-200 drop-shadow max-w-2xl">
          Each oracle speaks in its own tongue. Choose the voice that resonates with your question.
        </p>
      </div>
    </div>
  )
}
