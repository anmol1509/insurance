/**
 * In-memory registry of the actual `File` objects the user picked.
 *
 * The quote store persists to sessionStorage and can only hold serialisable
 * metadata, but an insurer submission needs the bytes. Files therefore live
 * here for the lifetime of the page and are cleared on a full reload — the
 * documents step reconciles the two so the UI never claims to hold a file it
 * has actually lost.
 */

const files = new Map<string, File>()

export function putDocumentFile(key: string, file: File): void {
  files.set(key, file)
}

export function getDocumentFile(key: string): File | undefined {
  return files.get(key)
}

export function removeDocumentFile(key: string): void {
  files.delete(key)
}

export function hasDocumentFile(key: string): boolean {
  return files.has(key)
}

export function documentFileKeys(): string[] {
  return [...files.keys()]
}

/** Collects the files for a set of slots, skipping any that are missing. */
export function collectDocumentFiles(keys: string[]): Record<string, File> {
  const result: Record<string, File> = {}
  for (const key of keys) {
    const file = files.get(key)
    if (file) result[key] = file
  }
  return result
}

export function clearDocumentFiles(): void {
  files.clear()
}
