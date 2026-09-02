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

export const agentRoleSchema = z.enum(['sales', 'support', 'claims', 'admin'])

export const createAgentSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional().or(z.literal('')),
  role: agentRoleSchema.default('sales'),
  active: z.boolean().default(true),
})

export const updateAgentSchema = createAgentSchema.partial()

export const leadProductTypeSchema = z.enum(['motor', 'medical', 'travel', 'business'])
export const leadStatusSchema = z.enum(['new', 'contacted', 'quoted', 'converted', 'lost'])

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(7, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  productType: leadProductTypeSchema,
  summary: z.string().optional().or(z.literal('')),
  estimatedPremium: z.number().nonnegative(),
  source: z.string().min(1, 'Source required'),
  status: leadStatusSchema.default('new'),
  assignedTo: z.string().nullable().optional(),
})

export const updateLeadSchema = createLeadSchema.partial()

export const addLeadNoteSchema = z.object({
  text: z.string().min(1, 'Note text required'),
})

export const claimStatusSchema = z.enum(['submitted', 'under_review', 'approved', 'settled', 'rejected'])

export const createClaimSchema = z.object({
  claimantName: z.string().min(1, 'Claimant name required'),
  policyNumber: z.string().min(1, 'Policy number required'),
  claimType: z.string().min(1, 'Claim type required'),
  amount: z.number().nonnegative(),
  claimDate: z.string().optional().or(z.literal('')),
  status: claimStatusSchema.default('submitted'),
  assignedTo: z.string().nullable().optional(),
  description: z.string().optional().or(z.literal('')),
})

export const updateClaimSchema = createClaimSchema.partial()

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_'
    if (!result[path]) result[path] = issue.message
  }
  return result
}
