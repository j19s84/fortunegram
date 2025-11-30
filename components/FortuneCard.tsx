'use client'

import { useRef, useState } from 'react'
import type { CorpseChoices } from './CorpseBuilder'
import type { DivinationMethod } from './MethodSelector'

interface FortuneCardProps {
  fortune: string
  corpse?: string
  choices?: CorpseChoices
  method?: DivinationMethod
  oracleName?: string
  onDownload?: () => void
  isExporting?: boolean
  fortuneId?: string
}

// Map oracle names to display names
const getOracleLabel = (oracleName?: string, method?: DivinationMethod): string => {
  if (!oracleName) return ''

  const oracleMap: Record<string, string> = {
    'the cards': 'The Cards',
    'the stones': 'The Stones',
    'the coins': 'The Coins',
    'the stars': 'The Stars',
    'the numbers': 'The Numbers',
    'the poets': 'The Poets',
    'the dream': 'The Dream',
  }

  const methodMap: Record<DivinationMethod, string> = {
    tarot: 'Tarot',
    runes: 'Runes',
    oracle: 'Oracle',
    numerology: 'Numerology',
    astrology: 'Astrology',
    surrealism: 'Surrealism',
  }

  const oracleLabel = oracleMap[oracleName.toLowerCase()] || oracleName
  const methodLabel = method ? methodMap[method] : ''

  return methodLabel ? `${oracleLabel} • ${methodLabel}` : oracleLabel
}

const hasShareApi = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share
}

export default function FortuneCard({
  fortune,
  corpse,
  choices,
  method,
  oracleName,
  onDownload,
  isExporting = false,
  fortuneId,
}: FortuneCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return

    setIsDownloading(true)

    try {
      if (onDownload) {
        onDownload()
      }

      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default

      // Capture the card with high resolution
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      // Create download link
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `fortunegram-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download card:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleWebShare = async () => {
    if (!hasShareApi()) {
      handleCopyLink()
      return
    }

    try {
      const shareData = {
        title: 'My Fortunegram',
        text: `I received this fortune from Fortunegram:\n\n"${fortune}"`,
        url: window.location.href,
      }

      if (navigator.share) {
        await navigator.share(shareData)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  // Instagram-friendly aspect ratio: 1080x1350 (4:5)
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full px-4 sm:px-0">
      {/* Card Preview */}
      <div
        ref={cardRef}
        className="w-full max-w-sm"
        style={{
          aspectRatio: '1080 / 1350',
          background: 'linear-gradient(135deg, #c8b4e6 0%, #b496dc 25%, #a078d2 50%, #8c64c8 75%, #ffffff 100%)',
        }}
      >
        <div className="h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 relative overflow-hidden">
          {/* Aura/Orb glow effect behind corpse */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 20%, transparent 50%)',
            }}
          />

          {/* Subtle background radial gradient */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)',
            }}
          />

          {/* Enhanced grain texture effect */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(0, 0, 0, 0.04) 0px,
                  rgba(0, 0, 0, 0.04) 1px,
                  transparent 1px,
                  transparent 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  rgba(0, 0, 0, 0.02) 0px,
                  rgba(0, 0, 0, 0.02) 2px,
                  transparent 2px,
                  transparent 4px
                )
              `,
            }}
          />

          {/* Content Container */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Top: Branding */}
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-neutral-950 tracking-tight">
                Fortunegram
              </h1>
              <div className="h-px bg-neutral-950 opacity-20 mt-2 sm:mt-3 mb-1 sm:mb-2" />
            </div>

            {/* Middle: Corpse Visual & Oracle Type */}
            <div className="flex flex-col items-center justify-center flex-grow gap-5">
              {/* Exquisite Corpse ASCII Art with glow */}
              {corpse && (
                <div
                  className="font-mono text-xs leading-relaxed text-neutral-900 text-center whitespace-pre opacity-95"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.2))',
                  }}
                >
                  {corpse}
                </div>
              )}

              {/* Oracle Type Label - More Prominent */}
              <div className="text-center pt-2">
                <p className="text-sm font-mono tracking-widest text-neutral-800 uppercase font-semibold letter-spacing">
                  {getOracleLabel(oracleName, method)}
                </p>
              </div>
            </div>

            {/* Fortune Text - Improved Readability */}
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm leading-relaxed sm:leading-loose text-neutral-950 font-serif italic">
                {fortune}
              </p>
            </div>

            {/* Bottom: Tagline */}
            <div className="text-center border-t border-neutral-950 border-opacity-20 pt-3 sm:pt-4 pb-0">
              <p className="text-xs font-serif text-neutral-700 italic">
                Daily directions from the beyond
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-3 flex-wrap justify-center w-full max-w-sm px-4 sm:px-0">
        {/* Share Button - Web Share API or Copy Link */}
        <button
          onClick={handleWebShare}
          disabled={isExporting}
          className="btn btn-secondary text-xs sm:text-sm flex-1 min-w-20 sm:min-w-32 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2 sm:py-3"
          title={hasShareApi() ? 'Share to social media' : 'Copy link to clipboard'}
        >
          {copyFeedback ? '✓ Copied!' : hasShareApi() ? '↗ Share' : '🔗 Copy Link'}
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading || isExporting}
          className="btn btn-secondary text-xs sm:text-sm flex-1 min-w-20 sm:min-w-32 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2 sm:py-3"
        >
          {isDownloading || isExporting ? 'Generating...' : '↓ Download'}
        </button>
      </div>
    </div>
  )
}
