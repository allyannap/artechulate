import { useCallback, useEffect, useRef, useState } from 'react'

interface UseCountdownOptions {
  durationSeconds: number
  maxPauses?: number
  onComplete?: () => void
}

interface UseCountdownResult {
  secondsLeft: number
  isRunning: boolean
  isPaused: boolean
  pausesLeft: number
  progress: number
  start: () => void
  pause: () => void
  resume: () => void
  skip: () => void
}

export function useCountdown({
  durationSeconds,
  maxPauses = 0,
  onComplete,
}: UseCountdownOptions): UseCountdownResult {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [pausesLeft, setPausesLeft] = useState(maxPauses)
  const intervalRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setIsPaused(false)
    clearTimer()
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          setIsRunning(false)
          onCompleteRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer, isRunning])

  const pause = useCallback(() => {
    if (!isRunning || isPaused || pausesLeft <= 0) return
    clearTimer()
    setIsRunning(false)
    setIsPaused(true)
    setPausesLeft((p) => p - 1)
  }, [clearTimer, isRunning, isPaused, pausesLeft])

  const resume = useCallback(() => {
    if (!isPaused) return
    setIsPaused(false)
    start()
  }, [isPaused, start])

  // Manual early-exit: stops the clock silently and leaves it to the caller
  // to decide what happens next (no onComplete callback, no alert tone).
  const skip = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setIsPaused(false)
    setSecondsLeft(0)
  }, [clearTimer])

  const progress = durationSeconds > 0 ? 1 - secondsLeft / durationSeconds : 0

  return { secondsLeft, isRunning, isPaused, pausesLeft, progress, start, pause, resume, skip }
}
