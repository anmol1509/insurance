/**
 * Reads whatever is legible in the customer's uploaded documents (ID card,
 * utility bill, etc.) and extracts the "Your details" fields Motor Step 6
 * asks for, so the customer doesn't have to retype what's already in a
 * photo they just uploaded. Every field is optional — extraction only ever
 * fills gaps, never invents data, and the caller decides what to do with a
 * field the customer has already typed themselves.
 */
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { anthropicApiKey, EXTRACTION_MODEL } from './config'
import { NIGERIAN_STATES } from '@/lib/constants'

export class AiExtractionError extends Error {
  readonly status: number
  constructor(message: string, status = 502) {
    super(message)
    this.name = 'AiExtractionError'
    this.status = status
  }
}

const ExtractedMotorDetailsSchema = z.object({
  fullName: z.string().nullable().describe('Full name exactly as printed on the document, or null if not legible/present.'),
  dateOfBirth: z.string().nullable().describe('Date of birth in YYYY-MM-DD format, or null if not present.'),
  nin: z.string().nullable().describe('The 11-digit National Identification Number (NIN), or null if not present.'),
  gender: z.enum(['Male', 'Female', 'Other']).nullable().describe('Gender if stated on the document, or null.'),
  residentialAddress: z.string().nullable().describe('Full residential/home address, or null if not present.'),
  residentialState: z.enum(NIGERIAN_STATES as [string, ...string[]]).nullable().describe('Nigerian state of residence, matched to the closest one of the given options, or null if not determinable.'),
})

export type ExtractedMotorDetails = z.infer<typeof ExtractedMotorDetailsSchema>

export interface ExtractionImageInput {
  mediaType: 'image/jpeg' | 'image/png' | 'application/pdf'
  base64: string
}

export async function extractMotorDetailsFromDocuments(
  images: ExtractionImageInput[]
): Promise<ExtractedMotorDetails> {
  const apiKey = anthropicApiKey()
  if (!apiKey) {
    throw new AiExtractionError('AI document extraction is not configured. Set ANTHROPIC_API_KEY.', 503)
  }
  if (images.length === 0) {
    throw new AiExtractionError('No documents to read.', 400)
  }

  const client = new Anthropic({ apiKey })

  const content: Anthropic.Messages.ContentBlockParam[] = images.map((img) =>
    img.mediaType === 'application/pdf'
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: img.base64 } }
      : { type: 'image', source: { type: 'base64', media_type: img.mediaType, data: img.base64 } }
  )
  content.push({
    type: 'text',
    text: 'These are documents a customer uploaded when applying for Nigerian motor insurance (e.g. a national ID card, international passport, or utility bill). Extract only the fields in the schema, exactly as they appear. If a field is not visible or not present in any document, return null for it — never guess or infer a value that is not actually shown.',
  })

  let response: Awaited<ReturnType<typeof client.messages.parse>>
  try {
    response = await client.messages.parse({
      model: EXTRACTION_MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content }],
      output_config: { format: zodOutputFormat(ExtractedMotorDetailsSchema) },
    })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new AiExtractionError('AI document extraction is misconfigured.', 503)
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new AiExtractionError('AI document extraction is temporarily rate-limited. Please try again shortly.', 429)
    }
    throw new AiExtractionError('Could not read the uploaded documents.', 502)
  }

  if (!response.parsed_output) {
    throw new AiExtractionError('Could not read the uploaded documents.', 502)
  }
  return response.parsed_output
}
