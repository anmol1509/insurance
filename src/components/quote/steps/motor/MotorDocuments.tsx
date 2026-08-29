'use client'
import { useEffect, useMemo, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import DocumentUploadZone from '@/components/ui/DocumentUploadZone'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { MOTOR_PLANS } from '@/lib/motorPlans'
import { aiicoLineFor, motorDocSlots, tangerineLineFor } from '@/lib/motorDocuments'
import { validateUpload } from '@/lib/nsia/files'
import {
  getDocumentFile,
  putDocumentFile,
  removeDocumentFile,
} from '@/store/documentFiles'
import TangerineMotorDetails from './TangerineMotorDetails'
import AiicoMotorDetails from './AiicoMotorDetails'

export default function MotorDocuments() {
  const { motorData, updateMotor } = useQuoteStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const plan = MOTOR_PLANS.find((p) => p.id === motorData.selectedUnderwriter)
  const isNsia = plan?.nsia === true
  const tangerineLine = tangerineLineFor(motorData.selectedUnderwriter)
  const aiicoLine = aiicoLineFor(motorData.selectedUnderwriter)

  // NSIA names each document slot itself, and asks for more of them on a
  // comprehensive or corporate policy.
  const slots = useMemo(() => motorDocSlots(motorData), [motorData])

  const requiredKeys = useMemo(
    () => slots.filter((slot) => slot.required).map((slot) => slot.key),
    [slots]
  )

  const uploadedRequired = requiredKeys.filter((k) => motorData.uploadedDocs[k]).length
  const totalRequired = requiredKeys.length
  const allRequired = totalRequired > 0 && uploadedRequired === totalRequired

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /**
   * Upload metadata survives a reload in sessionStorage but the file bytes do
   * not, so drop any entry whose file is gone rather than showing a document
   * we can no longer submit.
   */
  useEffect(() => {
    const stale = Object.keys(motorData.uploadedDocs).filter((key) => !getDocumentFile(key))
    if (stale.length === 0) return
    const docs = { ...motorData.uploadedDocs }
    stale.forEach((key) => delete docs[key])
    updateMotor({ uploadedDocs: docs })
    // Runs once on mount: later removals are handled by handleRemove.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleUpload(key: string, file: File) {
    const problem = await validateUpload(file)
    if (problem) {
      setErrors((prev) => ({ ...prev, [key]: problem }))
      return
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    putDocumentFile(key, file)
    updateMotor({
      uploadedDocs: {
        ...motorData.uploadedDocs,
        [key]: { name: file.name, size: file.size, status: 'uploaded' },
      },
    })
  }

  function handleRemove(key: string) {
    removeDocumentFile(key)
    const docs = { ...motorData.uploadedDocs }
    delete docs[key]
    updateMotor({ uploadedDocs: docs })
  }

  if (slots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 px-5 py-6 rounded-2xl border-2"
        style={{ borderColor: 'var(--motor-300)', backgroundColor: 'var(--motor-50)' }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--motor-600)' }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-sans font-bold text-[14px]" style={{ color: 'var(--motor-700)' }}>No documents needed</p>
          <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {`${plan?.insurer ?? 'This insurer'} doesn't require any document uploads to process your application. You're all set — continue to the next step.`}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 py-3.5 rounded-2xl border-2"
        style={{
          borderColor: allRequired ? 'var(--motor-300)' : 'var(--border-default)',
          backgroundColor: allRequired ? 'var(--motor-50)' : 'white',
          transition: 'border-color 0.3s, background-color 0.3s',
        }}
      >
        <div>
          <p className="font-sans font-bold text-[13px]" style={{ color: allRequired ? 'var(--motor-700)' : 'var(--text-primary)' }}>
            {allRequired
              ? 'All required documents uploaded'
              : `${uploadedRequired} of ${totalRequired} required documents uploaded`}
          </p>
          <div className="flex gap-1.5 mt-2">
            {requiredKeys.map((k) => (
              <div
                key={k}
                className="h-1.5 w-14 rounded-full"
                style={{
                  backgroundColor: motorData.uploadedDocs[k] ? 'var(--motor-600)' : 'var(--border-medium)',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: allRequired ? 'var(--motor-600)' : 'var(--surface-raised)',
            transition: 'background-color 0.3s',
          }}
        >
          {allRequired
            ? <CheckCircle2 className="w-5 h-5 text-white" />
            : <span className="font-display font-bold text-[15px]" style={{ color: 'var(--text-muted)' }}>{uploadedRequired}/{totalRequired}</span>}
        </div>
      </motion.div>

      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
      >
        <span className="text-lg shrink-0">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          {isNsia
            ? `Required by ${plan?.insurer} to issue your certificate. Photos must be at least 800×600px and utility bills no older than 3 months. `
            : tangerineLine
            ? `Required by ${plan?.insurer} to generate your policy. Vehicle photos are hosted and linked directly on your application. `
            : aiicoLine
            ? `Required by ${plan?.insurer} to register your policy. Files are sent securely with your application. `
            : 'Required per NAICOM/NSIA guidelines. Files must be clear and legible. '}
          Accepted formats: PDF, JPG, PNG (max 5 MB each). Drag &amp; drop supported.
        </p>
      </div>

      {tangerineLine && <TangerineMotorDetails />}
      {aiicoLine && <AiicoMotorDetails />}

      <DocumentUploadZone
        slots={slots}
        uploadedDocs={motorData.uploadedDocs}
        onUpload={handleUpload}
        onRemove={handleRemove}
        errors={errors}
        productColor="var(--motor-600)"
        productColorBg="var(--motor-50)"
      />
    </div>
  )
}
