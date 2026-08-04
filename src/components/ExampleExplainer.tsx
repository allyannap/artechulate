import { useState } from 'react'
import type { Audience, Category } from '../types'
import { CATEGORY_SELECTED_STYLES } from './CategoryBubbles'
import AudienceBubbles from './AudienceBubbles'

interface TopicOption {
  key: string
  name: string
  category: Category
}

const TOPIC_OPTIONS: TopicOption[] = [
  { key: 'binary-search', name: 'Binary Search', category: 'system-design' },
  { key: 'machine-learning', name: 'Machine Learning', category: 'ml-ai' },
]

const EXAMPLES: Record<string, Record<Audience, string>> = {
  'binary-search': {
    recruiter:
      'Binary search is an efficient algorithm that finds a value in sorted data. Instead of scanning every item, it halves the search space each step — turning a 1-million-item lookup into about 20 comparisons. It demonstrates a strong grasp of algorithmic complexity and CS fundamentals...',
    'non-tech-friend':
      "You know how you find a name in a phone book? You don't start at page one — you flip to the middle, realize you're close, then guess again. Binary search is that instinct: smart halving that finds anything in seconds, no matter how big the list...",
    'product-manager':
      "Binary search is how our app returns instant results even across huge datasets. Without it, lookups would be 50,000× slower at scale. It's why search feels instant rather than laggy — a core performance building block...",
  },
  'machine-learning': {
    recruiter:
      "Machine learning is a subset of AI where systems learn patterns from data to make predictions or decisions, rather than following explicit rules. I've worked with supervised learning models for classification and regression tasks using scikit-learn and PyTorch...",
    'non-tech-friend':
      "Machine learning is how Spotify knows you'll like a song before you've heard it, or how Gmail catches spam. Instead of programming every rule, we show the computer thousands of examples and it figures out the pattern on its own. It gets smarter the more it sees...",
    'product-manager':
      'Our ML model learns from user behavior to personalize the experience — so recommendations improve over time without us manually tuning them. Think of it as a system that keeps getting better at its job the more people use it...',
  },
}

export default function ExampleExplainer() {
  const [topicKey, setTopicKey] = useState(TOPIC_OPTIONS[0].key)
  const [audience, setAudience] = useState<Audience>('recruiter')

  const topic = TOPIC_OPTIONS.find((t) => t.key === topicKey) ?? TOPIC_OPTIONS[0]
  const text = EXAMPLES[topicKey][audience]

  return (
    <div className="w-full text-left">
      <p className="font-heading text-base font-semibold text-blush-coral">Practice</p>
      <p className="mt-1 text-xs text-soft-taupe">Different topics to different audiences.</p>

      <div className="mt-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-soft-taupe">Topic</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TOPIC_OPTIONS.map((option) => {
            const isSelected = option.key === topicKey
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setTopicKey(option.key)}
                aria-pressed={isSelected}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? CATEGORY_SELECTED_STYLES[option.category]
                    : 'border-soft-taupe/40 bg-paper-ivory/60 text-soft-taupe hover:border-soft-taupe/70 hover:text-ink-brown'
                }`}
              >
                {option.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3.5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-soft-taupe">
          Explain to
        </p>
        <div className="mt-2 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-xs">
          <AudienceBubbles selected={audience} onSelect={setAudience} align="start" />
        </div>
      </div>

      <div className="relative mt-5 rounded-xl border border-soft-taupe/30 bg-paper-ivory p-4 shadow-card">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-brown">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-ink-brown" aria-hidden="true" />
          Example Speech: {topic.name}
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-brown">{text}</p>
        <div
          aria-hidden="true"
          className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-soft-taupe/30 bg-paper-ivory"
        />
      </div>
    </div>
  )
}
