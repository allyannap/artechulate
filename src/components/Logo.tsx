interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center font-heading font-semibold tracking-tight text-ink-brown ${className}`}
    >
      ar<span className="ml-[0.1em] mr-0 inline-flex items-center rounded-[0.22em] bg-blush-coral py-[0.15em] pl-[0.28em] pr-[0.13em] font-mono text-[0.92em] font-bold text-ink-brown">tech<span aria-hidden="true" className="ml-[0.05em] h-[1em] w-[0.1em] animate-blink-cursor bg-ink-brown" /></span>ulate
    </span>
  )
}
