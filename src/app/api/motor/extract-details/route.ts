import { NextResponse, type NextRequest } from 'next/server'
import { extractMotorDetailsFromDocuments, AiExtractionError, type ExtractionImageInput } from '@/lib/ai/extractMotorDetails'
import { aiExtractionErrorResponse } from '@/lib/ai/http'

const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'])
const MAX_FILES = 6

/**
 * `POST /api/motor/extract-details` — multipart/form-data, one or more
 * files under any field name. Reads whatever documents the customer has
 * uploaded so far in Motor's Documents step and returns any "Your details"
 * fields (name, DOB, NIN, gender, address, state) it can find in them.
 */
export async function POST(request: NextRequest) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a multipart/form-data body.' }, { status: 400 })
  }

  const files = Array.from(form.values()).filter((v): v is File => v instanceof File)
  if (files.length === 0) {
    return NextResponse.json({ success: false, error: 'No documents were provided.' }, { status: 400 })
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ success: false, error: `Too many documents — send at most ${MAX_FILES}.` }, { status: 400 })
  }

  try {
    const images: ExtractionImageInput[] = []
    for (const file of files) {
      const mediaType = file.type.replace('image/jpg', 'image/jpeg')
      if (!SUPPORTED_TYPES.has(mediaType)) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      images.push({
        mediaType: mediaType as ExtractionImageInput['mediaType'],
        base64: buffer.toString('base64'),
      })
    }
    if (images.length === 0) {
      throw new AiExtractionError('None of the uploaded documents are a supported type (PDF, JPG, PNG).', 400)
    }

    const extracted = await extractMotorDetailsFromDocuments(images)
    return NextResponse.json({ success: true, data: extracted })
  } catch (error) {
    return aiExtractionErrorResponse(error)
  }
}
