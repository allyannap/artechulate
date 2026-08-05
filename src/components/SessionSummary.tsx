import { useEffect, useRef, useState } from 'react'
import type { Audience, Topic } from '../types'
import { AUDIENCE_LABELS, CATEGORY_LABELS } from '../types'
import ModalShell from './ModalShell'

const RATING_COLORS = ['#C15B42', '#D98544', '#E8B23D', '#B9C97A', '#BFD6A4']

interface SessionSummaryProps {
  topic: Topic
  audience: Audience
  recordingUrl: string | null
  onSave: (selfRating: number, notes: string) => void
  onTryAnother: () => void
  onDismiss: () => void
}

export default function SessionSummary({
  topic,
  audience,
  recordingUrl,
  onSave,
  onTryAnother,
  onDismiss,
}: SessionSummaryProps) {
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleSave = () => {
    if (rating === 0) return
    onSave(rating, notes)
    setSaved(true)
  }

  const handleReplay = async () => {
    if (!recordingUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio(recordingUrl)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onpause = () => {
        if (audioRef.current?.ended) return
        setIsPlaying(false)
      }
    }

    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      audio.currentTime = 0
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <ModalShell onDismiss={onDismiss} size="large">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-taupe">
        {CATEGORY_LABELS[topic.category]} <span className="text-soft-taupe/40">·</span> Explaining to a{' '}
        {AUDIENCE_LABELS[audience].toLowerCase()}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-semibold text-ink-brown sm:text-4xl">{topic.name}</h2>

      {/* Replay — above reflection */}
      <div className="mt-6 rounded-xl border border-soft-taupe/25 bg-warm-sand/35 px-4 py-4">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-brown">Your 1-min speech</p>
            <p className="mt-0.5 text-xs text-soft-taupe">
              {recordingUrl
                ? 'Replay what you just said before you rate it.'
                : 'No recording this round — mic access may have been blocked.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleReplay()}
            disabled={!recordingUrl}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-brown px-5 py-2.5 text-sm font-semibold text-paper-ivory transition hover:bg-ink-brown/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>{isPlaying ? '❚❚' : '▶'}</span>
            {isPlaying ? 'Pause' : 'Replay speech'}
          </button>
        </div>
        {recordingUrl && (
          <audio className="sr-only" src={recordingUrl} preload="metadata" controls={false} />
        )}
      </div>

      <p className="mt-6 text-base text-soft-taupe">How&apos;d that feel?</p>

      <div className="mt-4 flex justify-center gap-2">
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
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition ${
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
        rows={4}
        className="mt-6 w-full resize-none rounded-lg border border-soft-taupe/30 bg-warm-sand/30 p-4 text-sm text-ink-brown placeholder:text-soft-taupe/70 focus:border-blush-coral focus:outline-none"
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
      <p className="mt-5 text-center text-xs text-soft-taupe">Click outside or press Esc to close</p>
    </ModalShell>
  )
}
