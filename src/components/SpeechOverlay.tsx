import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Audience, Topic } from '../types'
import { AUDIENCE_LABELS, CATEGORY_LABELS } from '../types'
import { useCountdown } from '../hooks/useCountdown'
import { useTones } from '../hooks/useTones'
import { formatTime } from '../utils/format'
import CircularTimer from './CircularTimer'

const SPEECH_DURATION = 60

interface SpeechOverlayProps {
  topic: Topic
  audience: Audience
  onDone: () => void
}

export default function SpeechOverlay({ topic, audience, onDone }: SpeechOverlayProps) {
  const { playWarning, playAlert, primeAudio } = useTones()
  const [hasStarted, setHasStarted] = useState(false)
  const warnedRef = useRef(false)

  const { secondsLeft, isRunning, progress, start, skip } = useCountdown({
    durationSeconds: SPEECH_DURATION,
    maxPauses: 0,
    onComplete: () => {
      playAlert()
      window.setTimeout(onDone, 700)
    },
  })

  useEffect(() => {
    if (hasStarted && secondsLeft === 10 && !warnedRef.current) {
      warnedRef.current = true
      playWarning()
    }
  }, [hasStarted, secondsLeft, playWarning])

  const isUrgent = hasStarted && secondsLeft <= 10

  const handleStart = () => {
    primeAudio()
    setHasStarted(true)
    start()
  }

  const handleStop = () => {
    skip()
    onDone()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-brown/70 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md rounded-xl border border-soft-taupe/30 bg-paper-ivory p-8 text-center shadow-card"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-taupe">
          {CATEGORY_LABELS[topic.category]} <span className="text-soft-taupe/40">·</span> Explaining to a{' '}
          {AUDIENCE_LABELS[audience].toLowerCase()}
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-ink-brown">{topic.name}</h2>

        <div className="mt-6 flex justify-center">
          <CircularTimer
            progress={hasStarted ? progress : 0}
            label={hasStarted ? 'Speak' : 'Ready'}
            timeLabel={formatTime(secondsLeft)}
            ringColorClass={isUrgent ? 'stroke-scarlet' : 'stroke-apricot-glow'}
            textColorClass={isUrgent ? 'text-scarlet' : 'text-ink-brown'}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!hasStarted ? (
            <button
              type="button"
              onClick={handleStart}
              className="rounded-full bg-scarlet px-7 py-3 text-sm font-semibold text-paper-ivory shadow-card transition hover:brightness-105"
            >
              Start Speaking
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              disabled={!isRunning}
              className="rounded-full border border-soft-taupe/50 bg-paper-ivory px-5 py-2.5 text-sm font-medium text-ink-brown transition hover:bg-warm-sand disabled:cursor-not-allowed disabled:opacity-40"
            >
              Stop
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
