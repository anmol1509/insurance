/** Request/response shapes for the Payloft Sandbox checkout API. */

export type PayloftPaymentMethod = 'card' | 'payattitude' | 'transfer'

export interface PayloftInitiateRequest {
  amount: number
  currency?: string
  description?: string
  returnUrl: string
  callbackUrl?: string
  referenceId?: string
  customerName?: string
  email?: string
  scheme?: 'visa' | 'verve' | 'payattitude' | 'transfer'
  fee?: number
}

export interface PayloftInitiateResponse {
  success: boolean
  data: {
    orderId: number
    checkoutUrl: string
    referenceId: string
    isSandbox: boolean
  }
}

export interface PayloftCheckoutDetails {
  success: boolean
  data: {
    orderId: number
    merchantName: string
    amount: number
    fee: number
    currency: string
    status: string
    isSandbox: boolean
    availableMethods: PayloftPaymentMethod[]
    testCards: Record<string, string>
  }
}

export interface PayloftCardPayment {
  method: 'card'
  cardNumber: string
  scheme: string
  expiry: string
  cvv: string
  pin?: string
}

export interface PayloftPayAttitudePayment {
  method: 'payattitude'
  mobile: string
}

export interface PayloftTransferPayment {
  method: 'transfer'
}

export type PayloftPayRequest = PayloftCardPayment | PayloftPayAttitudePayment | PayloftTransferPayment

export interface PayloftTransferInitiated {
  success: boolean
  message: string
  data: {
    transactionId: number
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount: number
    currency: string
    expiresAt: string
    lifetimeMin: number
    isSandbox: boolean
  }
}

export type PayloftTransactionStatus = 'APPROVED' | 'DECLINED' | 'INSUFFICIENT_FUNDS' | 'TIMEOUT' | 'FRAUD_BLOCK' | 'PENDING'

export interface PayloftResult {
  success: boolean
  data: {
    transactionId: number
    status: PayloftTransactionStatus | string
    approvalCode?: string
    referenceId?: string
    amount: number
    isSandbox: boolean
  }
}
