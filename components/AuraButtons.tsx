'use client'

import { useState } from 'react'

interface AuraButtonsProps {
  onControlClick: () => void
  onChaosClick: () => void
}

export default function AuraButtons({ onControlClick, onChaosClick }: AuraButtonsProps) {
  const [hoverControl, setHoverControl] = useState(false)
  const [hoverChaos, setHoverChaos] = useState(false)

  const handleControlClick = () => {
    setTimeout(onControlClick, 100)
  }

  const handleChaosClick = () => {
    setTimeout(onChaosClick, 100)
  }

  return (
    <div
      className="w-full h-96 relative flex items-center justify-center gap-16"
      style={{
        backgroundImage: 'url(/gradients.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Left Blob - In Control */}
      <button
        onClick={handleControlClick}
        onMouseEnter={() => setHoverControl(true)}
        onMouseLeave={() => setHoverControl(false)}
        className="relative w-48 h-48 transition-all duration-300 ease-out focus:outline-none"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
          boxShadow: hoverControl
            ? '0 20px 60px rgba(0, 0, 0, 0.3)'
            : '0 10px 30px rgba(0, 0, 0, 0.15)',
          transform: hoverControl ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-neutral-950">
              In Control
            </h2>
            <p className="text-xs text-neutral-600 mt-2 font-sans">
              Choose your path
            </p>
          </div>
        </div>
      </button>

      {/* Right Blob - Totally Not */}
      <button
        onClick={handleChaosClick}
        onMouseEnter={() => setHoverChaos(true)}
        onMouseLeave={() => setHoverChaos(false)}
        className="relative w-48 h-48 transition-all duration-300 ease-out focus:outline-none"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '58% 42% 46% 54% / 49% 52% 48% 51%',
          boxShadow: hoverChaos
            ? '0 20px 60px rgba(0, 0, 0, 0.3)'
            : '0 10px 30px rgba(0, 0, 0, 0.15)',
          transform: hoverChaos ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-neutral-950">
              Totally Not
            </h2>
            <p className="text-xs text-neutral-600 mt-2 font-sans">
              Let fate decide
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}
