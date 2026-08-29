'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, Lock, ChevronDown, ChevronUp, Check, CreditCard, Building2, Smartphone, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { MOTOR_PLANS } from '@/lib/motorPlans'
import { motorDocSlots } from '@/lib/motorDocuments'
import { submitNsiaApplication } from '@/lib/nsia/browser'
import { documentSlotsFor } from '@/lib/nsia/documents'
import { toNsiaCustomer, toNsiaMarineDetails, toNsiaMotorDetails, toNsiaPersonalAccidentDetails } from '@/lib/nsia/fromQuoteStore'
import { submitTangerineApplication } from '@/lib/tangerine/browser'
import { toTangerineCustomer, toTangerineMotor } from '@/lib/tangerine/fromQuoteStore'
import { TANGERINE_DOCUMENT_SLOTS } from '@/lib/tangerine/documents'
import { submitAiicoMotorApplication } from '@/lib/aiico/browser'
import { toAiicoCustomer, toAiicoVehicle } from '@/lib/aiico/fromQuoteStore'
import { AIICO_DOCUMENT_SLOTS } from '@/lib/aiico/documents'
import { collectDocumentFiles } from '@/store/documentFiles'
import {
  confirmPayloftTransfer,
  initiatePayloftOrder,
  pollPayloftResult,
  submitPayloftPayment,
  type PayloftTransactionResult,
} from '@/lib/payloft/browser'

type PayMethod = 'card' | 'bank' | 'mobile'

const CARD_NETWORKS = ['Visa', 'Mastercard', 'Verve']

interface TransferAccount {
  accountNumber: string
  bankName: string
  bankCode: string
  amount: number
  expiresAt: string
}

/** Guide "Error Codes & HTTP Status" plus the transfer test scenarios table. */
function paymentFailureMessage(status: string): string {
  switch (status) {
    case 'DECLINED': return 'Your payment was declined. Please check your details or try another method.'
    case 'INSUFFICIENT_FUNDS': return 'Payment failed: insufficient funds.'
    case 'TIMEOUT': return 'The payment timed out. Please try again.'
    case 'FRAUD_BLOCK': return 'This payment was blocked for security reasons. Please contact support.'
    default: return `Payment was not approved (status: ${status}).`
  }
}

