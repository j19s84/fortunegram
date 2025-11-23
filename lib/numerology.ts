import numerologyData from './numerology.json'

export interface NumerologyNumber {
  number: number
  keyword: string
  meaning: string
  detailed_meaning: string
}

export type NumerologyData = Record<string, NumerologyNumber>

/**
 * Get number data by number (1-9)
 */
export function getNumberData(number: number): NumerologyNumber | null {
  const key = String(number)
  const data = numerologyData as NumerologyData
  return data[key] || null
}

/**
 * Get a random number between 1-9
 */
export function getRandomNumber(): number {
  return Math.floor(Math.random() * 9) + 1
}

/**
 * Calculate number from a name using simple numerology (sum digits until single digit)
 * For now, we'll use random for simplicity, but this function shows how it could work
 */
export function calculateNumberFromName(name: string): number {
  let sum = 0
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i)
  }
  // Reduce to single digit
  while (sum >= 10) {
    sum = Math.floor(sum / 10) + (sum % 10)
  }
  return sum === 0 ? 9 : sum
}

/**
 * Get number data for display - uses random for now
 */
export function selectNumber(): NumerologyNumber {
  const number = getRandomNumber()
  const data = getNumberData(number)
  if (!data) {
    // Fallback (should never happen)
    return getNumberData(1)!
  }
  return data
}
