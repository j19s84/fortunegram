'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()

    window.addEventListener('resize', setCanvasSize)

    // Simple smooth blob animation using sine/cosine waves
    const animate = () => {
      timeRef.current += 1

      // Clear canvas with black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle drift to the center position for a floating effect
      const driftX = Math.sin(timeRef.current * 0.0008) * (canvas.width * 0.08)
      const driftY = Math.cos(timeRef.current * 0.0006) * (canvas.height * 0.08)

      const centerX = canvas.width / 2 + driftX
      const centerY = canvas.height / 2 + driftY
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.12

      // Generate smooth blob points using sine waves at different frequencies
      const generateBlobPoints = (time: number) => {
        const points: Array<[number, number]> = []
        const segments = 64

        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2

          // Smooth morphing using multiple sine waves with expanded amplitude
          const wave1 = Math.sin(angle + time * 0.005) * 0.25
          const wave2 = Math.sin(angle * 2 + time * 0.003) * 0.15
          const wave3 = Math.sin(angle * 3 + time * 0.002) * 0.1

          const radius = baseRadius * (1 + wave1 + wave2 + wave3)

          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          points.push([x, y])
        }

        return points
      }

      const blobPoints = generateBlobPoints(timeRef.current)

      // LAYER 1: Outer glow (heavy blur)
      ctx.save()
      ctx.filter = 'blur(60px)'
      const outerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 2)
      outerGlow.addColorStop(0, 'rgba(100, 150, 255, 0.4)')
      outerGlow.addColorStop(0.5, 'rgba(150, 100, 255, 0.2)')
      outerGlow.addColorStop(1, 'rgba(200, 80, 255, 0)')

      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 1.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // LAYER 2: Mid glow
      ctx.save()
      ctx.filter = 'blur(40px)'
      const midGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.5)
      midGlow.addColorStop(0, 'rgba(120, 180, 255, 0.5)')
      midGlow.addColorStop(0.6, 'rgba(160, 100, 220, 0.3)')
      midGlow.addColorStop(1, 'rgba(200, 80, 220, 0)')

      ctx.fillStyle = midGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 1.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // LAYER 3: Core morphing blob with gradient
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius)
      coreGradient.addColorStop(0, 'rgba(150, 200, 255, 0.9)')
      coreGradient.addColorStop(0.3, 'rgba(120, 180, 255, 0.8)')
      coreGradient.addColorStop(0.6, 'rgba(100, 150, 220, 0.6)')
      coreGradient.addColorStop(0.85, 'rgba(160, 100, 220, 0.4)')
      coreGradient.addColorStop(1, 'rgba(200, 80, 220, 0.1)')

      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.moveTo(blobPoints[0][0], blobPoints[0][1])

      // Draw smooth blob outline using quadratic curves
      for (let i = 0; i < blobPoints.length; i++) {
        const current = blobPoints[i]
        const next = blobPoints[(i + 1) % blobPoints.length]
        const midX = (current[0] + next[0]) / 2
        const midY = (current[1] + next[1]) / 2
        ctx.quadraticCurveTo(current[0], current[1], midX, midY)
      }

      ctx.closePath()
      ctx.fill()

      // LAYER 4: Inner highlight for 3D effect
      ctx.save()
      ctx.globalAlpha = 0.3
      const highlight = ctx.createRadialGradient(
        centerX - baseRadius * 0.3,
        centerY - baseRadius * 0.3,
        0,
        centerX + baseRadius * 0.2,
        centerY + baseRadius * 0.2,
        baseRadius * 0.8
      )
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      highlight.addColorStop(0.3, 'rgba(220, 240, 255, 0.3)')
      highlight.addColorStop(1, 'rgba(150, 180, 220, 0)')

      ctx.fillStyle = highlight
      ctx.beginPath()
      ctx.moveTo(blobPoints[0][0], blobPoints[0][1])
      for (let i = 0; i < blobPoints.length; i++) {
        const current = blobPoints[i]
        const next = blobPoints[(i + 1) % blobPoints.length]
        const midX = (current[0] + next[0]) / 2
        const midY = (current[1] + next[1]) / 2
        ctx.quadraticCurveTo(current[0], current[1], midX, midY)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // LAYER 5: Subtle edge glow
      ctx.save()
      ctx.strokeStyle = 'rgba(180, 200, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.filter = 'blur(6px)'
      ctx.beginPath()
      ctx.moveTo(blobPoints[0][0], blobPoints[0][1])
      for (let i = 0; i < blobPoints.length; i++) {
        const current = blobPoints[i]
        const next = blobPoints[(i + 1) % blobPoints.length]
        const midX = (current[0] + next[0]) / 2
        const midY = (current[1] + next[1]) / 2
        ctx.quadraticCurveTo(current[0], current[1], midX, midY)
      }
      ctx.closePath()
      ctx.stroke()
      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#000000' }}
    />
  )
}
