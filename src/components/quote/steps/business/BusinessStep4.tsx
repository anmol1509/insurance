'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import NINField from '@/components/ui/NINField'
import DocumentUploadZone from '@/components/ui/DocumentUploadZone'

const DOC_SLOTS = [
  { key: 'cac_cert',       label: 'CAC Certificate of Incorporation', required: true },
  { key: 'cac_status',     label: 'CAC Status Report / Memart',       required: true },
  { key: 'director_id',    label: 'Director / Signatory ID',          required: true },
  { key: 'audited_accts',  label: 'Audited Financial Statements',     required: false },
]

export default function BusinessStep4() {
  const { businessData, updateBusiness } = useQuoteStore()

  function handleUpload(key: string, file: File) {
    updateBusiness({
      uploadedDocs: { ...businessData.uploadedDocs, [key]: { name: file.name, size: file.size, status: 'uploaded' } },
    })
  }

  function handleRemove(key: string) {
    const docs = { ...businessData.uploadedDocs }
    delete docs[key]
    updateBusiness({ uploadedDocs: docs })
  }

  return (
    <div className="space-y-7">
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--business-50)', borderColor: 'var(--business-100)' }}
      >
        <span className="text-lg">🏢</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          KYC information for the authorised signatory. Required under NAICOM regulations for all commercial policies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Director / Authorised Signatory Name"
          required
          value={businessData.directorName}
          onChange={(e) => updateBusiness({ directorName: e.target.value })}
          placeholder="Full legal name"
          productColor="var(--business-600)"
        />
        <Input
          label="Email Address"
          required
          type="email"
          value={businessData.directorEmail}
          onChange={(e) => updateBusiness({ directorEmail: e.target.value })}
          placeholder="director@company.com"
          productColor="var(--business-600)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <NINField
          value={businessData.directorNin}
          onChange={(v) => updateBusiness({ directorNin: v })}
          productColor="var(--business-600)"
        />
        <Input
          label="Phone Number"
          required
          prefix="phone"
          value={businessData.directorPhone.replace(/^(\+234|0)/, '')}
          onChange={(e) => updateBusiness({ directorPhone: '0' + e.target.value.replace(/\D/g, '') })}
          placeholder="8012345678"
          inputMode="tel"
          productColor="var(--business-600)"
        />
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Required documents
        </p>
        <DocumentUploadZone
          slots={DOC_SLOTS}
          uploadedDocs={businessData.uploadedDocs}
          onUpload={handleUpload}
          onRemove={handleRemove}
          productColor="var(--business-600)"
          productColorBg="var(--business-50)"
        />
      </div>
    </div>
  )
}
