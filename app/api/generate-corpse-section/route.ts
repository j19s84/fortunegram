import { NextRequest, NextResponse } from 'next/server'

// Simple ASCII art generators for corpse sections
const generateHeadASCII = (persona: string): string => {
  const heads = [
    `  ◯◯◯◯◯
 ◯     ◯
◯   •   ◯
 ◯     ◯
  ◯◯◯◯◯`,
    `   ∿∿∿∿
  ∿ ◉ ∿
 ∿  •  ∿
  ∿ ◉ ∿
   ∿∿∿∿`,
    `  ╱╲╱╲╱╲
 ╱  ◈  ╲
╱   •   ╲
 ╲  ◈  ╱
  ╲╱╲╱╲╱`,
    `   ⬢⬢⬢
  ⬢ ◇ ⬢
 ⬢  •  ⬢
  ⬢ ◇ ⬢
   ⬢⬢⬢`,
  ]
  return heads[Math.floor(Math.random() * heads.length)]
}

const generateTorsoASCII = (description: string): string => {
  // Use description to create varied torsos
  const isActive = description.toLowerCase().includes('active') || description.toLowerCase().includes('strong')
  const isSoft = description.toLowerCase().includes('soft') || description.toLowerCase().includes('gentle')
  const isWide = description.toLowerCase().includes('wide') || description.toLowerCase().includes('broad')

  const torsos = [
    `  ╱════╲
 ╱      ╲
│   ◆    │
│   ◆    │
 ╲      ╱`,
    `  ┌─────┐
  │  ∿∿∿  │
  │  ∿◇∿  │
  │  ∿∿∿  │
  └─────┘`,
    `  ╔═════╗
  ║ ◈ ◈ ║
  ║  ◉  ║
  ║ ◈ ◈ ║
  ╚═════╝`,
    `   ⟨═════⟩
   ⟨  ◇◇  ⟩
   ⟨  •◇  ⟩
   ⟨  ◇◇  ⟩
   ⟨═════⟩`,
  ]
  return torsos[Math.floor(Math.random() * torsos.length)]
}

const generateLegsASCII = (energy: string): string => {
  const legs = [
    `  ║   ║
  ║   ║
  │   │
  │   │
  ▼   ▼`,
    `  ╱   ╲
  │   │
  ╱   ╲
 ╱     ╲
▼       ▼`,
    `  ◆   ◆
  ║   ║
  │   │
  ├───┤
  ▼   ▼`,
    `  ⬥   ⬥
  ╱   ╲
 ╱     ╲
╱       ╲
▼       ▼`,
  ]
  return legs[Math.floor(Math.random() * legs.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, persona, description, timeline, energy } = body

    if (!section) {
      return NextResponse.json(
        { error: 'Section required' },
        { status: 400 }
      )
    }

    let ascii = ''

    switch (section) {
      case 'head':
        ascii = generateHeadASCII(persona || '')
        break
      case 'torso':
        ascii = generateTorsoASCII(description || '')
        break
      case 'legs':
        ascii = generateLegsASCII(energy || '')
        break
      default:
        return NextResponse.json(
          { error: 'Invalid section' },
          { status: 400 }
        )
    }

    return NextResponse.json({ ascii })
  } catch (error) {
    console.error('Corpse section generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate section' },
      { status: 500 }
    )
  }
}
