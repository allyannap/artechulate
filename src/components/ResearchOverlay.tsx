import { useEffect, useRef, useState } from 'react'
import type { Audience, Topic } from '../types'
import { AUDIENCE_LABELS, CATEGORY_LABELS } from '../types'
import { useCountdown } from '../hooks/useCountdown'
import { useTones } from '../hooks/useTones'
import { formatTime } from '../utils/format'
import CircularTimer from './CircularTimer'
import ModalShell from './ModalShell'

const RESEARCH_DURATION = 10 * 60 // 10:00

interface ResearchOverlayProps {
  topic: Topic
  audience: Audience
  onDone: () => void
  onDismiss: () => void
}

export default function ResearchOverlay({
  topic,
  audience,
  onDone,
  onDismiss,
}: ResearchOverlayProps) {
  const { playTimerEnd, primeAudio } = useTones()
  const [justFinished, setJustFinished] = useState(false)
  const endedRef = useRef(false)
  const playTimerEndRef = useRef(playTimerEnd)
  playTimerEndRef.current = playTimerEnd

  const finishWithEndSound = (next: () => void) => {
    if (endedRef.current) {
      next()
      return
    }
    endedRef.current = true
    playTimerEndRef.current()
    next()
  }

  const { secondsLeft, isRunning, isPaused, pausesLeft, progress, start, pause, resume, skip } =
    useCountdown({
      durationSeconds: RESEARCH_DURATION,
      maxPauses: 1,
      onComplete: () => {
        if (endedRef.current) return
        endedRef.current = true
        playTimerEndRef.current()
        setJustFinished(true)
        window.setTimeout(onDone, 900)
      },
    })

  useEffect(() => {
    // Start chime already played on the Start Research click; just keep audio unlocked + run clock
    primeAudio()
    start()
  }, [start, primeAudio])

  const handleSkip = () => {
    skip()
    finishWithEndSound(onDone)
  }

  const handleDismiss = () => {
    skip()
    onDismiss()
  }

  return (
    <ModalShell
      onDismiss={handleDismiss}
      size="large"
      cardClassName={`text-center ${justFinished ? 'animate-pulse-warm' : ''}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-taupe">
        {CATEGORY_LABELS[topic.category]} <span className="text-soft-taupe/40">·</span> Explaining to a{' '}
        {AUDIENCE_LABELS[audience].toLowerCase()}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-semibold text-ink-brown sm:text-4xl">{topic.name}</h2>

      <div className="mt-10 flex justify-center">
        <CircularTimer
          progress={progress}
          label="Research"
          timeLabel={formatTime(secondsLeft)}
          ringColorClass="stroke-mist-blue"
          textColorClass="text-ink-brown"
          size={280}
        />
      </div>

      <div className="mx-auto mt-8 max-w-lg rounded-lg bg-pale-lilac/50 px-5 py-4 text-base font-medium text-ink-brown">
        No AI tools. Research on the web!
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={isPaused ? resume : pause}
          disabled={(!isRunning && !isPaused) || (!isPaused && pausesLeft <= 0)}
          className="rounded-full border border-soft-taupe/50 bg-paper-ivory px-6 py-3 text-sm font-medium text-ink-brown transition hover:bg-warm-sand disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink-brown shadow-card transition hover:brightness-105"
        >
          Done researching
        </button>
      </div>
      {pausesLeft <= 0 && !isPaused && (
        <p className="mt-4 text-xs text-soft-taupe">You've used your one pause.</p>
      )}
      <p className="mt-6 text-xs text-soft-taupe">Click outside or press Esc to close</p>
    </ModalShell>
  )
}
