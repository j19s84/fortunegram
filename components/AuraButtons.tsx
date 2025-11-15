'use client'

import { useState, useEffect, useRef } from 'react'

interface AuraButtonsProps {
  onControlClick: () => void
  onChaosClick: () => void
}

// Generate grain texture as data URI
function generateGrainDataURI(width: number = 256, height: number = 256): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Create image data with noise
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 255
    data[i] = noise        // R
    data[i + 1] = noise    // G
    data[i + 2] = noise    // B
    data[i + 3] = Math.random() * 150 // A
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

export default function AuraButtons({ onControlClick, onChaosClick }: AuraButtonsProps) {
  const [hoverControl, setHoverControl] = useState(false)
  const [hoverChaos, setHoverChaos] = useState(false)
  const [grainDataURI, setGrainDataURI] = useState<string>('')

  useEffect(() => {
    // Generate grain texture on mount
    setGrainDataURI(generateGrainDataURI(512, 512))
  }, [])

  const handleControlClick = () => {
    setTimeout(onControlClick, 100)
  }

  const handleChaosClick = () => {
    setTimeout(onChaosClick, 100)
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-0 justify-center items-stretch min-h-96">
      {/* Control Area - Deep Red/Crimson */}
      <button
        onClick={handleControlClick}
        onMouseEnter={() => setHoverControl(true)}
        onMouseLeave={() => setHoverControl(false)}
        className="group relative flex-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-inset md:rounded-l-xl"
        style={{
          background: `url(${grainDataURI}), linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #991b1b 100%)`,
          backgroundSize: 'auto, 400% 400%',
          backgroundBlendMode: 'overlay',
          animation: 'colorPulse 6s ease-in-out infinite',
          filter: hoverControl ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)',
          opacity: hoverControl ? 1 : 0.95,
        }}
      >
        {/* Grain is now embedded in background */}

        {/* Text content - floats on top */}
        <div className="relative h-full flex flex-col items-center justify-center z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-xl text-center px-8">
            In Control
          </h2>
          <p className="text-white text-opacity-90 font-sans text-sm mt-4 drop-shadow-lg">
            Choose your path
          </p>
        </div>

        {/* Subtle shine on hover */}
        {hoverControl && (
          <div
            className="absolute inset-0 pointer-events-none rounded-l-xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'fadeIn 0.3s ease-out',
            }}
          />
        )}
      </button>

      {/* Chaos Area - Deep Blue/Cyan */}
      <button
        onClick={handleChaosClick}
        onMouseEnter={() => setHoverChaos(true)}
        onMouseLeave={() => setHoverChaos(false)}
        className="group relative flex-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-inset md:rounded-r-xl"
        style={{
          background: `url(${grainDataURI}), linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)`,
          backgroundSize: 'auto, 400% 400%',
          backgroundBlendMode: 'overlay',
          animation: 'colorPulse 6s ease-in-out infinite',
          filter: hoverChaos ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)',
          opacity: hoverChaos ? 1 : 0.95,
        }}
      >
        {/* Grain is now embedded in background */}

        {/* Text content - floats on top */}
        <div className="relative h-full flex flex-col items-center justify-center z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-xl text-center px-8">
            Totally Not
          </h2>
          <p className="text-white text-opacity-90 font-sans text-sm mt-4 drop-shadow-lg">
            Let fate decide
          </p>
        </div>

        {/* Subtle shine on hover */}
        {hoverChaos && (
          <div
            className="absolute inset-0 pointer-events-none rounded-r-xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'fadeIn 0.3s ease-out',
            }}
          />
        )}
      </button>
    </div>
  )
}
