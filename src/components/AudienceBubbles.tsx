import type { Audience } from '../types'
import { AUDIENCE_LABELS } from '../types'

const AUDIENCES: Audience[] = ['recruiter', 'non-tech-friend', 'product-manager']

interface AudienceBubblesProps {
  selected: Audience
  onSelect: (audience: Audience) => void
  align?: 'center' | 'start'
}

export default function AudienceBubbles({ selected, onSelect, align = 'center' }: AudienceBubblesProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-start'}`}
    >
      {AUDIENCES.map((audience) => {
        const isSelected = selected === audience
        return (
          <button
            key={audience}
            type="button"
            onClick={() => onSelect(audience)}
            aria-pressed={isSelected}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
              isSelected
                ? 'border-marigold bg-marigold text-ink-brown shadow-card'
                : 'border-soft-taupe/40 bg-paper-ivory/60 text-soft-taupe hover:border-soft-taupe/70 hover:text-ink-brown'
            }`}
          >
            {AUDIENCE_LABELS[audience]}
          </button>
        )
      })}
    </div>
  )
}
