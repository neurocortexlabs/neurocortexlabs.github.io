/**
 * The mark is an "N" drawn as a single signal path, with a node at each end —
 * one input, one output. It is the smallest version of the whole idea: a
 * connection between where you are and where you could be useful.
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient
          id="logomark-gradient"
          x1="8"
          y1="9"
          x2="24"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-signal-400)" />
          <stop offset="1" stopColor="var(--color-synapse-400)" />
        </linearGradient>
      </defs>
      <path
        d="M8 23V9l16 14V9"
        stroke="url(#logomark-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9" r="2.75" fill="var(--color-signal-400)" />
      <circle cx="24" cy="23" r="2.75" fill="var(--color-synapse-400)" />
    </svg>
  )
}
