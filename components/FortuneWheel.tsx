'use client'

import { useState, useEffect } from 'react'

export type FortuneType = 'tarot' | 'runes' | 'iching' | 'numerology' | 'aiWitch'

interface WheelSegment {
  type: FortuneType
  label: string
  color: string
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { type: 'tarot', label: 'Tarot', color: 'from-neutral-700 to-neutral-600' },
  { type: 'runes', label: 'Runes', color: 'from-neutral-600 to-neutral-500' },
  { type: 'iching', label: 'I Ching', color: 'from-neutral-500 to-neutral-400' },
  { type: 'numerology', label: 'Numerology', color: 'from-accent-700 to-accent-600' },
  { type: 'aiWitch', label: 'AI Witch', color: 'from-accent-600 to-accent-500' },
]

interface FortuneWheelProps {
  onSpinComplete: (fortuneType: FortuneType) => void
  isSpinning: boolean
}

export default function FortuneWheel({ onSpinComplete, isSpinning }: FortuneWheelProps) {
  const [rotation, setRotation] = useState(0)

  const spinWheel = () => {
    if (isSpinning) return

    // Random rotation (at least 5 full spins + random offset)
    const spins = 5 + Math.random() * 3
    const randomOffset = Math.random() * 360
    const newRotation = spins * 360 + randomOffset

    setRotation(newRotation)

    // Determine which segment we landed on
    // Each segment is 72 degrees (360 / 5)
    const normalizedRotation = (newRotation % 360 + 360) % 360
    const segmentIndex = Math.floor((normalizedRotation / 72 + 2.5) % 5)

    // Call callback after animation completes (3 seconds)
    setTimeout(() => {
      onSpinComplete(WHEEL_SEGMENTS[segmentIndex].type)
    }, 3000)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Wheel Container */}
      <div className="relative w-80 h-80">
        {/* Pointer/Arrow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-neutral-900" />
        </div>

        {/* Wheel */}
        <div
          className={`w-full h-full rounded-full transition-transform ${
            isSpinning ? 'duration-[3s] ease-out' : ''
          }`}
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(
              from 0deg,
              ${WHEEL_SEGMENTS.map((seg) => seg.color.split(' ')[0].replace('from-', '')).join(', ')}
            )`,
          }}
        >
          {/* Segments */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
          >
            {WHEEL_SEGMENTS.map((segment, index) => {
              const angle = (index * 360) / WHEEL_SEGMENTS.length
              const startAngle = angle
              const endAngle = angle + 360 / WHEEL_SEGMENTS.length

              return (
                <g key={segment.type}>
                  {/* Segment border */}
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + 49 * Math.cos((startAngle * Math.PI) / 180)}
                    y2={50 + 49 * Math.sin((startAngle * Math.PI) / 180)}
                    stroke="white"
                    strokeWidth="0.5"
                  />
                  {/* Text label (rotated) */}
                  <text
                    x="50"
                    y="20"
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="600"
                    style={{
                      transform: `rotate(${angle + 36}deg)`,
                      transformOrigin: '50px 50px',
                      pointerEvents: 'none',
                    }}
                  >
                    {segment.label}
                  </text>
                </g>
              )
            })}

            {/* Center circle */}
            <circle cx="50" cy="50" r="12" fill="white" />
            <circle cx="50" cy="50" r="8" fill="#0f0e0d" />
          </svg>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="btn btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        {WHEEL_SEGMENTS.map((seg) => (
          <div key={seg.type} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full bg-gradient-to-br ${seg.color}`}
            />
            <span className="text-neutral-600">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
