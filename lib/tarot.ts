export interface TarotCardWithImages {
  name: string
  number: string
  arcana: string
  suit: string
  img: string
  fortune_telling: string[]
  keywords: string[]
  meanings: {
    light: string[]
    shadow: string[]
  }
  Archetype?: string
  'Hebrew Alphabet'?: string
  Numerology?: string
  Elemental?: string
  'Mythical/Spiritual'?: string
  'Questions to Ask'?: string[]
}

export interface TarotImagesData {
  description: string
  cards: TarotCardWithImages[]
}

let cachedTarotCards: TarotCardWithImages[] | null = null

export async function getTarotCards(): Promise<TarotCardWithImages[]> {
  if (cachedTarotCards) {
    return cachedTarotCards
  }

  try {
    const response = await fetch('/tarot-images.json')
    const data: TarotImagesData = await response.json()
    cachedTarotCards = data.cards
    return data.cards
  } catch (error) {
    console.error('Failed to load tarot cards:', error)
    return []
  }
}

export function getRandomTarotCard(cards: TarotCardWithImages[]): TarotCardWithImages | null {
  if (cards.length === 0) return null
  return cards[Math.floor(Math.random() * cards.length)]
}

export function getTarotCardByName(cards: TarotCardWithImages[], name: string): TarotCardWithImages | null {
  return cards.find(card => card.name.toLowerCase() === name.toLowerCase()) || null
}

/**
 * Gets a meaningful wisdom snippet from the card to use in fortune generation
 */
export function getCardWisdom(card: TarotCardWithImages): string {
  // Prefer fortune_telling wisdom first, then light meanings
  if (card.fortune_telling && card.fortune_telling.length > 0) {
    return card.fortune_telling[Math.floor(Math.random() * card.fortune_telling.length)]
  }
  if (card.meanings?.light && card.meanings.light.length > 0) {
    return card.meanings.light[Math.floor(Math.random() * card.meanings.light.length)]
  }
  return card.keywords?.join(', ') || card.name
}
