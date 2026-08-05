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

  // Clear on unmount only. Do not gate start() on React state — Strict Mode
  // clears the interval between effect runs while leaving isRunning=true.
  useEffect(() => clearTimer, [clearTimer])

  const start = useCallback(() => {
    if (intervalRef.current !== null) return
    setIsRunning(true)
    setIsPaused(false)
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
  }, [clearTimer])

  const pause = useCallback(() => {
    if (intervalRef.current === null || pausesLeft <= 0) return
    clearTimer()
    setIsRunning(false)
    setIsPaused(true)
    setPausesLeft((p) => p - 1)
  }, [clearTimer, pausesLeft])

  const resume = useCallback(() => {
    if (!isPaused) return
    start()
  }, [isPaused, start])

  const skip = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setIsPaused(false)
    setSecondsLeft(0)
  }, [clearTimer])

  const progress = durationSeconds > 0 ? 1 - secondsLeft / durationSeconds : 0

  return { secondsLeft, isRunning, isPaused, pausesLeft, progress, start, pause, resume, skip }
}
