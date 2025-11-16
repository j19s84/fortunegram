'use client'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      {/* Concentric rotating circles */}
      <div className="relative w-32 h-32">
        {/* Outer circle */}
        <div className="absolute inset-0 border-2 border-neutral-300 rounded-full animate-spin" style={{ animationDuration: '3s' }} />

        {/* Middle circle */}
        <div className="absolute inset-2 border-2 border-neutral-400 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />

        {/* Inner circle */}
        <div className="absolute inset-4 border-2 border-neutral-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-neutral-600 rounded-full" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-serif text-neutral-950">Channeling your path...</p>
      </div>
    </div>
  )
}
