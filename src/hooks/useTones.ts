import { useCallback, useRef } from 'react'

type ToneOptions = {
  frequency: number
  duration: number
  type?: OscillatorType
  gain?: number
  delay?: number
}

let sharedCtx: AudioContext | null = null

function getSharedContext(): AudioContext {
  if (!sharedCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    sharedCtx = new Ctx()
  }
  return sharedCtx
}

async function unlockAudio(): Promise<AudioContext> {
  const ctx = getSharedContext()
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      // ignore — browser may still block until a gesture
    }
  }
  // iOS / Chrome: a tiny silent buffer helps keep the context unlocked
  try {
    const buffer = ctx.createBuffer(1, 1, 22050)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    source.start(0)
  } catch {
    // ignore
  }
  return ctx
}

function scheduleTone(ctx: AudioContext, { frequency, duration, type = 'sine', gain = 0.08, delay = 0 }: ToneOptions) {
  const startAt = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, startAt)
  gainNode.gain.setValueAtTime(0.0001, startAt)
  gainNode.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0001), startAt + 0.012)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
  osc.connect(gainNode)
  gainNode.connect(ctx.destination)
  osc.start(startAt)
  osc.stop(startAt + duration + 0.03)
}

export function useTones() {
  const playTone = useCallback((options: ToneOptions) => {
    const ctx = getSharedContext()
    if (ctx.state === 'suspended') {
      void unlockAudio().then((ready) => {
        if (ready.state === 'running') scheduleTone(ready, options)
      })
      return
    }
    try {
      scheduleTone(ctx, options)
    } catch {
      // ignore playback errors
    }
  }, [])

  const playTick = useCallback(() => {
    playTone({ frequency: 1500, duration: 0.04, type: 'square', gain: 0.055 })
  }, [playTone])

  const playSettle = useCallback(() => {
    playTone({ frequency: 240, duration: 0.28, type: 'sine', gain: 0.12 })
    playTone({ frequency: 180, duration: 0.34, type: 'sine', gain: 0.08, delay: 0.04 })
  }, [playTone])

  const playWarning = useCallback(() => {
    playTone({ frequency: 700, duration: 0.14, type: 'triangle', gain: 0.1 })
    playTone({ frequency: 700, duration: 0.14, type: 'triangle', gain: 0.08, delay: 0.16 })
  }, [playTone])

  const playAlert = useCallback(() => {
    playTone({ frequency: 880, duration: 0.2, type: 'triangle', gain: 0.11 })
    playTone({ frequency: 660, duration: 0.25, type: 'triangle', gain: 0.11, delay: 0.18 })
  }, [playTone])

  const playTimerStart = useCallback(() => {
    playTone({ frequency: 523.25, duration: 0.12, type: 'sine', gain: 0.12 })
    playTone({ frequency: 659.25, duration: 0.14, type: 'sine', gain: 0.12, delay: 0.09 })
    playTone({ frequency: 783.99, duration: 0.22, type: 'sine', gain: 0.11, delay: 0.18 })
  }, [playTone])

  const playTimerEnd = useCallback(() => {
    playTone({ frequency: 783.99, duration: 0.16, type: 'triangle', gain: 0.13 })
    playTone({ frequency: 659.25, duration: 0.18, type: 'triangle', gain: 0.12, delay: 0.12 })
    playTone({ frequency: 523.25, duration: 0.3, type: 'sine', gain: 0.11, delay: 0.26 })
  }, [playTone])

  const primeAudio = useCallback(() => {
    void unlockAudio()
  }, [])

  // Stable refs so animation callbacks always hit the latest players
  const tickRef = useRef(playTick)
  const settleRef = useRef(playSettle)
  tickRef.current = playTick
  settleRef.current = playSettle

  const playTickStable = useCallback(() => tickRef.current(), [])
  const playSettleStable = useCallback(() => settleRef.current(), [])

  return {
    playTick: playTickStable,
    playSettle: playSettleStable,
    playWarning,
    playAlert,
    playTimerStart,
    playTimerEnd,
    primeAudio,
  }
}
