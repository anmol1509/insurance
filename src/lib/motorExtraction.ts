/** Browser-side helper for auto-filling Motor's "Your details" step from Step 5's uploaded documents. */
import type { ExtractedMotorDetails } from '@/lib/ai/extractMotorDetails'

export async function extractMotorDetails(files: File[]): Promise<ExtractedMotorDetails | null> {
  if (files.length === 0) return null

  const form = new FormData()
  files.forEach((file, i) => form.append(`file_${i}`, file, file.name))

  const response = await fetch('/api/motor/extract-details', { method: 'POST', body: form })
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.success) return null
  return body.data as ExtractedMotorDetails
}
