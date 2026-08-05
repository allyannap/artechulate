import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ModalShellProps {
  children: ReactNode
  onDismiss: () => void
  /** Wider/taller card for timer phases */
  size?: 'default' | 'large'
  dimClassName?: string
  cardClassName?: string
}

export default function ModalShell({
  children,
  onDismiss,
  size = 'default',
  dimClassName = 'bg-ink-brown/60',
  cardClassName = '',
}: ModalShellProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onDismiss])

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center ${dimClassName} px-4 py-6 backdrop-blur-sm sm:px-8`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onDismiss()
      }}
    >
      <motion.div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onMouseDown={(event) => event.stopPropagation()}
        className={`relative w-full overflow-y-auto rounded-xl border border-soft-taupe/30 bg-paper-ivory shadow-card ${
          size === 'large'
            ? 'max-h-[92vh] max-w-3xl p-8 sm:p-12'
            : 'max-h-[90vh] max-w-md p-8'
        } ${cardClassName}`}
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-soft-taupe transition hover:bg-warm-sand hover:text-ink-brown"
        >
          ×
        </button>
        {children}
      </motion.div>
    </div>
  )
}