function PaymentSuccess({ onClose, planName, total, productLabel, insurerRef, insurerRefLabel }: { onClose: () => void; planName: string; total: number; productLabel: string; insurerRef: string | null; insurerRefLabel: string }) {
  const policyRef = insurerRef ?? `SI-2026-${Math.floor(100000 + Math.random() * 900000)}`
  const today = new Date()
  const expiryDate = new Date(today)
  expiryDate.setFullYear(expiryDate.getFullYear() + 1)
  const fmt = (d: Date) => d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

  const NEXT_STEPS = [
    { step: '1', title: 'Certificate issued', body: 'Your digital certificate has been sent to your email and SMS.', done: true },
    { step: '2', title: 'NIID registration', body: 'Your vehicle is being registered with NIID within 30 minutes.', done: true },
    { step: '3', title: 'Policy activated', body: `Cover runs from ${fmt(today)} to ${fmt(expiryDate)}.`, done: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="bg-white w-full sm:max-w-[480px] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: 'var(--green-700)' }} />

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--green-50)' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.15, damping: 18, stiffness: 300 }}
              >
                <Check className="w-7 h-7" style={{ color: 'var(--green-700)' }} strokeWidth={2.5} />
              </motion.div>
            </div>
            <div>
              <h2 className="font-display font-extrabold text-[22px] leading-tight" style={{ color: 'var(--text-primary)' }}>Payment successful!</h2>
              <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{planName} · {formatNaira(total)} paid</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: 'var(--surface-raised)' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.06em] mb-0.5" style={{ color: 'var(--text-muted)' }}>Policy reference</p>
                <p className="font-mono font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>{policyRef}</p>
                {insurerRef && (
                  <p className="font-sans text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {insurerRefLabel}: <span className="font-mono font-medium">{insurerRef}</span>
                  </p>
                )}
              </div>
              <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}>Active</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {[
                { label: 'Product', value: productLabel },
                { label: 'Insurer', value: planName },
                { label: 'Valid from', value: fmt(today) },
                { label: 'Valid to', value: fmt(expiryDate) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-3" style={{ color: 'var(--text-muted)' }}>What happens next</p>
          <div className="flex flex-col gap-0 mb-6">
            {NEXT_STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-sans font-bold text-[11px]"
                    style={{ backgroundColor: s.done ? 'var(--green-700)' : 'var(--surface-raised)', color: s.done ? 'white' : 'var(--text-muted)' }}
                  >
                    {s.done ? <Check className="w-3 h-3" strokeWidth={3} /> : s.step}
                  </div>
                  {i < NEXT_STEPS.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ backgroundColor: 'var(--border-subtle)', minHeight: 20 }} />
                  )}
                </div>
                <div className="pb-4">
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/dashboard/policies"
              className="h-12 rounded-2xl font-sans font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              <Shield className="w-4 h-4" /> View my policies
            </Link>
            <Link
              href="/"
              className="h-10 rounded-2xl font-sans font-medium text-[13px] flex items-center justify-center border transition-colors hover:bg-[var(--surface-raised)]"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const NSIA_PLAN_NAME: Record<string, string> = {
  marine: 'NSIA Marine Cargo Cover',
  'personal-accident': 'NSIA Personal Accident Cover',
}

const BACK_HREF: Record<string, string> = {
  motor: '/quote/motor', marine: '/quote/marine', 'personal-accident': '/quote/personal-accident',
}

export default function CheckoutPage() {
  const { calculatedPremium, activeProduct, motorData, marineData, personalAccidentData } = useQuoteStore()
  const product = (activeProduct ?? 'motor') as string
  const basePrice = calculatedPremium ?? 50000

  const isAlwaysNsia = product === 'marine' || product === 'personal-accident'

  const selectedPlan = motorData.selectedUnderwriter
    ? MOTOR_PLANS.find(p => p.id === motorData.selectedUnderwriter)
    : null
  const planName = selectedPlan?.name ?? NSIA_PLAN_NAME[product] ?? 'Insurance Plan'
  const planInsurer = selectedPlan?.insurer ?? (isAlwaysNsia ? 'NSIA Insurance' : null)
  const planInitials = (planInsurer ?? planName).split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const planPrice = basePrice
  const processingFee = Math.round(planPrice * 0.015)
  const stampDuty = 500
  const total = planPrice + processingFee + stampDuty
  const backHref = BACK_HREF[product] ?? '/quote/result'

  const PRODUCT_LABELS: Record<string, string> = {
    motor: 'Motor Insurance', medical: 'Health Insurance',
    travel: 'Travel Insurance', business: 'Business Insurance',
    marine: 'Marine Insurance', 'personal-accident': 'Personal Accident Insurance',
  }
  const productLabel = PRODUCT_LABELS[product] ?? 'Insurance'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [startDate, setStartDate] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [payMethod, setPayMethod] = useState<PayMethod>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNetwork, setCardNetwork] = useState('Visa')
  const [mobileNumber, setMobileNumber] = useState('')
  const [orderOpen, setOrderOpen] = useState(true)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const [insurerRef, setInsurerRef] = useState<string | null>(null)
  const [insurerRefLabel, setInsurerRefLabel] = useState('Insurer ref')
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Bank transfer is a two-step Payloft flow: the first "Pay" click creates
  // the order and requests a virtual account; a second click, after the
  // customer has actually sent the money, confirms it.
  const [payloftOrderId, setPayloftOrderId] = useState<number | null>(null)
  const [transferAccount, setTransferAccount] = useState<TransferAccount | null>(null)

  function switchPayMethod(next: PayMethod) {
    setPayMethod(next)
    setPayloftOrderId(null)
    setTransferAccount(null)
    setSubmitError(null)
  }

  function formatCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  function validate() {
    const errors: Record<string, string> = {}
    if (!fullName.trim()) errors.fullName = 'Full name required'
    if (!email.includes('@')) errors.email = 'Valid email required'
    if (phone.replace(/\D/g, '').length < 11) errors.phone = 'Valid phone number required'
    if (!startDate) errors.startDate = 'Please choose a start date'
    if (payMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) errors.card = 'Enter a valid 16-digit card number'
      if (cardExpiry.length < 5) errors.expiry = 'Enter expiry MM/YY'
      if (cardCvv.length < 3) errors.cvv = 'Enter 3-digit CVV'
      if (!cardName.trim()) errors.cardName = 'Name on card required'
    }
    if (payMethod === 'mobile' && mobileNumber.replace(/\D/g, '').length < 10) {
      errors.mobile = 'Valid mobile number required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isFortisGlobal = product === 'motor' && selectedPlan?.fortisGlobal === true
  const isMotorNsia = product === 'motor' && selectedPlan?.nsia === true
  const isMotorTangerine = product === 'motor' && selectedPlan?.tangerine != null
  const isMotorAiico = product === 'motor' && selectedPlan?.aiico != null

  /** `WetDt = (WefDt + 1 year) - 1 day`, per the AIICO docs. */
  function aiicoPolicyDates() {
    const wef = startDate ? new Date(startDate) : new Date()
    const wet = new Date(wef)
    wet.setFullYear(wet.getFullYear() + 1)
    wet.setDate(wet.getDate() - 1)
    const iso = (d: Date) => d.toISOString().slice(0, 19)
    return { wefDt: iso(wef), wetDt: iso(wet) }
  }

  /** AIICO wants a bank account number / masked PAN for its finalize-payment call; we don't collect a real one for every method. */
  function maskedAccountNumber(): string {
    if (payMethod === 'card' && cardNumber) {
      const digits = cardNumber.replace(/\s/g, '')
      return digits.length >= 10 ? `${digits.slice(0, 6)}******${digits.slice(-4)}` : digits
    }
    if (payMethod === 'bank' && transferAccount) return transferAccount.accountNumber
    if (payMethod === 'mobile' && mobileNumber) return mobileNumber
    return 'N/A'
  }

  /** Sends the motor application to NSIA and returns the policy number they issue. */
  async function submitMotorToNsia(): Promise<string | null> {
    const slots = motorDocSlots(motorData).map((slot) => slot.key)
    const files = collectDocumentFiles(slots)

    const missing = motorDocSlots(motorData)
      .filter((slot) => slot.required && !files[slot.key])
      .map((slot) => slot.label)

    if (missing.length > 0) {
      // Uploads live in memory only, so a page reload can lose them.
      throw new Error(
        `Please re-upload your documents before paying: ${missing.join(', ')}.`
      )
    }

    const result = await submitNsiaApplication({
      product: 'motor',
      customer: toNsiaCustomer(motorData, { fullName, email, phone }),
      details: toNsiaMotorDetails(motorData, planPrice),
      files,
    })
    return result.policyNumber ?? result.certOrDocNo
  }

  /** Sends the motor application to Tangerine and returns the policy number they issue. */
  async function submitMotorToTangerine(): Promise<string | null> {
    const line = selectedPlan?.tangerine
    if (!line) return null

    const files = collectDocumentFiles(TANGERINE_DOCUMENT_SLOTS.map((slot) => slot.slot))
    const missing = TANGERINE_DOCUMENT_SLOTS.filter((slot) => slot.required && !files[slot.slot]).map((slot) => slot.label)
    if (missing.length > 0) {
      throw new Error(`Please re-upload your documents before paying: ${missing.join(', ')}.`)
    }

    const result = await submitTangerineApplication({
      product: line,
      customer: toTangerineCustomer(motorData, { fullName, email, phone }),
      motor: toTangerineMotor(motorData),
      files,
    })
    return result.policyNumber
  }

  /** Sends the motor application to AIICO and returns the policy number they issue. Call only after payment has been collected. */
  async function submitMotorToAiico(paymentRef: string | null): Promise<string | null> {
    const line = selectedPlan?.aiico
    if (!line) return null

    const files = collectDocumentFiles(AIICO_DOCUMENT_SLOTS.map((slot) => slot.slot))
    const missing = AIICO_DOCUMENT_SLOTS.filter((slot) => slot.required && !files[slot.slot]).map((slot) => slot.label)
    if (missing.length > 0) {
      throw new Error(`Please re-upload your documents before paying: ${missing.join(', ')}.`)
    }

    const { wefDt, wetDt } = aiicoPolicyDates()
    const result = await submitAiicoMotorApplication({
      line,
      wefDt,
      wetDt,
      customer: toAiicoCustomer(motorData, { fullName, email, phone }),
      vehicle: toAiicoVehicle(motorData),
      payment: {
        accountNumber: maskedAccountNumber(),
        amountPaid: planPrice,
        paymentRef: paymentRef ?? `SI-${Date.now()}`,
        partnerReference: `SI-${Date.now()}`,
      },
      files,
    })
    return result.policyNumber
  }

  /** Sends the marine cargo application to NSIA. */
  async function submitMarineToNsia(): Promise<string | null> {
    const slots = documentSlotsFor('marine')
    const files = collectDocumentFiles(slots.map((slot) => slot.slot))

    const missing = slots.filter((slot) => slot.required && !files[slot.slot]).map((slot) => slot.label)
    if (missing.length > 0) {
      throw new Error(`Please re-upload your documents before paying: ${missing.join(', ')}.`)
    }

    const result = await submitNsiaApplication({
      product: 'marine',
      customer: toNsiaCustomer(marineData, { fullName, email, phone }),
      details: toNsiaMarineDetails(marineData, planPrice),
      files,
    })
    return result.policyNumber ?? result.certOrDocNo
  }

  /** Sends the personal accident application to NSIA. */
  async function submitPersonalAccidentToNsia(): Promise<string | null> {
    const slots = documentSlotsFor('personal-accident')
    const files = collectDocumentFiles(slots.map((slot) => slot.slot))

    const missing = slots.filter((slot) => slot.required && !files[slot.slot]).map((slot) => slot.label)
    if (missing.length > 0) {
      throw new Error(`Please re-upload your documents before paying: ${missing.join(', ')}.`)
    }

    const result = await submitNsiaApplication({
      product: 'personal-accident',
      customer: toNsiaCustomer(personalAccidentData, { fullName, email, phone }),
      details: toNsiaPersonalAccidentDetails(personalAccidentData, planPrice),
      files,
    })
    return result.policyNumber ?? result.certOrDocNo
  }

  const NSIA_SUBMIT_FN: Record<string, () => Promise<string | null>> = {
    marine: submitMarineToNsia,
    'personal-accident': submitPersonalAccidentToNsia,
  }

  /**
   * Runs only after Payloft has actually approved the payment. A failure
   * here means the customer has been charged but has no policy — that is a
   * different, more serious problem than a declined card, so it gets its
   * own message rather than being folded into a generic "payment failed".
   */
  async function finishAfterPaymentApproved(paymentRef: string | null) {
    const insurerSubmit = isMotorNsia
      ? { fn: submitMotorToNsia, label: 'NSIA policy no' }
      : isMotorTangerine
      ? { fn: submitMotorToTangerine, label: 'Tangerine policy no' }
      : isMotorAiico
      ? { fn: () => submitMotorToAiico(paymentRef), label: 'AIICO policy no' }
      : NSIA_SUBMIT_FN[product]
      ? { fn: NSIA_SUBMIT_FN[product], label: 'NSIA policy no' }
      : null

    if (insurerSubmit) {
      try {
        const policyNumber = await insurerSubmit.fn()
        if (policyNumber) {
          setInsurerRef(policyNumber)
          setInsurerRefLabel(insurerSubmit.label)
        }
      } catch (error) {
        const detail = error instanceof Error ? error.message : 'please contact support.'
        setSubmitError(
          `Your payment was successful${paymentRef ? ` (ref ${paymentRef})` : ''}, but we could not finalise your policy: ${detail}`
        )
        return
      }
      setPaid(true)
      return
    }

    if (isFortisGlobal) {
      const apiResult = await fetch('/api/fortis/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motorData, policyHolder: { fullName, email, phone } }),
      })
        .then((r) => r.json())
        .catch(() => null)
      if (apiResult?.reference) {
        setInsurerRef(apiResult.reference)
        setInsurerRefLabel('Fortis ref')
      }
    } else if (paymentRef) {
      setInsurerRef(paymentRef)
      setInsurerRefLabel('Payment ref')
    }
    setPaid(true)
  }

  /** Card and PayAttitude both resolve in a single round trip: pay, then poll for the result. */
  async function handleDirectPay() {
    const order = await initiatePayloftOrder({
      amount: total,
      description: `${productLabel} — ${planName}`,
      returnUrl: window.location.href,
      customerName: fullName,
      email,
    })

    if (payMethod === 'card') {
      await submitPayloftPayment(order.orderId, {
        method: 'card',
        cardNumber: cardNumber.replace(/\s/g, ''),
        scheme: cardNetwork.toLowerCase(),
        expiry: cardExpiry,
        cvv: cardCvv,
      })
    } else {
      await submitPayloftPayment(order.orderId, {
        method: 'payattitude',
        mobile: mobileNumber.replace(/\D/g, ''),
      })
    }

    const result: PayloftTransactionResult = await pollPayloftResult(order.orderId)
    if (result.status !== 'APPROVED') {
      setSubmitError(paymentFailureMessage(result.status))
      return
    }
    await finishAfterPaymentApproved(result.approvalCode ?? String(result.transactionId))
  }

  /**
   * Bank transfer is two clicks: the first requests a virtual account from
   * Payloft (guide step 3a); the second — after the customer has actually
   * sent the money — confirms the credit (step 3b) and only then finishes.
   */
  async function handleBankTransferStep() {
    if (!transferAccount) {
      const order = await initiatePayloftOrder({
        amount: total,
        description: `${productLabel} — ${planName}`,
        returnUrl: window.location.href,
        customerName: fullName,
        email,
      })
      setPayloftOrderId(order.orderId)

      const result = await submitPayloftPayment(order.orderId, { method: 'transfer' })
      const data = (result as { data?: Record<string, unknown> }).data ?? result
      setTransferAccount({
        accountNumber: String(data.accountNumber ?? ''),
        bankName: String(data.bankName ?? ''),
        bankCode: String(data.bankCode ?? ''),
        amount: Number(data.amount ?? total),
        expiresAt: String(data.expiresAt ?? ''),
      })
      return
    }

    if (!payloftOrderId) {
      setSubmitError('Something went wrong with your transfer. Please restart the payment.')
      return
    }

    await confirmPayloftTransfer(payloftOrderId)
    const result = await pollPayloftResult(payloftOrderId)
    if (result.status !== 'APPROVED') {
      setSubmitError(paymentFailureMessage(result.status))
      return
    }
    await finishAfterPaymentApproved(result.approvalCode ?? String(result.transactionId))
  }

  async function handlePay() {
    if (!validate()) return
    setSubmitError(null)
    setPaying(true)
    try {
      if (payMethod === 'bank') await handleBankTransferStep()
      else await handleDirectPay()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not complete your payment. Please try again.'
      )
    } finally {
      setPaying(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center px-4 lg:px-8 h-14 max-w-[1200px] mx-auto">
          <Logo size={28} href="/" />
          <div className="flex-1 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5" style={{ color: 'var(--green-700)' }} />
            <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>Secure Checkout</span>
          </div>
          <Link href={backHref} className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors" title="Back to plans">
            <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          <div className="flex flex-col gap-5">
            <Link href={backHref} className="flex items-center gap-1.5 font-sans text-sm w-fit hover:underline" style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft className="w-4 h-4" /> Back to plans
            </Link>

            <div className="bg-white rounded-3xl border p-6 lg:p-8" style={{ borderColor: 'var(--border-default)' }}>
              <h2 className="font-display font-bold text-xl mb-5" style={{ color: 'var(--text-primary)' }}>Policyholder details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Emeka Okafor"
                    className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
                    style={{ borderColor: formErrors.fullName ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                  />
                  {formErrors.fullName && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.fullName}</p>}
                </div>
                <div>
                  <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
                    style={{ borderColor: formErrors.email ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                  />
                  {formErrors.email && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.email}</p>}
                </div>
                <div>
                  <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="080XXXXXXXX"
                    className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
                    style={{ borderColor: formErrors.phone ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                  />
                  {formErrors.phone && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Policy start date</label>
                  <input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)}
                    className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
                    style={{ borderColor: formErrors.startDate ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                  />
                  {formErrors.startDate && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.startDate}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border p-6 lg:p-8" style={{ borderColor: 'var(--border-default)' }}>
              <h2 className="font-display font-bold text-xl mb-5" style={{ color: 'var(--text-primary)' }}>Payment method</h2>
              <div className="flex gap-2 mb-5">
                {([
                  { key: 'card', icon: CreditCard, label: 'Card' },
                  { key: 'bank', icon: Building2, label: 'Bank transfer' },
                  { key: 'mobile', icon: Smartphone, label: 'Mobile (PayAttitude)' },
                ] as { key: PayMethod; icon: React.ElementType; label: string }[]).map(({ key, icon: Icon, label }) => (
                  <button key={key} type="button" onClick={() => switchPayMethod(key)}
                    className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border-[1.5px] transition-all font-sans text-[12px] font-medium"
                    style={payMethod === key
                      ? { borderColor: 'var(--green-700)', backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }
                      : { borderColor: 'var(--border-default)', backgroundColor: 'white', color: 'var(--text-secondary)' }
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {payMethod === 'card' && (
                  <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      {CARD_NETWORKS.map(n => (
                        <button key={n} type="button" onClick={() => setCardNetwork(n)}
                          className="flex-1 h-9 rounded-xl border-[1.5px] font-sans text-[12px] font-semibold transition-all"
                          style={cardNetwork === n
                            ? { borderColor: 'var(--green-700)', backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }
                            : { borderColor: 'var(--border-default)', color: 'var(--text-muted)' }
                          }
                        >{n}</button>
                      ))}
                    </div>
                    <div>
                      <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Card number</label>
                      <input type="text" inputMode="numeric" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="0000 0000 0000 0000"
                        className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none tracking-wider"
                        style={{ borderColor: formErrors.card ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                      />
                      {formErrors.card && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.card}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Expiry date</label>
                        <input type="text" inputMode="numeric" value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                          className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                          style={{ borderColor: formErrors.expiry ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                        />
                        {formErrors.expiry && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.expiry}</p>}
                      </div>
                      <div>
                        <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>CVV</label>
                        <input type="password" inputMode="numeric" maxLength={4} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••"
                          className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                          style={{ borderColor: formErrors.cvv ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                        />
                        {formErrors.cvv && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.cvv}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name on card</label>
                      <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="As it appears on the card"
                        className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                        style={{ borderColor: formErrors.cardName ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                      />
                      {formErrors.cardName && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.cardName}</p>}
                    </div>
                  </motion.div>
                )}

                {payMethod === 'bank' && (
                  <motion.div key="bank" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                    {!transferAccount ? (
                      <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        Click <strong style={{ color: 'var(--text-primary)' }}>Get transfer details</strong> below to generate a unique virtual account for this payment of <strong style={{ color: 'var(--text-primary)' }}>{formatNaira(total)}</strong>.
                      </p>
                    ) : (
                      <>
                        <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
                          Transfer exactly <strong style={{ color: 'var(--text-primary)' }}>{formatNaira(transferAccount.amount)}</strong> to the account below, then confirm you've sent it.
                        </p>
                        <div className="rounded-2xl p-5 space-y-3" style={{ backgroundColor: 'var(--green-50)', border: '1.5px solid var(--green-100)' }}>
                          {[
                            { label: 'Bank', value: transferAccount.bankName },
                            { label: 'Account number', value: transferAccount.accountNumber },
                            { label: 'Amount', value: formatNaira(transferAccount.amount) },
                            { label: 'Expires', value: transferAccount.expiresAt },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between">
                              <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                              <span className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{value}</span>
                            </div>
                          ))}
                        </div>
                        <p className="font-sans text-[11px] mt-3 text-center" style={{ color: 'var(--text-subtle)' }}>
                          This is a sandbox virtual account — no real funds move.
                        </p>
                      </>
                    )}
                  </motion.div>
                )}

                {payMethod === 'mobile' && (
                  <motion.div key="mobile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                    <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
                      Pay with the mobile number linked to your PayAttitude wallet.
                    </p>
                    <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Mobile number</label>
                    <input type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="080XXXXXXXX"
                      className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                      style={{ borderColor: formErrors.mobile ? 'var(--error)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                    />
                    {formErrors.mobile && <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--error)' }}>{formErrors.mobile}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-[4.5rem]">
            <div className="bg-white rounded-3xl border p-5" style={{ borderColor: 'var(--border-default)' }}>
              <button type="button" onClick={() => setOrderOpen(o => !o)} className="flex items-center justify-between w-full mb-0">
                <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>Order summary</h3>
                {orderOpen ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </button>

              <AnimatePresence>
                {orderOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                    <div className="flex items-center gap-3 mt-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--green-50)' }}>
                        <span className="font-display font-bold text-[14px]" style={{ color: 'var(--green-700)' }}>{planInitials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-semibold text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>{planName}</p>
                        <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{productLabel} · Annual</p>
                      </div>
                    </div>
                    <div className="py-4 flex flex-col gap-3">
                      {[
                        { label: 'Annual premium', value: planPrice },
                        { label: 'Processing fee (1.5%)', value: processingFee },
                        { label: 'Stamp duty', value: stampDuty },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between">
                          <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                          <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(value)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                      <span className="font-display font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>Total due today</span>
                      <span className="font-display font-extrabold text-[18px]" style={{ color: 'var(--green-700)' }}>{formatNaira(total)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-3xl border p-5" style={{ borderColor: 'var(--border-default)' }}>
              <p className="font-sans font-bold text-[11px] uppercase tracking-[0.07em] mb-3" style={{ color: 'var(--text-subtle)' }}>What you get</p>
              <div className="flex flex-col gap-2.5">
                {['Instant digital certificate via email & SMS', 'NIID auto-registration (motor)', 'Dedicated claims WhatsApp line', '24/7 emergency support', 'NAICOM-regulated insurer'].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--green-50)' }}>
                      <Check className="w-2.5 h-2.5" style={{ color: 'var(--green-700)' }} strokeWidth={3} />
                    </div>
                    <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button type="button" onClick={handlePay} disabled={paying}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full h-14 rounded-2xl font-display font-bold text-[16px] text-white flex items-center justify-center gap-2 relative overflow-hidden transition-opacity disabled:opacity-70"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              {paying ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : payMethod === 'bank' && transferAccount ? (
                <><Lock className="w-4 h-4" /> I've sent the transfer</>
              ) : payMethod === 'bank' ? (
                <><Lock className="w-4 h-4" /> Get transfer details</>
              ) : (
                <><Lock className="w-4 h-4" /> Pay {formatNaira(total)} securely</>
              )}
            </motion.button>

            {submitError && (
              <div
                role="alert"
                className="rounded-2xl border px-4 py-3 -mt-1"
                style={{ borderColor: 'var(--error)', backgroundColor: '#FEF2F2' }}
              >
                <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--error)' }}>
                  We could not issue your policy
                </p>
                <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {submitError} You have not been charged.
                </p>
              </div>
            )}

            {planInsurer && (
              <div className="flex items-center justify-center gap-1.5 -mt-1">
                <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--green-700)' }} />
                <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  Underwritten by <strong>{planInsurer}</strong> · NAICOM-licensed insurer
                </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              {[{ icon: Lock, label: '256-bit SSL' }, { icon: Shield, label: 'NAICOM' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-subtle)' }} />
                  <span className="font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>{label}</span>
                </div>
              ))}
            </div>

            <p className="font-sans text-[11px] text-center" style={{ color: 'var(--text-subtle)' }}>
              By paying you agree to our{' '}
              <Link href="/terms" className="underline">Terms</Link> &amp;{' '}
              <Link href="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {paid && <PaymentSuccess onClose={() => setPaid(false)} planName={planName} total={total} productLabel={productLabel} insurerRef={insurerRef} insurerRefLabel={insurerRefLabel} />}
      </AnimatePresence>
    </div>
  )
}
