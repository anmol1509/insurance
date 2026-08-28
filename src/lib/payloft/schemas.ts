/** Zod schemas for the JSON payloads our /api/payloft/* routes accept. */
import { z } from 'zod'

export const initiateSchema = z.object({
  amount: z.number().positive(),
  description: z.string().default(''),
  returnUrl: z.string().url(),
  customerName: z.string().default(''),
  email: z.string().email().optional().or(z.literal('')),
  referenceId: z.string().optional(),
})

export const cardPaymentSchema = z.object({
  method: z.literal('card'),
  cardNumber: z.string().min(12, 'Enter a valid card number'),
  scheme: z.string().min(1, 'Card scheme required'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry must be MM/YY'),
  cvv: z.string().min(3, 'Enter a valid CVV'),
  pin: z.string().optional(),
})

export const payAttitudePaymentSchema = z.object({
  method: z.literal('payattitude'),
  mobile: z.string().min(10, 'Enter a valid mobile number'),
})

export const transferPaymentSchema = z.object({
  method: z.literal('transfer'),
})

export const payRequestSchema = z.discriminatedUnion('method', [
  cardPaymentSchema,
  payAttitudePaymentSchema,
  transferPaymentSchema,
])

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    if (!result[path]) result[path] = issue.message
  }
  return result
}
