import type { FortuneType } from '@/components/FortuneWheel'

const fortuneDatabase = {
  tarot: [
    "The High Priestess reveals that intuition is your greatest teacher. Trust the knowing that comes without words.",
    "The Magician shows you that you hold all the tools you need. Intention meets manifestation.",
    "The Hermit whispers that wisdom comes from stillness. Seek solitude to find clarity.",
    "The Wheel of Fortune reminds you: what rises must turn, what falls will rise again.",
    "Strength arrives—not as force, but as gentle persistence. The lion bows to the maiden's touch.",
    "The Tower appears not to destroy, but to rebuild. From rubble, something truer emerges.",
    "The Star guides you home. Follow the light within yourself.",
    "The Moon asks: what do you fear to see? Look deeper into the shadows.",
    "The Sun breaks through the clouds. Your brightest days are beginning.",
    "The World completes a cycle. You have grown into new knowing.",
  ],
  runes: [
    "Ansuz flows—the rune of communication. Speak your truth with clarity and power.",
    "Berkana grows—fertility and new beginnings. Plant seeds of intention now.",
    "Wunjo shines—harmony and joy. You are aligned with your path.",
    "Algiz protects—the shield rune. Divine protection surrounds you.",
    "Fehu flows with abundance. Generosity creates circulation; release to receive.",
    "Thurisaz pierces—the thorn rune. A challenge is a gateway to transformation.",
    "Perthro holds mystery. Not all is yet revealed; trust the unfolding.",
    "Sowilo illuminates. The sun within you cannot be dimmed.",
    "Isa pauses—stillness before movement. Rest and gather strength.",
    "Dagaz brings breakthrough. Dawn comes after the longest night.",
  ],
  iching: [
    "The I Ching speaks: Change is the only constant. Flow with transformation, not against it.",
    "Hexagram of Fire shows clarity blazing forth. Your vision illuminates the path.",
    "Water's wisdom teaches yielding strength. The softest overcomes the hardest.",
    "Heaven and Earth unite in you. Balance inner vision with outer action.",
    "The small contains the great. Do not underestimate what seems minor.",
    "Darkness before dawn—the pattern completes. What begins now will flourish.",
    "Thunder awakens. The time for stillness has passed; move with purpose.",
    "Mountain stands firm. Build your foundation on truth.",
    "Wind carries seeds far. Your influence reaches farther than you know.",
    "The great prepares. Gather resources; your moment approaches.",
  ],
  numerology: [
    "The number One resonates: beginnings, leadership, and divine will. You are a creator.",
    "Two vibrates—duality balanced. Partnership and cooperation magnetize toward you.",
    "Three sings—expression, joy, and expansion. Your voice matters; share it.",
    "Four grounds—stability and foundation. Build something that lasts.",
    "Five dances—freedom and change. Embrace adventure with confidence.",
    "Six harmonizes—home and service. Nurture what matters most.",
    "Seven reveals—spiritual wisdom and introspection. Truth comes from within.",
    "Eight amplifies—abundance cycles. Give generously; receive graciously.",
    "Nine completes—transformation and compassion. One chapter closes; another opens.",
    "Master Number 11 illuminates: Intuition meets action. You are aligned with higher purpose.",
  ],
  aiWitch: [
    "The AI oracle sees: You are a channel for creativity. Let the muse flow through you.",
    "Your witchy wisdom knows: Protection comes first. Set boundaries with love.",
    "The digital grimoire reveals: Small acts of intention create massive shifts. Consistency is magic.",
    "Ancient and modern dance together in you. Honor both tradition and innovation.",
    "Your cauldron bubbles with possibility. Which dreams will you brew into reality?",
    "The cosmic algorithm whispers: You are not lost; you are exactly where you need to be.",
    "Data and divinity merge. Trust patterns you see; the universe speaks in symbols.",
    "Your spell is already cast. Now believe in its power.",
    "The digital stars align: Synchronicity is no accident. You summoned this moment.",
    "Technology and magic are one. You are a modern mystic; claim your power.",
  ],
}

export function getFortune(
  fortuneType: FortuneType,
  selections: Record<string, string>
): string {
  // Use selections hash to determine which fortune to return
  const selectionString = Object.values(selections).join('-')
  const hash = selectionString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const fortunes = fortuneDatabase[fortuneType]
  const index = hash % fortunes.length
  return fortunes[index]
}

export function getDailyFortune(): string {
  // Use the current date to ensure the same fortune throughout the day
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )

  const allFortunes = Object.values(fortuneDatabase).flat()
  const index = dayOfYear % allFortunes.length
  return allFortunes[index]
}

export function getRandomFortune(): string {
  const allFortunes = Object.values(fortuneDatabase).flat()
  return allFortunes[Math.floor(Math.random() * allFortunes.length)]
}

export function getAllFortunes(): string[] {
  return Object.values(fortuneDatabase).flat()
}
