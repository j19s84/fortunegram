'use client'

import { useState } from 'react'
import { FortuneType } from './FortuneWheel'

interface Choice {
  id: string
  text: string
}

interface ChoiceFlowConfig {
  questions: {
    title: string
    description: string
    choices: Choice[]
  }[]
}

const CHOICE_FLOWS: Record<FortuneType, ChoiceFlowConfig> = {
  tarot: {
    questions: [
      {
        title: 'Spread Type',
        description: 'Choose your tarot spread',
        choices: [
          { id: 'past-present-future', text: 'Past, Present, Future' },
          { id: 'yes-no', text: 'Yes or No' },
          { id: 'one-card', text: 'Single Card' },
        ],
      },
      {
        title: 'Question Focus',
        description: 'What area of life interests you?',
        choices: [
          { id: 'love', text: 'Love & Relationships' },
          { id: 'career', text: 'Career & Purpose' },
          { id: 'personal', text: 'Personal Growth' },
        ],
      },
      {
        title: 'Energy',
        description: 'What energy do you bring?',
        choices: [
          { id: 'hopeful', text: 'Hopeful' },
          { id: 'curious', text: 'Curious' },
          { id: 'seeking-clarity', text: 'Seeking Clarity' },
        ],
      },
    ],
  },
  runes: {
    questions: [
      {
        title: 'Rune Cast',
        description: 'How many runes shall you cast?',
        choices: [
          { id: 'single', text: 'Single Rune' },
          { id: 'three', text: 'Three Runes' },
          { id: 'five', text: 'Five Runes' },
        ],
      },
      {
        title: 'Time Frame',
        description: 'What time period interests you?',
        choices: [
          { id: 'immediate', text: 'Immediate Future' },
          { id: 'next-moon', text: 'Next Full Moon' },
          { id: 'year', text: 'Next Year' },
        ],
      },
      {
        title: 'Challenge',
        description: 'What do you seek guidance on?',
        choices: [
          { id: 'obstacle', text: 'Overcoming an Obstacle' },
          { id: 'opportunity', text: 'Seizing Opportunity' },
          { id: 'path', text: 'Finding Your Path' },
        ],
      },
    ],
  },
  iching: {
    questions: [
      {
        title: 'Coin Toss',
        description: 'Traditional I Ching consultation',
        choices: [
          { id: 'coins', text: 'Three Coins Method' },
          { id: 'yarrow', text: 'Yarrow Stalk (49)' },
          { id: 'simple', text: 'Simple Method' },
        ],
      },
      {
        title: 'Life Area',
        description: 'Which area calls to you?',
        choices: [
          { id: 'harmony', text: 'Harmony & Balance' },
          { id: 'change', text: 'Change & Transformation' },
          { id: 'connection', text: 'Connection & Community' },
        ],
      },
      {
        title: 'Your Position',
        description: 'How do you see yourself?',
        choices: [
          { id: 'student', text: 'The Student' },
          { id: 'leader', text: 'The Leader' },
          { id: 'seeker', text: 'The Seeker' },
        ],
      },
    ],
  },
  numerology: {
    questions: [
      {
        title: 'Birth Date',
        description: 'Which number draws you?',
        choices: [
          { id: '1-3', text: '1-3' },
          { id: '4-6', text: '4-6' },
          { id: '7-9', text: '7-9' },
        ],
      },
      {
        title: 'Current Phase',
        description: 'What is your current cycle?',
        choices: [
          { id: 'beginning', text: 'Beginning' },
          { id: 'middle', text: 'Middle' },
          { id: 'transition', text: 'Transition' },
        ],
      },
      {
        title: 'Your Desire',
        description: 'What do you seek?',
        choices: [
          { id: 'success', text: 'Success & Achievement' },
          { id: 'wisdom', text: 'Wisdom & Understanding' },
          { id: 'abundance', text: 'Abundance & Flow' },
        ],
      },
    ],
  },
  aiWitch: {
    questions: [
      {
        title: 'Magical Element',
        description: 'Which element calls to you?',
        choices: [
          { id: 'fire', text: 'Fire - Passion & Action' },
          { id: 'water', text: 'Water - Intuition & Flow' },
          { id: 'earth', text: 'Earth - Grounding & Stability' },
        ],
      },
      {
        title: 'Spell Type',
        description: 'What kind of magic?',
        choices: [
          { id: 'protective', text: 'Protective Magic' },
          { id: 'manifesting', text: 'Manifesting Magic' },
          { id: 'healing', text: 'Healing Magic' },
        ],
      },
      {
        title: 'Moon Phase',
        description: 'When shall you work?',
        choices: [
          { id: 'new-moon', text: 'New Moon - New Beginnings' },
          { id: 'waxing', text: 'Waxing - Growing Power' },
          { id: 'full-moon', text: 'Full Moon - Full Power' },
        ],
      },
    ],
  },
}

interface ChoiceFlowProps {
  fortuneType: FortuneType
  onComplete: (selections: Record<string, string>) => void
}

export default function ChoiceFlow({ fortuneType, onComplete }: ChoiceFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})

  const config = CHOICE_FLOWS[fortuneType]
  const question = config.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / config.questions.length) * 100

  const handleChoice = (choiceId: string) => {
    const newSelections = {
      ...selections,
      [`question_${currentQuestion}`]: choiceId,
    }

    if (currentQuestion < config.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelections(newSelections)
    } else {
      onComplete(newSelections)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-in-up">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-neutral-700">
            Question {currentQuestion + 1} of {config.questions.length}
          </h2>
          <span className="text-xs text-neutral-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-neutral-900 mb-2">{question.title}</h3>
        <p className="text-neutral-600">{question.description}</p>
      </div>

      {/* Choices */}
      <div className="grid gap-3">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice.id)}
            className="card card-hover p-4 text-left hover:bg-neutral-50 transition-colors"
          >
            <span className="font-medium text-neutral-900">{choice.text}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1)
            }
          }}
          disabled={currentQuestion === 0}
          className="btn btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <span className="text-sm text-neutral-500">{currentQuestion + 1} / {config.questions.length}</span>
      </div>
    </div>
  )
}
