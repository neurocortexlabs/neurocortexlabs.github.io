/**
 * Ambient backdrop for the hero: a fixed constellation of nodes and edges.
 *
 * The layout is hand-placed rather than random so it renders identically on
 * every load and can be tuned by eye. Only a handful of nodes pulse — the
 * point is a room that feels alive, not a screensaver.
 */

type Point = { x: number; y: number }

const NODES: Point[] = [
  { x: 6, y: 40 },
  { x: 16, y: 22 },
  { x: 24, y: 47 },
  { x: 34, y: 12 },
  { x: 38, y: 33 },
  { x: 47, y: 53 },
  { x: 54, y: 20 },
  { x: 63, y: 40 },
  { x: 70, y: 9 },
  { x: 76, y: 30 },
  { x: 85, y: 48 },
  { x: 92, y: 18 },
  { x: 46, y: 5 },
  { x: 12, y: 55 },
]

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 13],
  [3, 12],
  [4, 5],
  [4, 6],
  [5, 7],
  [5, 10],
  [6, 7],
  [6, 8],
  [7, 9],
  [8, 9],
  [8, 11],
  [9, 10],
  [9, 11],
]

/** Nodes that breathe, and the delay that keeps them out of sync. */
const PULSING: Record<number, string> = {
  1: '0s',
  4: '1.4s',
  7: '2.6s',
  9: '0.7s',
  11: '3.4s',
}

export function NeuralField({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="field-edge" x1="0" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-signal-400)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--color-synapse-400)" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="field-fade" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="field-mask">
          <rect width="100" height="60" fill="url(#field-fade)" />
        </mask>
      </defs>

      <g mask="url(#field-mask)">
        <g stroke="url(#field-edge)" strokeWidth="0.12" strokeOpacity="0.55">
          {EDGES.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              x1={NODES[from].x}
              y1={NODES[from].y}
              x2={NODES[to].x}
              y2={NODES[to].y}
            />
          ))}
        </g>

        {NODES.map((node, index) => {
          const delay = PULSING[index]
          return (
            <circle
              key={index}
              cx={node.x}
              cy={node.y}
              r={delay ? 0.62 : 0.42}
              fill={delay ? 'var(--color-signal-300)' : 'var(--color-ink-300)'}
              opacity={delay ? undefined : 0.3}
              className={delay ? 'animate-node-pulse motion-reduce:opacity-60' : undefined}
              style={delay ? { animationDelay: delay } : undefined}
            />
          )
        })}
      </g>
    </svg>
  )
}
