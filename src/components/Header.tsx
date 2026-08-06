import Logo from './Logo'

export type View = 'home' | 'spin' | 'history'

interface HeaderProps {
  view: View
  onNavigate: (view: View) => void
}

const NAV_ITEMS: { view: View; label: string }[] = [
  { view: 'spin', label: 'Spin!' },
  { view: 'history', label: 'History' },
]

export default function Header({ view, onNavigate }: HeaderProps) {
  return (
    <header id="app-header" className="flex items-center justify-between px-6 py-5 sm:px-10">
      <button type="button" onClick={() => onNavigate('home')} className="transition hover:opacity-80">
        <Logo className="text-lg" />
      </button>
      <nav className="flex items-center gap-1.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            type="button"
            onClick={() => onNavigate(item.view)}
            aria-current={view === item.view ? 'page' : undefined}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              view === item.view
                ? 'bg-ink-brown text-paper-ivory'
                : 'text-ink-brown/80 hover:bg-warm-sand'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
