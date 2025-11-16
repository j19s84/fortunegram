export const ENERGIES = [
  "bold and direct",
  "gentle and flowing",
  "steady and grounded",
  "cautious and observant",
  "restless and searching",
  "calm and cool",
  "warm and open",
  "sharp and focused",
  "slow and deliberate",
  "wild and untamed",
  "bright and rising",
  "quiet and holding",
  "curious and seeking",
  "shadowed and inward",
  "playful and unpredictable",
  "disciplined and unwavering",
  "patient and enduring",
  "impulsive and fierce",
  "thoughtful and analytical",
  "dreamy and wandering",
  "resilient and steady",
  "intuitive and receptive",
  "drifting and unanchored",
  "ancient and remembering",
  "awakening and expanding",
  "turbulent and transforming",
  "luminous and unfolding",
]

export const getRandomEnergies = (count: number = 2): string[] => {
  const shuffled = [...ENERGIES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
