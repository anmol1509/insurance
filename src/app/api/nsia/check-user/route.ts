import { NextResponse, type NextRequest } from 'next/server'
import { checkUser } from '@/lib/nsia/api'
import { nsiaErrorResponse } from '@/lib/nsia/http'

/**
 * Guide section 5.1 — look a customer up by email before starting a purchase.
 * Answers 200 either way; `exists` tells the caller whether to collect the
 * details needed to create a profile.
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.trim()

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { success: false, error: 'A valid email address is required.' },
      { status: 400 }
    )
  }

  try {
    const client = await checkUser(email)
    return NextResponse.json({
      success: true,
      exists: client !== null,
      client,
    })
  } catch (error) {
    return nsiaErrorResponse(error)
  }
}
