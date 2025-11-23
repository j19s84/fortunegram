import runesData from './runes.json'

export interface RuneData {
  name: string
  symbol: string
  ascii: string
  keyword: string
  meaning: string
  detailed_meaning: string
  reversed: string
}

export type RunesDataType = Record<string, RuneData>

/**
 * Get rune data by key
 */
export function getRuneData(key: string): RuneData | null {
  const data = runesData as RunesDataType
  return data[key.toLowerCase()] || null
}

/**
 * Get all rune keys
 */
export function getAllRuneKeys(): string[] {
  const data = runesData as RunesDataType
  return Object.keys(data)
}

/**
 * Get a random rune
 */
export function getRandomRune(): RuneData | null {
  const data = runesData as RunesDataType
  const keys = Object.keys(data)
  if (keys.length === 0) return null
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return data[randomKey] || null
}

/**
 * Select a random rune with full data
 */
export function selectRune(): RuneData {
  const rune = getRandomRune()
  if (!rune) {
    // Fallback (should never happen)
    return getRuneData('fehu')!
  }
  return rune
}
