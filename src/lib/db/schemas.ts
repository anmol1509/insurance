/** Zod schemas for the /api/admin/policies request bodies. */
import { z } from 'zod'

export const policyProductTypeSchema = z.enum(['motor', 'medical', 'travel', 'business', 'marine', 'personal-accident'])
export const policyStatusSchema = z.enum(['active', 'expiring', 'expired', 'cancelled'])
export const policySourceSchema = z.enum(['manual', 'checkout', 'lookup'])

export const createPolicySchema = z.object({
  policyNumber: z.string().min(1, 'Policy number required'),
  customerName: z.string().min(1, 'Customer name required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  customerPhone: z.string().optional().or(z.literal('')),
  productType: policyProductTypeSchema,
  insurer: z.string().min(1, 'Insurer required'),
  premium: z.number().nonnegative(),
  status: policyStatusSchema.default('active'),
  source: policySourceSchema.default('manual'),
  coverStart: z.string().optional().or(z.literal('')),
  coverEnd: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export const updatePolicySchema = createPolicySchema.partial()

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    if (!result[path]) result[path] = issue.message
  }
  return result
}
