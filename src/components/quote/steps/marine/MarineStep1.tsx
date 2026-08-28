'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { mergeOptions, useNsiaDropdowns } from '@/lib/nsia/useNsiaDropdowns'
import { MARINE_CARGO_CATEGORIES, MARINE_PACKING_TYPES } from '@/lib/constants'
import { Package } from 'lucide-react'

interface NsiaCargoRating {
  name: string
}

const packingOptions = MARINE_PACKING_TYPES.map((p) => ({ value: p, label: p }))

export default function MarineStep1() {
  const { marineData, updateMarine } = useQuoteStore()

  // NSIA's own cargo categories (guide §8.1.2) take priority over our fallback list.
  const { data: dropdowns } = useNsiaDropdowns<{ 'marine-cargo-rating': NsiaCargoRating[] }>([
    'marine-cargo-rating',
  ])
  const remoteCategories = (dropdowns['marine-cargo-rating'] ?? []).map((c) => c.name)
  const categoryOptions = mergeOptions(MARINE_CARGO_CATEGORIES, remoteCategories.length ? remoteCategories : undefined)
    .map((c) => ({ value: c, label: c }))

  function handleSumInsuredChange(raw: string) {
    const num = parseInt(raw.replace(/,/g, '').replace(/\D/g, ''), 10)
    updateMarine({ sumInsured: isNaN(num) ? null : num })
  }

  function handleInvoiceValueChange(raw: string) {
    const num = parseInt(raw.replace(/,/g, '').replace(/\D/g, ''), 10)
    updateMarine({ invoiceValue: isNaN(num) ? null : num })
  }

  return (
    <div className="space-y-7">
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-2xl border"
        style={{ backgroundColor: 'var(--marine-50)', borderColor: 'var(--marine-100)' }}
      >
        <Package className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--marine-600)' }} />
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Tell us about the goods you&apos;re shipping. This covers cargo in transit by sea, air or land.
        </p>
      </div>

      <Select
        label="Cargo category"
        required
        options={categoryOptions}
        value={marineData.cargoCategory}
        onChange={(v) => updateMarine({ cargoCategory: v })}
        placeholder="Select cargo category"
        productColor="var(--marine-600)"
      />

      <Input
        label="Description of goods"
        required
        value={marineData.cargoDescription}
        onChange={(e) => updateMarine({ cargoDescription: e.target.value })}
        placeholder="e.g. Electronics, machinery, textiles"
        productColor="var(--marine-600)"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Sum insured (value of goods)"
          required
          prefix="naira"
          value={marineData.sumInsured != null ? marineData.sumInsured.toLocaleString('en-NG') : ''}
          onChange={(e) => handleSumInsuredChange(e.target.value)}
          placeholder="e.g. 10,000,000"
          inputMode="numeric"
          productColor="var(--marine-600)"
        />
        <Select
          label="Currency"
          required
          options={[
            { value: 'NGN', label: 'NGN — Nigerian Naira' },
            { value: 'USD', label: 'USD — US Dollar' },
            { value: 'GBP', label: 'GBP — British Pound' },
            { value: 'EUR', label: 'EUR — Euro' },
          ]}
          value={marineData.currency}
          onChange={(v) => updateMarine({ currency: v })}
          productColor="var(--marine-600)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Vessel / carrier name"
          value={marineData.vesselName}
          onChange={(e) => updateMarine({ vesselName: e.target.value })}
          placeholder="e.g. MV Atlantic"
          productColor="var(--marine-600)"
        />
        <Input
          label="Number of packages"
          value={marineData.numberOfPackages != null ? String(marineData.numberOfPackages) : ''}
          onChange={(e) => updateMarine({ numberOfPackages: e.target.value ? parseInt(e.target.value.replace(/\D/g, ''), 10) : null })}
          placeholder="e.g. 50"
          inputMode="numeric"
          productColor="var(--marine-600)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Voyage from"
          required
          value={marineData.voyageFrom}
          onChange={(e) => updateMarine({ voyageFrom: e.target.value })}
          placeholder="e.g. Shanghai, China"
          productColor="var(--marine-600)"
        />
        <Input
          label="Voyage to"
          required
          value={marineData.voyageTo}
          onChange={(e) => updateMarine({ voyageTo: e.target.value })}
          placeholder="e.g. Lagos, Nigeria"
          productColor="var(--marine-600)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Invoice number"
          value={marineData.invoiceNumber}
          onChange={(e) => updateMarine({ invoiceNumber: e.target.value })}
          placeholder="e.g. INV-2026-001"
          productColor="var(--marine-600)"
        />
        <Input
          label="Invoice value"
          prefix="naira"
          value={marineData.invoiceValue != null ? marineData.invoiceValue.toLocaleString('en-NG') : ''}
          onChange={(e) => handleInvoiceValueChange(e.target.value)}
          placeholder="e.g. 10,000,000"
          inputMode="numeric"
          productColor="var(--marine-600)"
        />
      </div>

      <Select
        label="Packing type"
        options={packingOptions}
        value={marineData.packingType}
        onChange={(v) => updateMarine({ packingType: v })}
        placeholder="How are the goods packed?"
        productColor="var(--marine-600)"
      />
    </div>
  )
}
