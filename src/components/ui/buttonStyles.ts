export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition duration-200 ease-out-soft disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-signal-400 text-ink-950 hover:bg-signal-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_var(--color-signal-400)]',
  outline:
    'border border-ink-100/15 text-ink-100 hover:border-signal-400/50 hover:bg-ink-100/5 hover:text-ink-50',
  ghost: 'text-ink-300 hover:bg-ink-100/5 hover:text-ink-50',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[0.9375rem]',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className = '',
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}
