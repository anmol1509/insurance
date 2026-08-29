/**
 * Anthropic API — environment configuration. Server-only.
 *
 * Used to auto-fill the Motor "Your details" step from the documents a
 * customer uploads in the Documents step (ID card, utility bill, etc.),
 * so they don't have to retype information already sitting in a photo
 * they just uploaded. Sending those images to Anthropic's API for this
 * extraction is exactly what this integration does — the customer's ID
 * document leaves our server for that one call.
 */

export function anthropicApiKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY?.trim() || undefined
}

export function isAiExtractionConfigured(): boolean {
  return Boolean(anthropicApiKey())
}

/** Per the claude-api skill: always use the flagship model unless told otherwise. */
export const EXTRACTION_MODEL = 'claude-opus-5'
