const fortunes = [
  "The cards whisper secrets of your soul's journey. Trust the path unfolding before you.",
  "A mystical force guides you toward your truest desire. The universe conspires in your favor.",
  "Three doors present themselves. The one you seek reveals itself through intuition.",
  "The stars align to bring unexpected joy. Keep your heart open to miracles.",
  "An old soul recognizes you. A connection from past lifetimes awaits.",
  "Your spirit guides celebrate your courage. The impossible becomes possible for the brave.",
  "Beneath the veil of reality lies infinite potential. You are more powerful than you know.",
  "The pendulum swings. What was lost returns transformed and renewed.",
  "Listen to the whispers of the wind. Your ancestors speak guidance through nature.",
  "A purple flame burns in your heart. Let it illuminate your path forward.",
  "The crystal ball reveals: your dreams are not wishes, they are promises from your future self.",
  "Time bends for those who trust the journey. The destination finds you.",
  "Shadows dissolve when met with compassion. Embrace the light within your darkness.",
  "The oracle speaks: surrender control, dance with the current of life.",
  "Your aura shimmers with untapped potential. The world awaits your magic.",
  "A raven carries a message: your trials forge your wings. Soon you shall fly.",
  "The moon's pull draws you toward your deepest truth. Follow its gentle tide.",
  "What you seek is already seeking you. Stop, breathe, and open your hands.",
  "The threads of destiny weave tighter. A significant meeting approaches.",
  "Your crown is invisible only to those who forget to wear it. Remember who you are.",
  "The forest whispers: everything you need is already within you.",
  "A door you thought locked clicks gently open. The key was always your belief.",
  "The universe celebrates you today. Feel the cosmic dance in your bones.",
  "Your shadow self knocks with gifts, not curses. Listen without judgment.",
  "The cards fall: love arrives wearing an unexpected disguise.",
  "A spiral unfolds. Each turn brings you closer to your center.",
  "The sage bows: 'I did not know, until you taught me how to wonder.'",
  "Your courage echoes across dimensions. Infinite versions of you celebrate this moment.",
  "The crystal waters reflect truth: you are exactly where you need to be.",
  "Enchantment is not magic—it is love given attention.",
]

export function getDailyFortune(): string {
  // Use the current date to ensure the same fortune throughout the day
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const index = dayOfYear % fortunes.length
  return fortunes[index]
}

export function getRandomFortune(): string {
  return fortunes[Math.floor(Math.random() * fortunes.length)]
}

export function getAllFortunes(): string[] {
  return fortunes
}
