// Daily limit management using localStorage

const STORAGE_KEY = 'fortunegram_daily_limit'

interface DailyLimitData {
  date: string
  fortuneUsed: boolean
  timestamp: number
}

export function hasUsedFortune(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return false

    const parsed: DailyLimitData = JSON.parse(data)
    const today = new Date().toDateString()

    // Check if the stored date matches today
    return parsed.date === today && parsed.fortuneUsed
  } catch (error) {
    console.error('Error checking daily limit:', error)
    return false
  }
}

export function markFortuneAsUsed(): void {
  if (typeof window === 'undefined') return

  try {
    const data: DailyLimitData = {
      date: new Date().toDateString(),
      fortuneUsed: true,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving daily limit:', error)
  }
}

export function getTimeUntilMidnight(): {
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
} {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  const diff = midnight.getTime() - now.getTime()
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { hours, minutes, seconds, totalSeconds }
}

export function resetDailyLimit(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error resetting daily limit:', error)
  }
}
