'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number // milliseconds per character
  onComplete?: () => void
  showCursor?: boolean
}

export default function TypewriterText({
  text,
  speed = 40,
  onComplete,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showBlinkCursor, setShowBlinkCursor] = useState(true)

  useEffect(() => {
    if (displayedText.length === text.length) {
      setIsComplete(true)
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1))
    }, speed)

    return () => clearTimeout(timer)
  }, [displayedText, text, speed, onComplete])

  // Cursor blink animation
  useEffect(() => {
    if (!isComplete || !showCursor) return

    const blinkTimer = setInterval(() => {
      setShowBlinkCursor((prev) => !prev)
    }, 530) // Blink roughly once per second

    return () => clearInterval(blinkTimer)
  }, [isComplete, showCursor])

  return (
    <div className="relative whitespace-pre-wrap break-words font-mono text-center inline-block">
      <span>{displayedText}</span>
      {showCursor && !isComplete && <span className="animate-pulse">█</span>}
      {showCursor && isComplete && (
        <span className={`${showBlinkCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
          █
        </span>
      )}
    </div>
  )
}
