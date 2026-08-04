import type { Category } from '../types'
import { CATEGORY_LABELS } from '../types'

const CATEGORIES: Category[] = ['system-design', 'ml-ai', 'data-analysis']

export const CATEGORY_SELECTED_STYLES: Record<Category, string> = {
  'system-design': 'border-mist-blue bg-mist-blue text-ink-brown shadow-card',
  'ml-ai': 'border-pale-lilac bg-pale-lilac text-ink-brown shadow-card',
  'data-analysis': 'border-sage-green bg-sage-green text-ink-brown shadow-card',
}

interface CategoryBubblesProps {
  selected: Category[]
  onToggle: (category: Category) => void
}

export default function CategoryBubbles({ selected, onToggle }: CategoryBubblesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {CATEGORIES.map((category) => {
        const isSelected = selected.includes(category)
        return (
          <button
            key={category}
            type="button"
            onClick={() => onToggle(category)}
            aria-pressed={isSelected}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
              isSelected
                ? CATEGORY_SELECTED_STYLES[category]
                : 'border-soft-taupe/40 bg-paper-ivory/60 text-soft-taupe hover:border-soft-taupe/70 hover:text-ink-brown'
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        )
      })}
    </div>
  )
}
