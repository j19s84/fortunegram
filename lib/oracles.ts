export interface Oracle {
  name: string
  subtitle: string
}

// ONLY these 7 oracles are allowed in Fortunegram
export const ORACLES: Oracle[] = [
  { name: "the cards", subtitle: "tarot reading" },
  { name: "the numbers", subtitle: "numerology" },
  { name: "the stones", subtitle: "rune casting" },
  { name: "the stars", subtitle: "astrology" },
  { name: "the coins", subtitle: "i ching" },
  { name: "the poets", subtitle: "literary oracle" },
  { name: "the dream", subtitle: "surrealism" },
]

export const getRandomOracles = (count: number = 2): Oracle[] => {
  const shuffled = [...ORACLES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
