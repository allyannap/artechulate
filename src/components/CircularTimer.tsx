interface CircularTimerProps {
  progress: number // 0 (start) -> 1 (complete)
  label: string
  timeLabel: string
  ringColorClass?: string
  trackColorClass?: string
  textColorClass?: string
  size?: number
}

const RADIUS = 90
const STROKE = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function CircularTimer({
  progress,
  label,
  timeLabel,
  ringColorClass = 'stroke-blush-coral',
  trackColorClass = 'stroke-warm-sand',
  textColorClass = 'text-ink-brown',
  size = 220,
}: CircularTimerProps) {
  const clamped = Math.min(1, Math.max(0, progress))
  const offset = CIRCUMFERENCE * (1 - clamped)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={RADIUS} strokeWidth={STROKE} fill="none" className={trackColorClass} />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={`${ringColorClass} transition-[stroke-dashoffset] duration-500 ease-linear`}
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <span className={`font-heading text-5xl font-semibold tabular-nums ${textColorClass}`}>{timeLabel}</span>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-soft-taupe">{label}</span>
      </div>
    </div>
  )
}
