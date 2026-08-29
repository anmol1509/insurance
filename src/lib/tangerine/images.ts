/**
 * Tangerine's `ImageUrlList` takes hosted URLs, not file bytes — unlike
 * NSIA's multipart uploads. This uploads a browser file to Cloudinary
 * (unsigned upload) to get a public URL Tangerine can fetch.
 *
 * Server-only.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { cloudinaryCloudName, cloudinaryUploadPreset, tangerineDemoMode } from './config'
import { TangerineError } from './client'

export function imageHostingConfigured(): boolean {
  return Boolean(cloudinaryCloudName() && cloudinaryUploadPreset()) || tangerineDemoMode()
}

export async function uploadVehicleImage(file: File): Promise<string> {
  const cloudName = cloudinaryCloudName()
  const preset = cloudinaryUploadPreset()
  if (!cloudName || !preset) {
    if (tangerineDemoMode()) return `https://demo.shopinsurance.com.ng/mock-uploads/${encodeURIComponent(file.name)}`
    throw new TangerineError(
      'Image hosting is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.',
      503
    )
  }

  const form = new FormData()
  form.append('file', file, file.name)
  form.append('upload_preset', preset)

  const res = await proxyFetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(30_000),
  })

  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.secure_url) {
    throw new TangerineError('Could not upload a vehicle photo.', 502, body)
  }
  return body.secure_url as string
}

export async function uploadVehicleImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadVehicleImage))
}
