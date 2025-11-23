/**
 * Dynamic ASCII art generator for the exquisite corpse
 * Each body part (head, torso, legs, feet) varies based on user selections
 */

// HEAD - based on persona/character choice
const HEADS: Record<string, string> = {
  "the poet": `   ( ★ )
  / ~ \\
  | ◇ |
   \\ ~ /
    ~~~`,
  "the warlock": `   ( ◆ )
  / \\ /
  | ◆ |
   \\ / \\
    ~~~`,
  "the fool": `   ( ◯ )
  / ^ \\
  | ◇ |
   \\ ^ /
    ~~~`,
  "the devil": `   (666)
  / \\ /
  | ◆ |
   \\ * /
    ~~~`,
  "the witch": `   ( ✦ )
  / ~ \\
  | ◇ |
   \\ ~ /
    ~~~`,
  "the oracle": `   ( ◈ )
  / ~ \\
  | ◇ |
   \\ ~ /
    ~~~`,
  "the child": `   ( • )
  / ^ \\
  | ◯ |
   \\ ^ /
    ~~~`,
  "the beast": `   ( ◆ )
  / \\ /
  | ◆ |
   \\ * /
    ~~~`,
  "the philosopher": `   ( ▲ )
  / ~ \\
  | ◇ |
   \\ ~ /
    ~~~`,
}

// TORSO - based on timeline/timeframe choice
const TORSOS: Record<string, string> = {
  "the year ahead": ` / ◇ • ◇ \\
| ◆ ◆ ◆ |
| • ~ • |
 \\ ◇ ◆ /`,
  "right now": ` / ◆ • ◆ \\
| • ◆ • |
| ◆ ~ ◆ |
 \\ ◆ • /`,
  "immediately": ` / ◯ • ◯ \\
| ◆ ◇ ◆ |
| • ★ • |
 \\ ◆ ◯ /`,
  "this chapter in life": ` / ▲ • ▲ \\
| ◇ ◆ ◇ |
| • ~ • |
 \\ ◇ ▲ /`,
  "today": ` / ◇ ◯ ◇ \\
| ★ ◆ ★ |
| • ~ • |
 \\ ◇ ◯ /`,
  "tomorrow": ` / ◆ ◇ ◆ \\
| • ★ • |
| ◆ ~ ◆ |
 \\ ◆ ◇ /`,
  "this life": ` / ◇ ◆ ◇ \\
| ▲ ★ ▲ |
| • ~ • |
 \\ ◇ ◆ /`,
  "this month": ` / ◇ ◯ ◇ \\
| ◆ • ◆ |
| ★ ~ ★ |
 \\ ◇ ◯ /`,
  "this season": ` / ▲ ◇ ▲ \\
| ◆ ◆ ◆ |
| • ~ • |
 \\ ▲ ◆ /`,
  "this moment": ` / ◯ ◇ ◯ \\
| ★ ◆ ★ |
| • ~ • |
 \\ ◯ ◆ /`,
}

// LEGS - based on energy choice
const LEGS_MAP: Record<string, string> = {
  "bold and direct": ` / ▲ | ▲ \\
| ★ | ★ |
| ◆ | ◆ |
 \\ ▼ | ▼ /`,
  "gentle and flowing": ` / ◯ ~ ◯ \\
| • ~ • |
| ◇ ~ ◇ |
 \\ ◯ ~ ◯ /`,
  "steady and grounded": ` / ◆ | ◆ \\
| • | • |
| ◆ | ◆ |
 \\ ◆ | ◆ /`,
  "cautious and observant": ` / ◇ ◯ ◇ \\
| • ~ • |
| ◆ ◆ ◆ |
 \\ ◇ ◯ ◇ /`,
  "restless and searching": ` / ▲ ~ ▲ \\
| ★ ◇ ★ |
| ◆ ~ ◆ |
 \\ ▼ ~ ▼ /`,
  "calm and cool": ` / ◯ ~ ◯ \\
| ◆ ~ ◆ |
| • ~ • |
 \\ ◯ ~ ◯ /`,
  "warm and open": ` / ◇ • ◇ \\
| ★ ★ ★ |
| ◇ ~ ◇ |
 \\ ◇ • ◇ /`,
  "sharp and focused": ` / ▲ ★ ▲ \\
| ◆ ◆ ◆ |
| • | • |
 \\ ▲ ★ ▲ /`,
  "slow and deliberate": ` / ◇ | ◇ \\
| ◆ | ◆ |
| • | • |
 \\ ◇ | ◇ /`,
  "wild and untamed": ` / ▲ ~ ▲ \\
| ★ ◆ ★ |
| ◇ ~ ◇ |
 \\ ▼ ~ ▼ /`,
  "bright and rising": ` / ◯ • ◯ \\
| ★ ★ ★ |
| ◇ ◇ ◇ |
 \\ ◯ • ◯ /`,
  "quiet and holding": ` / ◇ ~ ◇ \\
| • ~ • |
| ◆ ~ ◆ |
 \\ ◇ ~ ◇ /`,
  "curious and seeking": ` / ◯ ? ◯ \\
| ★ ◇ ★ |
| ◆ ~ ◆ |
 \\ ◯ ? ◯ /`,
  "shadowed and inward": ` / ◆ ~ ◆ \\
| • ~ • |
| ◇ ~ ◇ |
 \\ ◆ ~ ◆ /`,
  "playful and unpredictable": ` / ◯ ★ ◯ \\
| ◇ ◆ ◇ |
| ★ ~ ★ |
 \\ ◯ ★ ◯ /`,
  "disciplined and unwavering": ` / ◆ | ◆ \\
| ★ | ★ |
| ◆ | ◆ |
 \\ ◆ | ◆ /`,
  "patient and enduring": ` / ◇ | ◇ \\
| ◆ | ◆ |
| ◆ | ◆ |
 \\ ◇ | ◇ /`,
  "impulsive and fierce": ` / ▲ ★ ▲ \\
| ★ ◆ ★ |
| ◇ ~ ◇ |
 \\ ▼ ★ ▼ /`,
  "thoughtful and analytical": ` / ◇ ~ ◇ \\
| ★ ◆ ★ |
| • ~ • |
 \\ ◇ ~ ◇ /`,
  "dreamy and wandering": ` / ◯ ~ ◯ \\
| ◇ ◆ ◇ |
| ~ ~ ~ |
 \\ ◯ ~ ◯ /`,
  "resilient and steady": ` / ◆ | ◆ \\
| • | • |
| ◆ | ◆ |
 \\ ◆ | ◆ /`,
  "intuitive and receptive": ` / ◯ ~ ◯ \\
| • ◆ • |
| ◇ ~ ◇ |
 \\ ◯ ~ ◯ /`,
  "drifting and unanchored": ` / ◯ ~ ◯ \\
| ~ ~ ~ |
| ◇ ~ ◇ |
 \\ ◯ ~ ◯ /`,
  "ancient and remembering": ` / ◇ ~ ◇ \\
| ◆ ◆ ◆ |
| • ~ • |
 \\ ◇ ~ ◇ /`,
  "awakening and expanding": ` / ◯ ★ ◯ \\
| ◆ ◆ ◆ |
| ★ ★ ★ |
 \\ ◯ ★ ◯ /`,
  "turbulent and transforming": ` / ▲ ~ ▲ \\
| ★ ◇ ★ |
| ~ ◆ ~ |
 \\ ▼ ~ ▼ /`,
  "luminous and unfolding": ` / ◯ ★ ◯ \\
| ★ ★ ★ |
| ◇ ◆ ◇ |
 \\ ◯ ★ ◯ /`,
}

