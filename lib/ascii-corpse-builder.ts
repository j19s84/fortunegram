import headsData from './ascii-heads.json'
import torsosData from './ascii-torsos.json'
import legsData from './ascii-legs.json'

export function getHeadASCII(persona: string): string {
  const key = persona.toLowerCase()
  return headsData.heads[key as keyof typeof headsData.heads] || ""
}

export function getTorsoASCII(timeline: string): string {
  const key = timeline.toLowerCase()
  return torsosData.torsos[key as keyof typeof torsosData.torsos] || ""
}

export function getLegsASCII(energy: string): string {
  const key = energy.toLowerCase()
  return legsData.legs[key as keyof typeof legsData.legs] || ""
}

export function assembleCorpse(
  persona: string | null,
  timeline: string | null,
  energy: string | null
): string {
  const parts: string[] = []

  if (persona) {
    const head = getHeadASCII(persona)
    if (head) parts.push(head)
  }

  if (timeline) {
    const torso = getTorsoASCII(timeline)
    if (torso) parts.push(torso)
  }

  if (energy) {
    const legs = getLegsASCII(energy)
    if (legs) parts.push(legs)
  }

  return parts.join('\n')
}
