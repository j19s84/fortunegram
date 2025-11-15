interface FortuneCardProps {
  fortune: string
  isLoading: boolean
  isAnimating: boolean
}

export default function FortuneCard({
  fortune,
  isLoading,
  isAnimating,
}: FortuneCardProps) {
  return (
    <div
      className={`witchy-card transition-all duration-500 ${
        isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-purple-500 border-opacity-20 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
              style={{ animationDuration: '2s' }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {/* Crystal Ball Icon */}
          <div className="text-6xl mb-6 animate-pulse">🔮</div>

          {/* Fortune Text */}
          <p className="text-2xl md:text-3xl font-serif leading-relaxed text-purple-100 mb-6 shimmer-text">
            {fortune}
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 text-purple-400 opacity-60">
            <span>✦</span>
            <span>☆</span>
            <span>✦</span>
          </div>
        </div>
      )}
    </div>
  )
}
