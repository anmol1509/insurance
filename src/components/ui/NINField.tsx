'use client'
import Input from './Input'

interface NINFieldProps {
  value: string
  onChange: (val: string) => void
  error?: string
  productColor?: string
}

export default function NINField({ value, onChange, error, productColor }: NINFieldProps) {
  return (
    <Input
      label="National Identification Number (NIN)"
      required
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, '').slice(0, 11)
        onChange(v)
      }}
      placeholder="11-digit NIN"
      hint="As shown on your NIMC slip or national ID card"
      maxLength={11}
      inputMode="numeric"
      error={error}
      productColor={productColor}
    />
  )
}
