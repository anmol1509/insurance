import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  wordmarkColor?: string
  href?: string
  variant?: 'default' | 'white'
}

export default function Logo({
  size = 32,
  showWordmark = true,
  wordmarkColor,
  href = '/',
  variant = 'default',
}: LogoProps) {
  const textColor = wordmarkColor ?? (variant === 'white' ? 'white' : 'var(--text-primary)')

  const inner = (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo.svg"
        alt="ShopInsurance"
        width={size}
        height={Math.round(size * 1.08)}
        priority
        className="shrink-0"
        style={{ borderRadius: size * 0.22 }}
      />
      {showWordmark && (
        <span
          className="font-display font-bold leading-none"
          style={{ fontSize: size * 0.53, color: textColor }}
        >
          ShopInsurance
        </span>
      )}
    </span>
  )

  if (!href) return inner

  return (
    <Link href={href} className="flex items-center">
      {inner}
    </Link>
  )
}
