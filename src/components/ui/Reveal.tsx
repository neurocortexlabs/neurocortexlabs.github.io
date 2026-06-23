import type { ReactNode } from 'react'
import { revealClass, useInView } from '@/hooks/useInView'

type RevealProps = {
  children: ReactNode
  /** Stagger, in milliseconds, applied once the element is in view. */
  delay?: number
  className?: string
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={revealClass(inView, className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
