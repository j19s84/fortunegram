export const TIMELINES = [
  "the year ahead",
  "right now",
  "immediately",
  "this chapter in life",
  "today",
  "tomorrow",
  "this life",
  "this month",
  "this season",
  "this moment",
]

export const getRandomTimelines = (count: number = 2): string[] => {
  const shuffled = [...TIMELINES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