// FEET - based on oracle/lens choice
const FEET_MAP: Record<string, string> = {
  "the cards": ` / ◯ | ◯ \\
|_♦___|_♦_|
 ◇◇◇◇◇◇◇◇◇`,
  "the numbers": ` / ▲ | ▲ \\
|_◯___|_◯_|
 ◆◆◆◆◆◆◆◆◆`,
  "the stones": ` / ◆ | ◆ \\
|_★___|_★_|
 ᚱᚢᚾᚨᚱᚲᚳᚹᚢ`,
  "the stars": ` / ★ | ★ \\
|_✦___|_✦_|
 ✧✦✧✦✧✦✧✦✧`,
  "the coins": ` / ◯ | ◯ \\
|_☯___|_☯_|
 ⚜⚜⚜⚜⚜⚜⚜⚜⚜`,
  "the poets": ` / ◇ | ◇ \\
|_✒___|_✒_|
 📖📖📖📖📖📖📖📖📖`,
  "the cut-up": ` / ◯ | ◯ \\
|_▓___|_▓_|
 ▓▓▓▓▓▓▓▓▓`,
  "the tea leaves": ` / ◇ | ◇ \\
|_🍃__|_🍃|
 🍃🍃🍃🍃🍃🍃🍃🍃🍃`,
  "the mirror": ` / ◈ | ◈ \\
|_◈___|_◈_|
 ◈◈◈◈◈◈◈◈◈`,
  "the smoke": ` / ≈ | ≈ \\
|_≋___|_≋_|
 ≈≈≈≈≈≈≈≈≈`,
  "the ink": ` / ◐ | ◐ \\
|_◎___|_◎_|
 ◐◎◑◐◎◑◐◎◑`,
  "the water": ` / ∿ | ∿ \\
|_∿___|_∿_|
 ∿∿∿∿∿∿∿∿∿`,
  "the bones": ` / ◆ | ◆ \\
|_☠___|_☠_|
 ◆◆◆◆◆◆◆◆◆`,
}

/**
 * Get the appropriate head ASCII art for a persona
 */
export function getHeadArt(persona: string | null): string {
  if (!persona) return HEADS["the poet"]
  return HEADS[persona] || HEADS["the poet"]
}

/**
 * Get the appropriate torso ASCII art for a timeline
 */
export function getTorsoArt(timeline: string | null): string {
  if (!timeline) return TORSOS["right now"]
  return TORSOS[timeline] || TORSOS["right now"]
}

/**
 * Get the appropriate legs ASCII art for an energy
 */
export function getLegsArt(energy: string | null): string {
  if (!energy) return LEGS_MAP["bold and direct"]
  return LEGS_MAP[energy] || LEGS_MAP["bold and direct"]
}

/**
 * Get the appropriate feet ASCII art for an oracle
 */
export function getFeetArt(oracle: string | null): string {
  if (!oracle) return FEET_MAP["the cards"]
  return FEET_MAP[oracle] || FEET_MAP["the cards"]
}
