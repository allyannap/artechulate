import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue, useTransform, useVelocity } from 'framer-motion'
import type { Topic } from '../types'
import { useTones } from '../hooks/useTones'

const ITEM_HEIGHT = 68
const VISIBLE_HEIGHT = ITEM_HEIGHT * 3
const REEL_LENGTH = 32
const CENTER_Y = (VISIBLE_HEIGHT - ITEM_HEIGHT) / 2

interface SlotMachineProps {
  pool: Topic[]
  spinToken: number
  onLanded: (topic: Topic) => void
  onSpinStart?: () => void
}

function buildReel(pool: Topic[]): Topic[] {
  const items: Topic[] = []
  for (let i = 0; i < REEL_LENGTH - 1; i++) {
    items.push(pool[Math.floor(Math.random() * pool.length)])
  }
  items.push(pool[Math.floor(Math.random() * pool.length)])
  return items
}

export default function SlotMachine({ pool, spinToken, onLanded, onSpinStart }: SlotMachineProps) {
  const { playTick, playSettle } = useTones()
  const [reel, setReel] = useState<Topic[]>(() => [
    { id: 'placeholder', name: 'Spin to begin', category: pool[0]?.category ?? 'system-design' },
  ])
  const y = useMotionValue(CENTER_Y)
  const velocity = useVelocity(y)
  const blur = useTransform(velocity, [-7000, 0, 7000], [9, 0, 9], { clamp: true })
  const filter = useMotionTemplate`blur(${blur}px)`
  const lastIndexRef = useRef(0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!pool.length) return

    const nextReel = buildReel(pool)
    const targetIndex = nextReel.length - 1
    const finalY = CENTER_Y - targetIndex * ITEM_HEIGHT

    setReel(nextReel)
    onSpinStart?.()
    lastIndexRef.current = 0
    y.set(CENTER_Y)

    const unsubscribe = y.on('change', (latest) => {
      const idx = Math.round((CENTER_Y - latest) / ITEM_HEIGHT)
      if (idx !== lastIndexRef.current && idx > 0) {
        lastIndexRef.current = idx
        playTick()
      }
    })

    const controls = animate(y, finalY, {
      duration: 2.8,
      ease: [0.11, 0.83, 0.24, 1],
      onComplete: () => {
        unsubscribe()
        playSettle()
        onLanded(nextReel[targetIndex])
      },
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken])

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-lg border border-soft-taupe/30 bg-paper-ivory shadow-card"
      style={{ height: VISIBLE_HEIGHT, maxWidth: 440 }}
    >
      <motion.div style={{ y, filter }} className="absolute inset-x-0 top-0">
        {reel.map((topic, i) => (
          <div
            key={`${topic.id}-${i}`}
            className="flex items-center justify-center px-6 text-center"
            style={{ height: ITEM_HEIGHT }}
          >
            <span className="font-heading text-xl font-semibold leading-snug text-ink-brown">{topic.name}</span>
          </div>
        ))}
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 border-y border-blush-coral/60 bg-blush-coral/10"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-paper-ivory to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-paper-ivory to-transparent" />
    </div>
  )
}
