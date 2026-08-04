import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Audience, Topic } from '../types'
import { AUDIENCE_LABELS, CATEGORY_LABELS } from '../types'
import { useCountdown } from '../hooks/useCountdown'
import { useTones } from '../hooks/useTones'
import { formatTime } from '../utils/format'
import CircularTimer from './CircularTimer'

const RESEARCH_DURATION = 10 * 60 // 10:00

interface ResearchOverlayProps {
  topic: Topic
  audience: Audience
  onDone: () => void
}

export default function ResearchOverlay({ topic, audience, onDone }: ResearchOverlayProps) {
  const { playAlert } = useTones()
  const [justFinished, setJustFinished] = useState(false)
  const startedRef = useRef(false)

  const { secondsLeft, isPaused, pausesLeft, progress, start, pause, resume, skip } = useCountdown({
    durationSeconds: RESEARCH_DURATION,
    maxPauses: 1,
    onComplete: () => {
      playAlert()
      setJustFinished(true)
      window.setTimeout(onDone, 900)
    },
  })

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true
      start()
    }
  }, [start])

  const handleSkip = () => {
    skip()
    onDone()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-brown/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`w-full max-w-md rounded-xl border border-soft-taupe/30 bg-paper-ivory p-8 text-center shadow-card ${
          justFinished ? 'animate-pulse-warm' : ''
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-taupe">
          {CATEGORY_LABELS[topic.category]} <span className="text-soft-taupe/40">·</span> Explaining to a{' '}
          {AUDIENCE_LABELS[audience].toLowerCase()}
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-ink-brown">{topic.name}</h2>

        <div className="mt-6 flex justify-center">
          <CircularTimer
            progress={progress}
            label="Research"
            timeLabel={formatTime(secondsLeft)}
            ringColorClass="stroke-mist-blue"
            textColorClass="text-ink-brown"
          />
        </div>

        <div className="mt-6 rounded-lg bg-pale-lilac/50 px-4 py-3 text-sm font-medium text-ink-brown">
          No AI tools. Research on the web!
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={isPaused ? resume : pause}
            disabled={!isPaused && pausesLeft <= 0}
            className="rounded-full border border-soft-taupe/50 bg-paper-ivory px-5 py-2.5 text-sm font-medium text-ink-brown transition hover:bg-warm-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-full bg-marigold px-5 py-2.5 text-sm font-semibold text-ink-brown shadow-card transition hover:brightness-105"
          >
            Done researching
          </button>
        </div>
        {pausesLeft <= 0 && !isPaused && (
          <p className="mt-3 text-xs text-soft-taupe">You've used your one pause.</p>
        )}
      </motion.div>
    </div>
  )
}
