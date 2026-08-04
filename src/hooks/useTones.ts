import { useCallback } from 'react'

type ToneOptions = {
  frequency: number
  duration: number
  type?: OscillatorType
  gain?: number
  delay?: number
}

// Module-level singleton so every component sharing useTones() plays through
// the same AudioContext (and priming it on one user gesture unlocks it everywhere).
let sharedCtx: AudioContext | null = null

function getSharedContext(): AudioContext {
  if (!sharedCtx) {
    sharedCtx = new AudioContext()
  }
  if (sharedCtx.state === 'suspended') {
    void sharedCtx.resume()
  }
  return sharedCtx
}

export function useTones() {
  const getContext = useCallback(() => getSharedContext(), [])

  const playTone = useCallback(
    ({ frequency, duration, type = 'sine', gain = 0.08, delay = 0 }: ToneOptions) => {
      const ctx = getContext()
      const startAt = ctx.currentTime + delay
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(frequency, startAt)
      gainNode.gain.setValueAtTime(0, startAt)
      gainNode.gain.linearRampToValueAtTime(gain, startAt + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.start(startAt)
      osc.stop(startAt + duration + 0.02)
    },
    [getContext],
  )

  const playTick = useCallback(() => {
    playTone({ frequency: 1400, duration: 0.045, type: 'square', gain: 0.05 })
  }, [playTone])

  const playSettle = useCallback(() => {
    playTone({ frequency: 220, duration: 0.28, type: 'sine', gain: 0.1 })
    playTone({ frequency: 165, duration: 0.32, type: 'sine', gain: 0.07, delay: 0.03 })
  }, [playTone])

  const playWarning = useCallback(() => {
    playTone({ frequency: 660, duration: 0.15, type: 'triangle', gain: 0.09 })
  }, [playTone])

  const playAlert = useCallback(() => {
    playTone({ frequency: 880, duration: 0.2, type: 'triangle', gain: 0.11 })
    playTone({ frequency: 660, duration: 0.25, type: 'triangle', gain: 0.11, delay: 0.18 })
  }, [playTone])

  const primeAudio = useCallback(() => {
    getContext()
  }, [getContext])

  return { playTick, playSettle, playWarning, playAlert, primeAudio }
}
