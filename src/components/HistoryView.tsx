import type { Session } from '../types'
import { AUDIENCE_LABELS, CATEGORY_LABELS } from '../types'

interface HistoryViewProps {
  sessions: Session[]
}

const CATEGORY_CHIP_CLASSES: Record<Session['category'], string> = {
  'system-design': 'bg-mist-blue text-ink-brown',
  'ml-ai': 'bg-pale-lilac text-ink-brown',
  'data-analysis': 'bg-sage-green text-ink-brown',
}

const RATING_DOT_COLORS = ['#C15B42', '#D98544', '#E8B23D', '#B9C97A', '#BFD6A4']

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function HistoryView({ sessions }: HistoryViewProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10 sm:py-16">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-semibold text-ink-brown">Your practice history</h1>
        <p className="mt-2 text-sm text-soft-taupe">
          {sessions.length === 0 ? 'Nothing saved yet — go spin a topic.' : `${sessions.length} session${sessions.length === 1 ? '' : 's'} logged.`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-lg border border-soft-taupe/30 bg-paper-ivory p-5 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_CHIP_CLASSES[session.category]}`}
                >
                  {CATEGORY_LABELS[session.category]}
                </span>
                {session.audience && (
                  <span className="rounded-full bg-warm-sand/70 px-3 py-1 text-xs font-medium text-ink-brown">
                    {AUDIENCE_LABELS[session.audience]}
                  </span>
                )}
              </div>
              <span className="text-xs text-soft-taupe">{formatDate(session.date)}</span>
            </div>
            <h3 className="mt-3 font-heading text-lg font-semibold text-ink-brown">{session.topic}</h3>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className="h-2 w-6 rounded-full"
                  style={{
                    backgroundColor:
                      value <= session.selfRating ? RATING_DOT_COLORS[value - 1] : '#E8DBC8',
                  }}
                />
              ))}
            </div>
            {session.notes && <p className="mt-3 text-sm text-ink-brown/80">{session.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
