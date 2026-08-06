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
      variant="stage"
      onDismiss={handleDismiss}
      cardClassName={justFinished ? 'animate-pulse-warm' : ''}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush-coral">
        {CATEGORY_LABELS[topic.category]} <span className="text-ink-brown/40">·</span> Explaining to a{' '}
        {AUDIENCE_LABELS[audience].toLowerCase()}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-semibold text-ink-brown sm:text-4xl">
        {topic.name}
      </h2>

      <div className="mt-10 flex justify-center">
        <CircularTimer
          progress={progress}
          label="Research"
          timeLabel={formatTime(secondsLeft)}
          ringColorClass="stroke-mist-blue"
          trackColorClass="stroke-paper-ivory/35"
          textColorClass="text-[#FFF6E0]"
          labelColorClass="text-paper-ivory/90"
          size={300}
          emphasis
        />
      </div>

      <div className="mx-auto mt-8 max-w-lg rounded-lg bg-pale-lilac/90 px-5 py-4 text-base font-medium text-ink-brown shadow-[0_8px_32px_rgba(44,34,33,0.2)]">
        No AI tools. Research on the web!
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={isPaused ? resume : pause}
          disabled={(!isRunning && !isPaused) || (!isPaused && pausesLeft <= 0)}
          className="rounded-full border border-paper-ivory/45 bg-paper-ivory/10 px-6 py-3 text-sm font-medium text-paper-ivory transition hover:bg-paper-ivory/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink-brown shadow-[0_8px_28px_rgba(232,178,61,0.45)] transition hover:brightness-105"
        >
          Done researching
        </button>
      </div>
      {pausesLeft <= 0 && !isPaused && (
        <p className="mt-4 text-xs text-paper-ivory/75">You've used your one pause.</p>
      )}
      <p className="mt-6 text-xs font-medium text-paper-ivory/80">
        Click outside or press Esc to close
      </p>
    </ModalShell>
  )
}
