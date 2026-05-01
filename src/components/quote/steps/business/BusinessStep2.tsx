'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { calculateBusinessPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { AnimatePresence, motion } from 'framer-motion'

const COVERS = [
  {
    id: 'fire_perils',
    label: 'Fire & Special Perils',
    sub: 'Fire, explosion, flood, storm, impact',
    price: 50000,
    icon: '🔥',
  },
  {
    id: 'burglary',
    label: 'Burglary & Theft',
    sub: 'Break-in, theft of stock and valuables',
    price: 35000,
    icon: '🔒',
  },
  {
    id: 'householders',
    label: "Householder's Comprehensive",
    sub: 'Building, contents, personal effects',
    price: 28000,
    icon: '🏠',
  },
  {
    id: 'gpa',
    label: 'Group Personal Accident (GPA)',
    sub: 'Employee death, disability & medical benefits',
    price: 8000,
    icon: '👷',
  },
]

export default function BusinessStep2() {
  const { businessData, updateBusiness, setCalculatedPremium } = useQuoteStore()

  function toggleCover(id: string) {
    const curr = businessData.coverageItems
    updateBusiness({
      coverageItems: curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    })
  }

  useEffect(() => {
    const { total, breakdown } = calculateBusinessPremium(businessData)
    setCalculatedPremium(total, breakdown)
  }, [businessData, setCalculatedPremium])

  const { total } = calculateBusinessPremium(businessData)
  const selected = (id: string) => businessData.coverageItems.includes(id)

  return (
    <div className="space-y-5">
      <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
        Select all covers needed. Your estimated premium updates live.
      </p>

      {COVERS.map((cover) => {
        const isSelected = selected(cover.id)

        return (
          <div
            key={cover.id}
            className="rounded-2xl border-[1.5px] overflow-hidden transition-colors"
            style={isSelected ? { borderColor: 'var(--business-600)' } : { borderColor: 'var(--border-default)' }}
          >
            {/* Header row */}
            <button
              type="button"
              onClick={() => toggleCover(cover.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              style={isSelected ? { backgroundColor: 'var(--business-50)' } : { backgroundColor: 'white' }}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{cover.icon}</span>
                <div>
                  <p className="font-display font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                    {cover.label}
                  </p>
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{cover.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="font-display font-bold text-sm" style={{ color: 'var(--business-600)' }}>
                  from {formatNaira(cover.price)}
                </span>
                <div
                  className="w-5 h-5 rounded border-[1.5px] flex items-center justify-center"
                  style={isSelected ? { borderColor: 'var(--business-600)', backgroundColor: 'var(--business-600)' } : { borderColor: 'var(--border-medium)' }}
                >
                  {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
              </div>
            </button>

            {/* Expanded sub-fields */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-2 border-t border-[var(--border-subtle)] space-y-4">
                    {cover.id === 'fire_perils' && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input label="Location / Address" value={businessData.fireLocation} onChange={(e) => updateBusiness({ fireLocation: e.target.value })} placeholder="Property address" productColor="var(--business-600)" />
                          <Input label="Occupancy Type" value={businessData.fireOccupancy} onChange={(e) => updateBusiness({ fireOccupancy: e.target.value })} placeholder="e.g. Warehouse, Office" productColor="var(--business-600)" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <Input label="Building Value (₦)" prefix="naira" value={businessData.fireBuildingValue} onChange={(e) => updateBusiness({ fireBuildingValue: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                          <Input label="Contents Value (₦)" prefix="naira" value={businessData.fireContentsValue} onChange={(e) => updateBusiness({ fireContentsValue: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                          <Input label="Stock Value (₦)" prefix="naira" value={businessData.fireStockValue} onChange={(e) => updateBusiness({ fireStockValue: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                        </div>
                        <Input label="Construction Type" value={businessData.fireConstruction} onChange={(e) => updateBusiness({ fireConstruction: e.target.value })} placeholder="e.g. Concrete, Block, Sandcrete" productColor="var(--business-600)" />
                      </>
                    )}

                    {cover.id === 'burglary' && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input label="Nature of Business" value={businessData.burglaryNature} onChange={(e) => updateBusiness({ burglaryNature: e.target.value })} placeholder="e.g. Electronics shop" productColor="var(--business-600)" />
                          <Input label="Operating Hours" value={businessData.burglaryHours} onChange={(e) => updateBusiness({ burglaryHours: e.target.value })} placeholder="e.g. 8am–6pm Mon–Sat" productColor="var(--business-600)" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input label="Stock / Goods Value (₦)" prefix="naira" value={businessData.burglaryStockValue} onChange={(e) => updateBusiness({ burglaryStockValue: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                          <Input label="Valuables Value (₦)" prefix="naira" value={businessData.burglaryValuablesValue} onChange={(e) => updateBusiness({ burglaryValuablesValue: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 rounded-xl border" style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}>
                          <p className="font-sans font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Any prior burglary claims?</p>
                          <ToggleSwitch checked={businessData.burglaryClaimsHistory} onChange={(v) => updateBusiness({ burglaryClaimsHistory: v })} productColor="var(--business-600)" />
                        </div>
                      </>
                    )}

                    {cover.id === 'householders' && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input label="Property Location" value={businessData.houseLocation} onChange={(e) => updateBusiness({ houseLocation: e.target.value })} placeholder="Full address" productColor="var(--business-600)" />
                          <Input label="Building Type" value={businessData.houseBuildingType} onChange={(e) => updateBusiness({ houseBuildingType: e.target.value })} placeholder="e.g. Bungalow, Duplex, Block of flats" productColor="var(--business-600)" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input label="Building Value (₦)" prefix="naira" value={businessData.houseBuildingValue} onChange={(e) => updateBusiness({ houseBuildingValue: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                          <Input label="Contents Value (₦)" prefix="naira" value={businessData.houseContentsValue} onChange={(e) => updateBusiness({ houseContentsValue: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                        </div>
                      </>
                    )}

                    {cover.id === 'gpa' && (
                      <>
                        <div className="grid md:grid-cols-3 gap-4">
                          <Input label="Number of Employees" type="number" value={businessData.gpaEmployees ?? ''} onChange={(e) => updateBusiness({ gpaEmployees: Number(e.target.value) })} placeholder="e.g. 50" productColor="var(--business-600)" />
                          <Input label="Min Employee Age" type="number" value={businessData.gpaMinAge ?? ''} onChange={(e) => updateBusiness({ gpaMinAge: Number(e.target.value) })} placeholder="e.g. 18" productColor="var(--business-600)" />
                          <Input label="Max Employee Age" type="number" value={businessData.gpaMaxAge ?? ''} onChange={(e) => updateBusiness({ gpaMaxAge: Number(e.target.value) })} placeholder="e.g. 60" productColor="var(--business-600)" />
                        </div>
                        <Input label="Occupation / Category" value={businessData.gpaOccupationCategory} onChange={(e) => updateBusiness({ gpaOccupationCategory: e.target.value })} placeholder="e.g. Office workers, Manual labourers" productColor="var(--business-600)" />
                        <Input label="Average Annual Salary (₦)" prefix="naira" value={businessData.gpaAverageSalary} onChange={(e) => updateBusiness({ gpaAverageSalary: e.target.value })} placeholder="0" productColor="var(--business-600)" />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Live premium */}
      {businessData.coverageItems.length > 0 && (
        <motion.div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'var(--business-50)', borderColor: 'var(--business-100)' }}
          layout
        >
          <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>
            Estimated annual premium
          </p>
          <motion.p
            key={total}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            className="font-display font-extrabold text-[40px] leading-none"
            style={{ color: 'var(--business-600)' }}
          >
            {formatNaira(total)}
          </motion.p>
          <p className="font-sans text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {businessData.coverageItems.length} cover{businessData.coverageItems.length !== 1 ? 's' : ''} selected
          </p>
        </motion.div>
      )}
    </div>
  )
}
