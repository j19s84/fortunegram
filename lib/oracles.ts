export const ORACLES = [
  "the cards",
  "the stones",
  "the stars",
  "the numbers",
  "the cut-up",
  "the bones",
  "the tea leaves",
  "the mirror",
  "the smoke",
  "the coins",
  "the water",
  "the ink",
  "the poets",
]

export const getRandomOracles = (count: number = 2): string[] => {
  const shuffled = [...ORACLES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
