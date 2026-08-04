import { useEffect, useMemo, useState } from 'react'
import { TOPICS } from '../data/topics'
import type { Audience, Category, Topic } from '../types'
import { useTones } from '../hooks/useTones'
import CategoryBubbles from './CategoryBubbles'
import AudienceBubbles from './AudienceBubbles'
import SlotMachine from './SlotMachine'

const MAX_SPINS = 2 // first spin + 1 free reroll

interface SpinScreenProps {
  onStartResearch: (topic: Topic, audience: Audience) => void
  resetSignal: number
}

export default function SpinScreen({ onStartResearch, resetSignal }: SpinScreenProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'system-design',
    'ml-ai',
    'data-analysis',
  ])
  const [audience, setAudience] = useState<Audience>('recruiter')
  const [spinToken, setSpinToken] = useState(0)
  const [spinsUsed, setSpinsUsed] = useState(0)
  const [landedTopic, setLandedTopic] = useState<Topic | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const { primeAudio } = useTones()

  const pool = useMemo(
    () => TOPICS.filter((topic) => selectedCategories.includes(topic.category)),
    [selectedCategories],
  )

  const handleToggleCategory = (category: Category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        if (prev.length === 1) return prev
        return prev.filter((c) => c !== category)
      }
      return [...prev, category]
    })
    setSpinsUsed(0)
    setLandedTopic(null)
  }

  useEffect(() => {
    setSpinsUsed(0)
    setLandedTopic(null)
  }, [resetSignal])

  const spinsLeft = MAX_SPINS - spinsUsed
  const canSpin = spinsLeft > 0 && !isSpinning && pool.length > 0

  const handleSpin = () => {
    if (!canSpin) return
    primeAudio()
    setIsSpinning(true)
    setSpinsUsed((n) => n + 1)
    setSpinToken((t) => t + 1)
  }

  const handleLanded = (topic: Topic) => {
    setLandedTopic(topic)
    setIsSpinning(false)
  }

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-10 sm:py-16">
      <div className="max-w-xl text-center">
        <h1 className="font-heading text-4xl font-semibold text-ink-brown sm:text-5xl">
          Spin for a <span className="text-blush-coral italic">topic</span>
        </h1>
        <p className="mt-4 text-base text-soft-taupe">
          Pick your categories, spin, research on your own, then explain it out loud like you mean it.
        </p>
      </div>

      <CategoryBubbles selected={selectedCategories} onToggle={handleToggleCategory} />

      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-taupe">Explain to</p>
        <AudienceBubbles selected={audience} onSelect={setAudience} />
      </div>

      <div className="w-full max-w-md rounded-xl border border-soft-taupe/30 bg-warm-sand/40 p-6 shadow-card sm:p-8">
        <SlotMachine pool={pool} spinToken={spinToken} onLanded={handleLanded} onSpinStart={() => {}} />

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSpin}
            disabled={!canSpin}
            className="rounded-full bg-blush-coral px-7 py-3 text-sm font-semibold text-ink-brown shadow-card transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {spinsUsed === 0 ? 'Spin' : 'Spin again'}
          </button>
          <p className="text-xs text-soft-taupe">
            {spinsLeft > 0
              ? `${spinsLeft === MAX_SPINS ? 'Free spin ready' : '1 free reroll left'}`
              : 'No rerolls left — go with it!'}
          </p>

          <button
            type="button"
            onClick={() => landedTopic && onStartResearch(landedTopic, audience)}
            disabled={!landedTopic || isSpinning}
            className="mt-2 rounded-full border border-ink-brown/80 bg-paper-ivory px-7 py-3 text-sm font-semibold text-ink-brown transition hover:border-sage-green hover:bg-sage-green disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Research →
          </button>
        </div>
      </div>
    </div>
  )
}
