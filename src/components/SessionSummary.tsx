import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Audience, Topic } from '../types'
import { AUDIENCE_LABELS, CATEGORY_LABELS } from '../types'

const RATING_COLORS = ['#C15B42', '#D98544', '#E8B23D', '#B9C97A', '#BFD6A4']

interface SessionSummaryProps {
  topic: Topic
  audience: Audience
  onSave: (selfRating: number, notes: string) => void
  onTryAnother: () => void
}

export default function SessionSummary({ topic, audience, onSave, onTryAnother }: SessionSummaryProps) {
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (rating === 0) return
    onSave(rating, notes)
    setSaved(true)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-brown/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md rounded-xl border border-soft-taupe/30 bg-paper-ivory p-8 shadow-card"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-taupe">
          {CATEGORY_LABELS[topic.category]} <span className="text-soft-taupe/40">·</span> Explaining to a{' '}
          {AUDIENCE_LABELS[audience].toLowerCase()}
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-ink-brown">{topic.name}</h2>
        <p className="mt-1 text-sm text-soft-taupe">How'd that feel?</p>

        <div className="mt-5 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => {
            const color = RATING_COLORS[value - 1]
            const isFilled = rating >= value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-pressed={rating === value}
                style={
                  isFilled
                    ? { borderColor: color, backgroundColor: color }
                    : { borderColor: `${color}80`, color }
                }
                className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  isFilled ? 'text-ink-brown' : 'bg-paper-ivory hover:opacity-80'
                }`}
              >
                {value}
              </button>
            )
          })}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional reflection notes — what worked, what felt shaky?"
          rows={3}
          className="mt-5 w-full resize-none rounded-lg border border-soft-taupe/30 bg-warm-sand/30 p-3 text-sm text-ink-brown placeholder:text-soft-taupe/70 focus:border-blush-coral focus:outline-none"
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            disabled={rating === 0}
            className="flex-1 rounded-full bg-blush-coral px-5 py-3 text-sm font-semibold text-ink-brown shadow-card transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saved ? 'Saved ✓' : 'Save to History'}
          </button>
          <button
            type="button"
            onClick={onTryAnother}
            className="flex-1 rounded-full border border-ink-brown/80 bg-paper-ivory px-5 py-3 text-sm font-semibold text-ink-brown transition hover:bg-ink-brown hover:text-paper-ivory"
          >
            Try Another Topic
          </button>
        </div>
      </motion.div>
    </div>
  )
}
