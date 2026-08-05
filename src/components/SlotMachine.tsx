import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion'
import type { Category, Topic } from '../types'
import { CATEGORY_LABELS } from '../types'
import { useTones } from '../hooks/useTones'

const ITEM_HEIGHT = 68
const VISIBLE_ROWS = 3
const VISIBLE_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS
const CENTER_ROW = 1
const SPIN_LOOPS = 10
const TRAILING_ROWS = 4

interface SlotMachineProps {
  pool: Topic[]
  spinToken: number
  onLanded: (topic: Topic) => void
  onSpinStart?: () => void
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function buildSubjectReel(pool: Topic[], winner: Topic): Topic[] {
  const reel: Topic[] = []
  for (let i = 0; i < SPIN_LOOPS; i++) {
    reel.push(pickRandom(pool))
  }
  reel.push(winner)
  for (let i = 0; i < TRAILING_ROWS; i++) {
    let next = pickRandom(pool)
    if (next.id === winner.id && pool.length > 1) {
      next = pool.find((t) => t.id !== winner.id) ?? next
    }
    reel.push(next)
  }
  return reel
}

function buildCategoryReel(pool: Topic[], winner: Topic, length: number): Category[] {
  const categories = Array.from(new Set(pool.map((t) => t.category)))
  const reel: Category[] = Array.from({ length }, () => pickRandom(categories))
  const winnerIndex = length - 1 - TRAILING_ROWS
  reel[winnerIndex] = winner.category
  return reel
}

function yForIndex(index: number) {
  return CENTER_ROW * ITEM_HEIGHT - index * ITEM_HEIGHT
}

export default function SlotMachine({ pool, spinToken, onLanded, onSpinStart }: SlotMachineProps) {
  const { playTick, playSettle, primeAudio } = useTones()
  const playTickRef = useRef(playTick)
  const playSettleRef = useRef(playSettle)
  playTickRef.current = playTick
  playSettleRef.current = playSettle
  const [subjectReel, setSubjectReel] = useState<Topic[]>(() => [
    { id: 'ph-0', name: 'Pick categories', category: 'system-design' },
    { id: 'ph-1', name: 'Spin to begin', category: 'ml-ai' },
    { id: 'ph-2', name: 'Land a subject', category: 'data-analysis' },
  ])
  const [categoryReel, setCategoryReel] = useState<Category[]>([
    'system-design',
    'ml-ai',
    'data-analysis',
  ])
  const [centerIndex, setCenterIndex] = useState(CENTER_ROW)

  const subjectY = useMotionValue(yForIndex(CENTER_ROW))
  const categoryY = useMotionValue(yForIndex(CENTER_ROW))
  const subjectVelocity = useVelocity(subjectY)
  const subjectBlur = useTransform(subjectVelocity, [-7000, 0, 7000], [8, 0, 8], { clamp: true })
  const subjectFilter = useMotionTemplate`blur(${subjectBlur}px)`
  const categoryVelocity = useVelocity(categoryY)
  const categoryBlur = useTransform(categoryVelocity, [-7000, 0, 7000], [6, 0, 6], { clamp: true })
  const categoryFilter = useMotionTemplate`blur(${categoryBlur}px)`

  const lastIndexRef = useRef(CENTER_ROW)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!pool.length) return

    const winner = pickRandom(pool)
    const subjects = buildSubjectReel(pool, winner)
    const winnerIndex = subjects.length - 1 - TRAILING_ROWS
    const categories = buildCategoryReel(pool, winner, subjects.length)

    setSubjectReel(subjects)
    setCategoryReel(categories)
    primeAudio()
    onSpinStart?.()
    lastIndexRef.current = 0
    setCenterIndex(0)

    subjectY.set(yForIndex(0))
    categoryY.set(yForIndex(0))
    // Kickoff click so the spin always has an audible start
    playTickRef.current()

    const unsubscribe = subjectY.on('change', (latest) => {
      const idx = Math.round((CENTER_ROW * ITEM_HEIGHT - latest) / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(subjects.length - 1, idx))
      setCenterIndex(clamped)
      if (clamped !== lastIndexRef.current) {
        lastIndexRef.current = clamped
        playTickRef.current()
      }
    })

    const subjectAnim = animate(subjectY, yForIndex(winnerIndex), {
      duration: 2.9,
      ease: [0.11, 0.83, 0.24, 1],
    })

    const categoryAnim = animate(categoryY, yForIndex(winnerIndex), {
      duration: 2.55,
      ease: [0.14, 0.78, 0.22, 1],
      onComplete: () => {
        unsubscribe()
        setCenterIndex(winnerIndex)
        playSettleRef.current()
        onLanded(winner)
      },
    })

    return () => {
      subjectAnim.stop()
      categoryAnim.stop()
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken])

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-lg border border-soft-taupe/30 bg-paper-ivory shadow-card"
      style={{ height: VISIBLE_HEIGHT, maxWidth: 480 }}
    >
      <div className="absolute inset-0 flex">
        <ReelStrip
          y={categoryY}
          filter={categoryFilter}
          widthClass="w-[38%] min-w-[120px] border-r border-soft-taupe/15"
        >
          {categoryReel.map((cat, i) => (
            <ReelRow key={`cat-${cat}-${i}`} isCenter={i === centerIndex} align="right">
              <span
                className={`font-heading font-semibold uppercase tracking-[0.12em] transition-[color,font-size] duration-150 ${
                  i === centerIndex
                    ? 'text-[11px] text-black sm:text-xs'
                    : 'text-[9px] text-soft-taupe/50 sm:text-[10px]'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </span>
            </ReelRow>
          ))}
        </ReelStrip>

        <ReelStrip y={subjectY} filter={subjectFilter} widthClass="flex-1">
          {subjectReel.map((topic, i) => (
            <ReelRow key={`${topic.id}-${i}`} isCenter={i === centerIndex} align="left">
              <span
                className={`font-heading font-semibold leading-snug transition-[color,font-size] duration-150 ${
                  i === centerIndex
                    ? 'text-lg text-black sm:text-xl'
                    : 'text-sm text-soft-taupe/50 sm:text-base'
                }`}
              >
                {topic.name}
              </span>
            </ReelRow>
          ))}
        </ReelStrip>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 border-y border-blush-coral/60 bg-blush-coral/10"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-paper-ivory to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-paper-ivory to-transparent" />
    </div>
  )
}

function ReelStrip({
  y,
  filter,
  widthClass,
  children,
}: {
  y: MotionValue<number>
  filter: MotionValue<string>
  widthClass: string
  children: ReactNode
}) {
  return (
    <div className={`relative overflow-hidden ${widthClass}`} style={{ height: VISIBLE_HEIGHT }}>
      <motion.div style={{ y, filter }} className="absolute inset-x-0 top-0">
        {children}
      </motion.div>
    </div>
  )
}

function ReelRow({
  children,
  align,
}: {
  children: ReactNode
  isCenter: boolean
  align: 'left' | 'right'
}) {
  return (
    <div
      className={`flex items-center px-3 sm:px-4 ${align === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
      style={{ height: ITEM_HEIGHT }}
    >
      {children}
    </div>
  )
}
