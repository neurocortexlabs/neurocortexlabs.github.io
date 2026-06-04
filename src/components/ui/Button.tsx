import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/buttonStyles'

type StyleProps = { variant?: ButtonVariant; size?: ButtonSize }

export function Button({
  variant,
  size,
  className,
  ...props
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={buttonClasses(variant, size, className)} />
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={buttonClasses(variant, size, className)} />
}
