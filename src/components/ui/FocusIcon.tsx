import type { ReactNode } from 'react'
import type { FocusAreaIcon } from '@/content/focusAreas'

const PATHS: Record<FocusAreaIcon, ReactNode> = {
  climate: (
    <>
      <path d="M12 3v4" />
      <path d="M12 21v-4" />
      <path d="M4.2 7.5 7 9.5" />
      <path d="M19.8 16.5 17 14.5" />
      <path d="M4.2 16.5 7 14.5" />
      <path d="M19.8 7.5 17 9.5" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  health: (
    <>
      <path d="M3 12h4l2-5 3 10 2.5-6 1.5 3h5" />
    </>
  ),
  education: (
    <>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6 10.5V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-5.5" />
    </>
  ),
  shelter: (
    <>
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M5.5 9.8V19h13V9.8" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  civic: (
    <>
      <path d="M3 20h18" />
      <path d="M4.5 20V9.5h15V20" />
      <path d="M12 3 21 9H3l9-6Z" />
      <path d="M9 20v-6" />
      <path d="M15 20v-6" />
    </>
  ),
  justice: (
    <>
      <path d="M12 4v16" />
      <path d="M6 20h12" />
      <path d="M4 8h16" />
      <path d="M4 8 1.8 13.5h4.4L4 8Z" />
      <path d="M20 8l-2.2 5.5h4.4L20 8Z" />
    </>
  ),
}

export function FocusIcon({ name, className = '' }: { name: FocusAreaIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  )
}
