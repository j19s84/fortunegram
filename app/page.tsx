'use client'

import { useState, useEffect } from 'react'
import FortuneCard from '@/components/FortuneCard'
import StarField from '@/components/StarField'
import { getDailyFortune } from '@/lib/fortunes'

export default function Home() {
  const [fortune, setFortune] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [newFortune, setNewFortune] = useState(false)

  useEffect(() => {
    const loadFortune = async () => {
      setIsLoading(true)
      const dailyFortune = getDailyFortune()
      setFortune(dailyFortune)
      setIsLoading(false)
    }

    loadFortune()
  }, [])

  const handleNewFortune = () => {
    setNewFortune(true)
    setTimeout(() => {
      setFortune(getDailyFortune())
      setNewFortune(false)
    }, 600)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <StarField />

      {/* Header */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-6xl md:text-7xl font-mystical font-bold mb-2 mystical-glow">
          ✨ Fortunegram ✨
        </h1>
        <p className="text-purple-300 text-lg md:text-xl font-serif">
          Divine your destiny, one fortune at a time
        </p>
      </div>

      {/* Fortune Card */}
      <div className="w-full max-w-2xl mb-8 z-10">
        <FortuneCard
          fortune={fortune}
          isLoading={isLoading}
          isAnimating={newFortune}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 z-10 flex-wrap justify-center">
        <button
          onClick={handleNewFortune}
          disabled={isLoading}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-serif rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
        >
          🔮 Another Fortune
        </button>

        <button
          className="px-8 py-3 border-2 border-purple-500 text-purple-300 hover:text-purple-200 font-serif rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
        >
          📖 About
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-purple-400 text-sm opacity-60 z-10">
        <p>✦ Tap into the mystical energies ✦</p>
      </footer>
    </main>
  )
}
