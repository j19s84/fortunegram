'use client'

import { useState, useEffect } from 'react'

export type FortuneType = 'tarot' | 'runes' | 'iching' | 'numerology' | 'aiWitch'

interface WheelSegment {
  type: FortuneType
  label: string
  icon: string
  greyShade: string
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { type: 'tarot', label: 'Tarot', icon: '⚡', greyShade: '#5a5a5a' },
  { type: 'runes', label: 'Runes', icon: 'ᚱ', greyShade: '#6b6b6b' },
  { type: 'iching', label: 'I Ching', icon: '☰', greyShade: '#4a4a4a' },
  { type: 'numerology', label: 'Numerology', icon: '#', greyShade: '#7a7a7a' },
  { type: 'aiWitch', label: 'AI Witch', icon: '✦', greyShade: '#696969' },
]

interface FortuneWheelProps {
  onSpinComplete: (fortuneType: FortuneType) => void
  isSpinning: boolean
  landedSegment?: FortuneType | null
}

export default function FortuneWheel({
  onSpinComplete,
  isSpinning,
  landedSegment = null,
}: FortuneWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [postSpinGlow, setPostSpinGlow] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)

  // Track if wheel has spun to stop pulsate animation after first spin
  useEffect(() => {
    if (isSpinning) {
      setHasSpun(true)
    }
  }, [isSpinning])

  const spinWheel = () => {
    if (isSpinning) return

    // 7-second spin with smooth easing
    const spins = 6 + Math.random() * 4
    const randomOffset = Math.random() * 360
    const newRotation = spins * 360 + randomOffset

    setRotation(newRotation)

    // Determine which segment we landed on
    const normalizedRotation = (newRotation % 360 + 360) % 360
    const segmentIndex = Math.floor((normalizedRotation / 72 + 2.5) % 5)
    const landedSegmentType = WHEEL_SEGMENTS[segmentIndex].type

    // Show post-spin glow for 1 second (at 7 second mark)
    setTimeout(() => {
      setPostSpinGlow(true)
    }, 7000)

    // Call callback after glow completes (7 seconds + 1 second glow)
    setTimeout(() => {
      setPostSpinGlow(false)
      onSpinComplete(landedSegmentType)
    }, 8000)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Wheel Container - 500px diameter with pulsate when not spun */}
      <div
        className="relative cursor-pointer"
        style={{
          width: '500px',
          height: '500px',
          animation: !hasSpun && !isSpinning ? 'wheelPulsate 3s ease-in-out infinite' : 'none',
        }}
        onClick={() => !isSpinning && spinWheel()}
      >
        {/* Pointer/Arrow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20">
          <div className="relative">
            <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-neutral-900" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-neutral-900">▼</div>
          </div>
        </div>

        {/* Wheel */}
        <div
          className={`w-full h-full rounded-full transition-transform ${
            isSpinning ? 'duration-[7s]' : ''
          }`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionTimingFunction: isSpinning ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
          }}
        >
          {/* SVG Wheel with segments */}
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}>
            {WHEEL_SEGMENTS.map((segment, index) => {
              const angle = (index * 360) / WHEEL_SEGMENTS.length
              const rad = (angle * Math.PI) / 180
              const isGlowing = postSpinGlow && landedSegment === segment.type

              return (
                <g key={segment.type}>
                  {/* Segment */}
                  <path
                    d={`M 50 50 L ${50 + 48 * Math.cos(rad)} ${50 + 48 * Math.sin(rad)} A 48 48 0 0 1 ${50 + 48 * Math.cos((rad + (72 * Math.PI) / 180))} ${50 + 48 * Math.sin((rad + (72 * Math.PI) / 180))} Z`}
                    fill={segment.greyShade}
                    stroke="#9333ea"
                    strokeWidth="1"
                    opacity={0.85}
                    style={{
                      filter: isGlowing ? 'brightness(1.3) drop-shadow(0 0 12px rgba(147, 51, 234, 0.6))' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />

                  {/* Icon */}
                  <text
                    x={50 + 32 * Math.cos(rad + (36 * Math.PI) / 180)}
                    y={50 + 32 * Math.sin(rad + (36 * Math.PI) / 180)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fill="white"
                    fontWeight="bold"
                  >
                    {segment.icon}
                  </text>

                  {/* Label */}
                  <text
                    x={50 + 38 * Math.cos(rad + (36 * Math.PI) / 180)}
                    y={50 + 38 * Math.sin(rad + (36 * Math.PI) / 180) + 6}
                    textAnchor="middle"
                    fontSize="7"
                    fill="rgba(255,255,255,0.9)"
                    fontWeight="600"
                  >
                    {segment.label}
                  </text>
                </g>
              )
            })}

            {/* Center circle */}
            <circle cx="50" cy="50" r="14" fill="white" stroke="#9333ea" strokeWidth="2" />
            <circle cx="50" cy="50" r="8" fill="#0f0e0d" />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="4" fill="#9333ea">
              ✦
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
