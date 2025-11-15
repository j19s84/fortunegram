'use client'

import { useEffect, useRef } from 'react'

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    canvas.width = 400 * dpr
    canvas.height = 400 * dpr
    ctx.scale(dpr, dpr)

    // Generate grain noise
    const imageData = ctx.createImageData(400, 400)
    const data = imageData.data

    // Create Perlin-like noise pattern
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255

      // Random grain with varying intensity
      const intensity = Math.random() > 0.7 ? noise * 0.8 : noise * 0.3

      data[i] = intensity      // R
      data[i + 1] = intensity  // G
      data[i + 2] = intensity  // B
      data[i + 3] = Math.random() * 200 // A (varying opacity)
    }

    ctx.putImageData(imageData, 0, 0)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50 mix-blend-mode-overlay"
      style={{ mixBlendMode: 'overlay' }}
    />
  )
}
