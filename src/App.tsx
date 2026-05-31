import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Mission } from '@/components/sections/Mission'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FocusAreas } from '@/components/sections/FocusAreas'

export default function App() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="focus:bg-signal-400 focus:text-ink-950 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:px-5 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="flex-1 pt-20">
        <Hero />
        <Mission />
        <HowItWorks />
        <FocusAreas />
      </main>

      <Footer />
    </div>
  )
}
