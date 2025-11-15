'use client'

import { useState, useEffect } from 'react'

interface DailyLimitNoticeProps {
  onReset?: () => void
}

export default function DailyLimitNotice({ onReset }: DailyLimitNoticeProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)

      const diff = midnight.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining({ hours, minutes, seconds })
    }

    calculateTimeRemaining()

    const interval = setInterval(calculateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (num: number) => String(num).padStart(2, '0')

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-in-up">
      <div className="card p-8 text-center">
        {/* Icon */}
        <div className="text-4xl mb-4">✨</div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          Daily Fortune Used
        </h3>
        <p className="text-neutral-600 mb-6">
          You&apos;ve received your fortune for today. Return tomorrow for a new reading.
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <p className="text-sm text-neutral-500 mb-3">Time until next fortune:</p>
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-neutral-900">
                {pad(timeRemaining.hours)}
              </span>
              <span className="text-xs text-neutral-500 mt-1">hours</span>
            </div>
            <span className="text-3xl text-neutral-300">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-neutral-900">
                {pad(timeRemaining.minutes)}
              </span>
              <span className="text-xs text-neutral-500 mt-1">minutes</span>
            </div>
            <span className="text-3xl text-neutral-300">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-neutral-900">
                {pad(timeRemaining.seconds)}
              </span>
              <span className="text-xs text-neutral-500 mt-1">seconds</span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-neutral-900 mb-3">While you wait:</p>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>• Reflect on today&apos;s fortune</li>
            <li>• Share your reading with friends</li>
            <li>• Explore different fortune methods</li>
          </ul>
        </div>

        {/* Action */}
        <button
          onClick={onReset}
          className="btn btn-secondary"
        >
          Go Back Home
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-neutral-50 rounded-lg text-center text-sm text-neutral-600">
        <p>
          <strong>Why once per day?</strong> Daily fortunes are more meaningful when they&apos;re special.
          One reading per day helps you focus on its message and trust in the universe&apos;s timing.
        </p>
      </div>
    </div>
  )
}
