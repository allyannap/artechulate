interface CircularTimerProps {
  progress: number // 0 (start) -> 1 (complete)
  label: string
  timeLabel: string
  ringColorClass?: string
  trackColorClass?: string
  textColorClass?: string
  labelColorClass?: string
  size?: number
  /** Stronger ring + glow for immersive timer stage */
  emphasis?: boolean
}

const RADIUS = 90
const STROKE = 8
const STROKE_EMPHASIS = 11
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function CircularTimer({
  progress,
  label,
  timeLabel,
  ringColorClass = 'stroke-blush-coral',
  trackColorClass = 'stroke-warm-sand',
  textColorClass = 'text-ink-brown',
  labelColorClass = 'text-soft-taupe',
  size = 220,
  emphasis = false,
}: CircularTimerProps) {
  const clamped = Math.min(1, Math.max(0, progress))
  const offset = CIRCUMFERENCE * (1 - clamped)
  const stroke = emphasis ? STROKE_EMPHASIS : STROKE

  return (
    <div
      className={`relative flex items-center justify-center ${
        emphasis ? 'drop-shadow-[0_0_48px_rgba(255,246,224,0.35)]' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" className="-rotate-90">
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          strokeWidth={stroke}
          fill="none"
          className={trackColorClass}
          opacity={emphasis ? 0.45 : 1}
        />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={`${ringColorClass} transition-[stroke-dashoffset] duration-500 ease-linear`}
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <span
          className={`font-heading font-semibold tabular-nums ${textColorClass} ${
            emphasis ? 'text-6xl sm:text-7xl' : 'text-5xl'
          }`}
        >
          {timeLabel}
        </span>
        <span className={`text-xs font-medium uppercase tracking-[0.2em] ${labelColorClass}`}>
          {label}
        </span>
      </div>
    </div>
  )
}
