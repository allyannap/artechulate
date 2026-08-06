import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ModalShellProps {
  children: ReactNode
  onDismiss: () => void
  /** Wider/taller card for timer phases */
  size?: 'default' | 'large'
  /** card = ivory popup; stage = blurred full-bleed focus (timers) */
  variant?: 'card' | 'stage'
  dimClassName?: string
  cardClassName?: string
}

export default function ModalShell({
  children,
  onDismiss,
  size = 'default',
  variant = 'card',
  dimClassName,
  cardClassName = '',
}: ModalShellProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isStage = variant === 'stage'

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onDismiss])

  const backdropClass = dimClassName
    ?? (isStage
      ? 'bg-ink-brown/35 backdrop-blur-2xl'
      : 'bg-ink-brown/60 backdrop-blur-sm')

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center px-4 py-6 sm:px-8 ${backdropClass}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onDismiss()
      }}
    >
      {isStage && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(246,241,232,0.22)_0%,transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(239,174,156,0.32)_0%,transparent_58%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(244,212,159,0.24)_0%,transparent_50%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_75%,rgba(216,210,234,0.18)_0%,transparent_45%)]"
          />
        </>
      )}

      <motion.div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onMouseDown={(event) => event.stopPropagation()}
        className={
          isStage
            ? `relative z-10 w-full max-h-[92vh] max-w-2xl overflow-y-auto px-2 py-4 text-center sm:px-6 ${cardClassName}`
            : `relative w-full overflow-y-auto rounded-xl border border-soft-taupe/30 bg-paper-ivory shadow-card ${
                size === 'large'
                  ? 'max-h-[92vh] max-w-3xl p-8 sm:p-12'
                  : 'max-h-[90vh] max-w-md p-8'
              } ${cardClassName}`
        }
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className={
            isStage
              ? 'absolute right-2 top-0 flex h-9 w-9 items-center justify-center rounded-full text-paper-ivory/70 transition hover:bg-paper-ivory/10 hover:text-paper-ivory sm:right-0'
              : 'absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-soft-taupe transition hover:bg-warm-sand hover:text-ink-brown'
          }
        >
          ×
        </button>
        {children}
      </motion.div>
    </div>
  )
}
