import corpseData from './corpses.json'

export function getRandomCorpse(): string {
  const corpses = corpseData.corpses
  const randomIndex = Math.floor(Math.random() * corpses.length)
  return corpses[randomIndex]
}
