export interface Oracle {
  name: string
  subtitle: string
}

export const ORACLES: Oracle[] = [
  { name: "the cards", subtitle: "tarot reading" },
  { name: "the stones", subtitle: "rune casting" },
  { name: "the stars", subtitle: "astrology" },
  { name: "the numbers", subtitle: "numerology" },
  { name: "the cut-up", subtitle: "dada technique" },
  { name: "the bones", subtitle: "divination" },
  { name: "the tea leaves", subtitle: "tasseomancy" },
  { name: "the mirror", subtitle: "scrying" },
  { name: "the smoke", subtitle: "sign reading" },
  { name: "the coins", subtitle: "i ching" },
  { name: "the water", subtitle: "hydromancy" },
  { name: "the ink", subtitle: "bibliomancy" },
  { name: "the poets", subtitle: "literary wisdom" },
]

export const getRandomOracles = (count: number = 2): Oracle[] => {
  const shuffled = [...ORACLES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
