'use client'

export type DivinationMethod = 'tarot' | 'oracle' | 'numerology' | 'astrology' | 'runes' | 'surrealism'

interface MethodSelectorProps {
  onSelectMethod: (method: DivinationMethod) => void
}

const METHODS: Array<{ id: DivinationMethod; label: string; description: string }> = [
  { id: 'tarot', label: 'Tarot', description: 'Cards of destiny' },
  { id: 'oracle', label: 'Witch Oracle', description: 'Ancient wisdom' },
  { id: 'numerology', label: 'Numerology', description: 'Numbers speak' },
  { id: 'astrology', label: 'Astrology', description: 'Stars align' },
  { id: 'runes', label: 'Runes', description: 'Sacred stones' },
  { id: 'surrealism', label: 'The Dream (Surrealism)', description: 'Dreamlike visions' },
]

export default function MethodSelector({ onSelectMethod }: MethodSelectorProps) {
  return (
    <div className="animate-fade-in w-full max-w-2xl px-4 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-neutral-950 mb-1 sm:mb-2">
          Which mystical method
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 font-serif italic">
          will divine your path?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className="p-3 sm:p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <p className="text-sm sm:text-base font-semibold text-neutral-950">{method.label}</p>
            <p className="text-xs text-neutral-500 mt-1">{method.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
