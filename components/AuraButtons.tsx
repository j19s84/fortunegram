'use client'

import { useState } from 'react'

interface AuraButtonsProps {
  onControlClick: () => void
  onChaosClick: () => void
}

export default function AuraButtons({ onControlClick, onChaosClick }: AuraButtonsProps) {
  const [burstControl, setBurstControl] = useState(false)
  const [burstChaos, setBurstChaos] = useState(false)
  const [hoverControl, setHoverControl] = useState(false)
  const [hoverChaos, setHoverChaos] = useState(false)

  const handleControlClick = () => {
    setBurstControl(true)
    setTimeout(() => setBurstControl(false), 600)
    setTimeout(onControlClick, 100)
  }

  const handleChaosClick = () => {
    setBurstChaos(true)
    setTimeout(() => setBurstChaos(false), 600)
    setTimeout(onChaosClick, 100)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-12 justify-center items-center">
      {/* Control Aura */}
      <button
        onClick={handleControlClick}
        onMouseEnter={() => setHoverControl(true)}
        onMouseLeave={() => setHoverControl(false)}
        className="group relative w-48 h-48 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        style={{
          animation: hoverControl ? 'none' : 'auraPulse 3.5s ease-in-out infinite',
        }}
      >
        {/* Outer blur layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(220, 38, 38, 0.8), rgba(127, 29, 29, 0.4), transparent)',
            filter: `blur(40px)`,
            animation: hoverControl ? 'none' : 'auraGlow 3.5s ease-in-out infinite',
            transition: hoverControl ? 'opacity 0.3s ease-out' : 'none',
            opacity: hoverControl ? 1.2 : 1,
          }}
        />

        {/* Inner darker radial gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(159, 18, 57, 0.6), rgba(80, 7, 25, 0.3), transparent)',
            filter: 'blur(30px)',
          }}
        />

        {/* Burst effect */}
        {burstControl && <div className="absolute inset-0 rounded-full aura-burst" />}

        {/* Text label - centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-sans font-semibold text-lg tracking-wide drop-shadow-lg">
            In Control
          </span>
        </div>
      </button>

      {/* Chaos Aura */}
      <button
        onClick={handleChaosClick}
        onMouseEnter={() => setHoverChaos(true)}
        onMouseLeave={() => setHoverChaos(false)}
        className="group relative w-48 h-48 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        style={{
          animation: hoverChaos ? 'none' : 'auraPulse 3.5s ease-in-out infinite',
        }}
      >
        {/* Outer blur layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.4), transparent)',
            filter: `blur(40px)`,
            animation: hoverChaos ? 'none' : 'auraGlow 3.5s ease-in-out infinite',
            transition: hoverChaos ? 'opacity 0.3s ease-out' : 'none',
            opacity: hoverChaos ? 1.2 : 1,
          }}
        />

        {/* Inner darker radial gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(30, 58, 138, 0.6), rgba(15, 23, 42, 0.3), transparent)',
            filter: 'blur(30px)',
          }}
        />

        {/* Burst effect */}
        {burstChaos && <div className="absolute inset-0 rounded-full aura-burst" />}

        {/* Text label - centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-sans font-semibold text-lg tracking-wide drop-shadow-lg">
            Totally Not
          </span>
        </div>
      </button>
    </div>
  )
}
