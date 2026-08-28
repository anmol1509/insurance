/**
 * Vehicle photo slots Tangerine expects in `ImageUrlList` (both manuals,
 * "Note (Image URL)"): a minimum of 2, maximum of 4. Front and chassis are
 * mandatory; back and side are optional.
 */
export interface TangerineDocumentSlot {
  slot: 'FrontImageURL' | 'ChasisImageURL' | 'BackImageURL' | 'SideImageURL'
  label: string
  required: boolean
}

export const TANGERINE_DOCUMENT_SLOTS: TangerineDocumentSlot[] = [
  { slot: 'FrontImageURL', label: 'Vehicle photo — front', required: true },
  { slot: 'ChasisImageURL', label: 'Vehicle photo — chassis plate', required: true },
  { slot: 'BackImageURL', label: 'Vehicle photo — back', required: false },
  { slot: 'SideImageURL', label: 'Vehicle photo — side', required: false },
]

export const TANGERINE_REQUIRED_SLOTS = TANGERINE_DOCUMENT_SLOTS.filter((s) => s.required).map((s) => s.slot)
