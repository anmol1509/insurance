/**
 * Document rules from section 15 of the NSIA guide. Safe to import from client
 * components — it holds no credentials and touches no environment variables.
 *
 * Validating locally is both faster and cheaper than having NSIA reject an
 * entire multipart submission over one bad file.
 */

export const NSIA_FILE_RULES = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  extensions: ['pdf', 'jpg', 'jpeg', 'png'],
  minImageWidth: 800,
  minImageHeight: 600,
} as const

export const NSIA_ACCEPT_ATTRIBUTE = '.pdf,.jpg,.jpeg,.png'

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/** Synchronous checks — size and format. Returns an error message, or null. */
export function validateFileBasics(file: { name: string; size: number; type: string }): string | null {
  if (file.size === 0) return 'This file is empty.'
  if (file.size > NSIA_FILE_RULES.maxBytes) {
    return `File is ${formatFileSize(file.size)}. The maximum accepted size is 5 MB.`
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  const typeOk = (NSIA_FILE_RULES.mimeTypes as readonly string[]).includes(file.type)
  const extensionOk = (NSIA_FILE_RULES.extensions as readonly string[]).includes(extension)
  if (!typeOk && !extensionOk) return 'Only PDF, JPG and PNG files are accepted.'

  return null
}

/**
 * Browser-only. Adds the minimum-resolution check for images; PDFs skip it.
 * Resolves to an error message, or null when the file is acceptable.
 */
export async function validateUpload(file: File): Promise<string | null> {
  const basic = validateFileBasics(file)
  if (basic) return basic

  if (!file.type.startsWith('image/')) return null
  if (typeof window === 'undefined') return null

  const dimensions = await readImageDimensions(file)
  // An unreadable image is left to the server to judge rather than blocked here.
  if (!dimensions) return null

  const { minImageWidth, minImageHeight } = NSIA_FILE_RULES
  if (dimensions.width < minImageWidth || dimensions.height < minImageHeight) {
    return `Image is ${dimensions.width}×${dimensions.height}px. It must be at least ${minImageWidth}×${minImageHeight}px.`
  }
  return null
}

function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    image.src = url
  })
}
