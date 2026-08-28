import { cn } from '@/lib/utils'

type TagVariant = 'motor' | 'medical' | 'travel' | 'business' | 'marine' | 'pa' | 'default'

interface TagProps {
  variant?: TagVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<TagVariant, string> = {
  motor:    'bg-motor-50 text-motor-700 border border-motor-100',
  medical:  'bg-medical-50 text-medical-700 border border-medical-100',
  travel:   'bg-travel-50 text-travel-700 border border-travel-100',
  business: 'bg-business-50 text-business-700 border border-business-100',
  marine:   'bg-marine-50 text-marine-700 border border-marine-100',
  pa:       'bg-pa-50 text-pa-700 border border-pa-100',
  default:  'bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border-default)]',
}

export default function Tag({ variant = 'default', children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] uppercase tracking-[0.05em] px-3 py-1 rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
