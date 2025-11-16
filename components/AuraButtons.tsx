'use client'

import { useState } from 'react'

interface AuraButtonsProps {
  onControlClick: () => void
  onChaosClick: () => void
}

export default function AuraButtons({ onControlClick, onChaosClick }: AuraButtonsProps) {
  const handleControlClick = () => {
    setTimeout(onControlClick, 100)
  }

  const handleChaosClick = () => {
    setTimeout(onChaosClick, 100)
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <button
        onClick={handleControlClick}
        className="w-full px-8 py-6 border border-neutral-200 rounded-lg bg-neutral-0 hover:bg-neutral-50 transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-neutral-400"
      >
        <h2 className="text-lg font-semibold text-neutral-950 mb-2">
          In Control
        </h2>
        <p className="text-sm text-neutral-600">
          Choose your path
        </p>
      </button>

      <button
        onClick={handleChaosClick}
        className="w-full px-8 py-6 border border-neutral-200 rounded-lg bg-neutral-0 hover:bg-neutral-50 transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-neutral-400"
      >
        <h2 className="text-lg font-semibold text-neutral-950 mb-2">
          Totally Not
        </h2>
        <p className="text-sm text-neutral-600">
          Let fate decide
        </p>
      </button>
    </div>
  )
}
