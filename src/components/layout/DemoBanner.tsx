import { FlaskConical } from 'lucide-react'

/**
 * Slim notice shown on every page while the site is a demonstration for the
 * regulator. Set NEXT_PUBLIC_DEMO_MODE=false to remove it at go-live.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'

export default function DemoBanner() {
  if (!DEMO_MODE) return null
  return (
    <div
      role="note"
      className="relative z-[60] flex items-center justify-center gap-2 px-4 py-2 text-center font-sans font-medium text-[12.5px] leading-snug"
      style={{ backgroundColor: '#064e3b', color: 'white' }}
    >
      <FlaskConical className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>
        <strong className="font-semibold">Demo version</strong> — sample data only. No real policies are issued and no payments are taken.
      </span>
    </div>
  )
}
