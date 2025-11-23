'use client'

interface LoadingAnimationProps {
  oracle?: string
}

export default function LoadingAnimation({ oracle }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      {/* Concentric circles animation */}
      <div className="relative w-20 h-20">
        {/* Outer ring - slow rotation */}
        <div className="absolute inset-0 border border-neutral-200 rounded-full animate-spin" style={{ animationDuration: '3s' }} />

        {/* Middle ring - medium rotation (reverse) */}
        <div className="absolute inset-2 border border-neutral-300 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />

        {/* Inner circle - pulsing */}
        <div className="absolute inset-4 border-2 border-neutral-900 rounded-full animate-pulse" />
      </div>

      {/* Label */}
      <p className="text-sm text-neutral-500 font-serif italic">
        Channeling your path...
      </p>
    </div>
  )
}
