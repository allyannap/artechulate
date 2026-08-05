import { useEffect, useRef, useState } from 'react'
import type { Audience, Topic } from '../types'
import { AUDIENCE_LABELS, CATEGORY_LABELS } from '../types'
import { useCountdown } from '../hooks/useCountdown'
import { useSpeechRecorder } from '../hooks/useSpeechRecorder'
import { useTones } from '../hooks/useTones'
import { formatTime } from '../utils/format'
import CircularTimer from './CircularTimer'
import ModalShell from './ModalShell'

const SPEECH_DURATION = 60

interface SpeechOverlayProps {
  topic: Topic
  audience: Audience
  onDone: (recordingUrl: string | null) => void
  onDismiss: () => void
}

export default function SpeechOverlay({ topic, audience, onDone, onDismiss }: SpeechOverlayProps) {
  const { playWarning, playTimerStart, playTimerEnd, primeAudio } = useTones()
  const { status, error, startRecording, stopRecording } = useSpeechRecorder()
  const [hasStarted, setHasStarted] = useState(false)
  const warnedRef = useRef(false)
  const endedRef = useRef(false)
  const playTimerEndRef = useRef(playTimerEnd)
  const onDoneRef = useRef(onDone)
  playTimerEndRef.current = playTimerEnd
  onDoneRef.current = onDone

  const finish = async (playEndSound: boolean) => {
    if (endedRef.current) return
    endedRef.current = true
    if (playEndSound) playTimerEndRef.current()

    const blob = await stopRecording()
    const url = blob ? URL.createObjectURL(blob) : null
    onDoneRef.current(url)
  }

  const { secondsLeft, isRunning, progress, start, skip } = useCountdown({
    durationSeconds: SPEECH_DURATION,
    maxPauses: 0,
    onComplete: () => {
      void (async () => {
        if (endedRef.current) return
        endedRef.current = true
        playTimerEndRef.current()
        const blob = await stopRecording()
        const url = blob ? URL.createObjectURL(blob) : null
        window.setTimeout(() => onDoneRef.current(url), 700)
      })()
    },
  })

  useEffect(() => {
    if (hasStarted && secondsLeft === 10 && !warnedRef.current) {
      warnedRef.current = true
      playWarning()
    }
  }, [hasStarted, secondsLeft, playWarning])

  const isUrgent = hasStarted && secondsLeft <= 10

  const handleStart = async () => {
    primeAudio()
    playTimerStart()
    await startRecording()
    setHasStarted(true)
    start()
  }

  const handleEnd = () => {
    skip()
    void finish(true)
  }

  const handleDismiss = () => {
    skip()
    void stopRecording()
    onDismiss()
  }

  return (
    <ModalShell
      onDismiss={handleDismiss}
      size="large"
      dimClassName="bg-ink-brown/70"
      cardClassName="text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-soft-taupe">
        {CATEGORY_LABELS[topic.category]} <span className="text-soft-taupe/40">·</span> Explaining to a{' '}
        {AUDIENCE_LABELS[audience].toLowerCase()}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-semibold text-ink-brown sm:text-4xl">{topic.name}</h2>

      <div className="mt-10 flex justify-center">
        <CircularTimer
          progress={hasStarted ? progress : 0}
          label={hasStarted ? (status === 'recording' ? 'Recording' : 'Speak') : 'Ready'}
          timeLabel={formatTime(secondsLeft)}
          ringColorClass={isUrgent ? 'stroke-scarlet' : 'stroke-apricot-glow'}
          textColorClass={isUrgent ? 'text-scarlet' : 'text-ink-brown'}
          size={280}
        />
      </div>

      {error && <p className="mx-auto mt-4 max-w-md text-xs text-soft-taupe">{error}</p>}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {!hasStarted ? (
          <button
            type="button"
            onClick={() => void handleStart()}
            className="rounded-full bg-scarlet px-8 py-3.5 text-sm font-semibold text-paper-ivory shadow-card transition hover:brightness-105"
          >
            Start Speaking
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEnd}
            disabled={!isRunning}
            className="rounded-full border border-soft-taupe/50 bg-paper-ivory px-6 py-3 text-sm font-medium text-ink-brown transition hover:bg-warm-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            End
          </button>
        )}
      </div>
      <p className="mt-6 text-xs text-soft-taupe">Click outside or press Esc to close</p>
    </ModalShell>
  )
}
