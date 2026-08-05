import Logo from './Logo'
import ExampleExplainer from './ExampleExplainer'

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  )
}

const STEPS = [
  {
    number: '01',
    icon: <ChatIcon />,
    accent: 'bg-pale-lilac',
    title: 'Spin for a topic',
    description: (
      <>
        Hit spin and get a topic pulled from job postings on <strong className="font-semibold text-gray-500">Indeed</strong>,{' '}
        <strong className="font-semibold text-gray-500">Handshake</strong>, and{' '}
        <strong className="font-semibold text-gray-500">LinkedIn</strong> — keywords{' '}
        <strong className="font-semibold text-[#D98A70]">ranked by relevance</strong> to the job title using{' '}
        <strong className="font-semibold text-[#D98A70]">information retrieval</strong> and{' '}
        <strong className="font-semibold text-[#D98A70]">NLP</strong>.
      </>
    ),
    tag: '75 topics, 3 categories',
  },
  {
    number: '02',
    icon: <SearchIcon />,
    accent: 'bg-sage-green',
    title: 'Look it up',
    description: (
      <>
        Fuzzy on the concept? You've got <strong className="font-semibold text-gray-500">10 minutes</strong> on the
        open internet — <strong className="font-semibold text-gray-500">no AI</strong> — to turn it into a clear,
        concise answer.
      </>
    ),
  },
  {
    number: '03',
    icon: <MicIcon />,
    accent: 'bg-blush-coral',
    title: 'Say it out loud',
    description: (
      <>
        <strong className="font-semibold text-gray-500">60 seconds</strong> to explain it to your target audience.
        No redos. Record yourself, rate your delivery, and see where to improve.
      </>
    ),
  },
]

export default function LandingView() {
  return (
    <div className="flex flex-col items-center">
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-16">
        <div className="flex flex-col items-start gap-8 text-left">
          <Logo className="text-6xl sm:text-7xl" />
          <p className="font-heading text-3xl font-semibold leading-snug text-ink-brown sm:text-4xl">
            You know the answer.
            <br />
            <span className="text-blush-coral">Now make it land.</span>
          </p>
          <p className="max-w-lg text-xl leading-relaxed text-soft-taupe">
            Brush up on tech concepts for interviews, meetings, or your next family dinner.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-soft-taupe/30 bg-paper-ivory/60 p-5 shadow-card sm:p-6">
          <ExampleExplainer />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-20 sm:pb-28">
        <div className="relative grid gap-6 sm:grid-cols-3">
          <div className="pointer-events-none absolute inset-x-16 top-[2.85rem] hidden h-px bg-soft-taupe/25 sm:block" />
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative rounded-xl border border-soft-taupe/30 bg-paper-ivory/85 p-6 shadow-card"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-ink-brown ${step.accent}`}
                >
                  {step.icon}
                </span>
                <span className="font-heading text-xs font-semibold text-soft-taupe/50">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-ink-brown">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft-taupe">{step.description}</p>
              {step.tag && (
                <span className="mt-4 inline-block rounded-full bg-warm-sand/60 px-3 py-1 text-xs font-medium text-ink-brown">
                  {step.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
