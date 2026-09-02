'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Loader2, CheckCircle2, CreditCard, AlertCircle } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import { initiatePayloftOrder, pollPayloftResult, submitPayloftPayment } from '@/lib/payloft/browser'
import type { AiicoLifePolicyRenewalDetails } from '@/lib/aiico/types'

type Step = 'lookup' | 'review' | 'pay' | 'done'

const CARD_NETWORKS = ['Visa', 'Mastercard', 'Verve']

function formatCard(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

/** AIICO's own `amount` fields are numeric strings ("11000") — fall back to the raw text if a field ever isn't. */
function money(raw: string): string {
  const n = Number(raw)
  return Number.isFinite(n) && raw.trim() !== '' ? formatNaira(n) : raw
}

function paymentFailureMessage(status: string): string {
  switch (status) {
    case 'DECLINED': return 'Your payment was declined. Please check your card details or try again.'
    case 'INSUFFICIENT_FUNDS': return 'Payment failed: insufficient funds.'
    case 'TIMEOUT': return 'The payment timed out. Please try again.'
    case 'FRAUD_BLOCK': return 'This payment was blocked for security reasons. Please contact support.'
    default: return `Payment was not approved (status: ${status}).`
  }
}

export default function LifeRenewalPage() {
  const [step, setStep] = useState<Step>('lookup')
  const [policyNo, setPolicyNo] = useState('')
  const [looking, setLooking] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [details, setDetails] = useState<AiicoLifePolicyRenewalDetails | null>(null)

  const [amount, setAmount] = useState('')
  const [cardNetwork, setCardNetwork] = useState('Visa')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  const [confirmedPolicyNo, setConfirmedPolicyNo] = useState<string | null>(null)
  const [transactionRef, setTransactionRef] = useState<string | null>(null)
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null)

  async function lookupPolicy(e: FormEvent) {
    e.preventDefault()
    if (!policyNo.trim()) return
    setLooking(true)
    setLookupError(null)
    try {
      const res = await fetch(`/api/aiico/life-renewal?policyNo=${encodeURIComponent(policyNo.trim())}`)
      const body = await res.json().catch(() => null)
      if (!res.ok || body?.success === false) {
        throw new Error(body?.error ?? `We couldn't find that policy (${res.status}).`)
      }
      const data = body.data as AiicoLifePolicyRenewalDetails
      setDetails(data)
      setAmount(data.nextInstallmentPremium || data.totalPremium || '')
      setStep('review')
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLooking(false)
    }
  }

  async function payRenewal() {
    if (!details) return
    const amountPaid = Number(amount)
    if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
      setPayError('Enter a valid amount.')
      return
    }
    if (cardNumber.replace(/\s/g, '').length < 16) return setPayError('Enter a valid 16-digit card number.')
    if (cardExpiry.length < 5) return setPayError('Enter the card expiry as MM/YY.')
    if (cardCvv.length < 3) return setPayError('Enter the 3-digit CVV.')

    setPaying(true)
    setPayError(null)
    try {
      const order = await initiatePayloftOrder({
        amount: amountPaid,
        description: `Life policy renewal – ${details.policyNumber}`,
        returnUrl: typeof window !== 'undefined' ? window.location.href : '',
        customerName: details.clientName,
        email: details.email,
      })

      await submitPayloftPayment(order.orderId, {
        method: 'card',
        cardNumber: cardNumber.replace(/\s/g, ''),
        scheme: cardNetwork.toLowerCase(),
        expiry: cardExpiry,
        cvv: cardCvv,
      })

      const result = await pollPayloftResult(order.orderId)
      if (result.status !== 'APPROVED') {
        setPayError(paymentFailureMessage(result.status))
        return
      }

      const digits = cardNumber.replace(/\s/g, '')
      const maskedAccountNumber = digits.length >= 4 ? `${cardNetwork}-****${digits.slice(-4)}` : `${cardNetwork}-CARD`
      const today = new Date()
      const transactionDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`

      const submitRes = await fetch('/api/aiico/submit/life-renewal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyNo: details.policyNumber,
          transactionDate,
          customerName: details.clientName,
          email: details.email,
          phone: details.phone,
          amount: amountPaid,
          payment: {
            accountNumber: maskedAccountNumber,
            amountPaid,
            paymentRef: order.referenceId,
            partnerReference: `SI-${Date.now()}`,
          },
        }),
      })
      const submitBody = await submitRes.json().catch(() => null)
      if (!submitRes.ok || submitBody?.success === false) {
        throw new Error(submitBody?.error ?? 'Payment succeeded but we could not finalize the renewal with AIICO. Please contact support with your payment reference.')
      }

      setConfirmedPolicyNo(submitBody.policyNumber ?? details.policyNumber)
      setTransactionRef(submitBody.transactionRef ?? null)
      setCertificateUrl(submitBody.certificateUrl ?? null)
      setStep('done')
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[640px] mx-auto">
      <Link href="/renewals" className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back to renewals
      </Link>

      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Renew a life insurance policy
        </h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Look up your AIICO life policy by number to see what&apos;s due.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'lookup' && (
          <motion.form
            key="lookup"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            onSubmit={lookupPolicy}
            className="bg-white rounded-2xl border p-5" style={{ borderColor: 'var(--border-default)' }}
          >
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Policy number</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={policyNo}
                onChange={(e) => setPolicyNo(e.target.value)}
                placeholder="e.g. NCSP/IB/2017/077067"
                className="w-full h-11 pl-10 pr-4 rounded-xl border font-sans text-[14px] outline-none"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              />
            </div>
            {lookupError && (
              <p className="font-sans text-[12px] mt-2 flex items-center gap-1.5" style={{ color: 'var(--error)' }}>
                <AlertCircle className="w-3.5 h-3.5" /> {lookupError}
              </p>
            )}
            <button
              type="submit"
              disabled={looking || !policyNo.trim()}
              className="mt-4 w-full h-11 rounded-xl font-sans font-semibold text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              {looking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {looking ? 'Looking up…' : 'Find my policy'}
            </button>
          </motion.form>
        )}

        {step === 'review' && details && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-white rounded-2xl border p-5" style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{details.productName}</p>
                <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{details.policyNumber}</p>
              </div>
              <span
                className="px-2.5 py-1 rounded-full font-sans font-semibold text-[11px]"
                style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}
              >
                {details.policyStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <Field label="Policyholder" value={details.clientName} />
              <Field label="Agent" value={details.agentName} />
              <Field label="Effective date" value={details.effectiveDate} />
              <Field label="Paid to date" value={details.paidToDate} />
              <Field label="Maturity date" value={details.maturityDate} />
              <Field label="Payment frequency" value={details.paymentFrequency} />
              <Field label="Total premium" value={money(details.totalPremium)} />
              <Field label="Total savings" value={money(details.totalSavings)} />
            </div>

            <div className="rounded-xl p-4 mb-4 flex items-center justify-between" style={{ backgroundColor: 'var(--green-50)' }}>
              <p className="font-sans font-medium text-[13px]" style={{ color: 'var(--green-700)' }}>Next installment due</p>
              <p className="font-display font-bold text-[18px]" style={{ color: 'var(--green-700)' }}>{money(details.nextInstallmentPremium)}</p>
            </div>

            <button
              onClick={() => setStep('pay')}
              className="w-full h-11 rounded-xl font-sans font-semibold text-[14px] text-white"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Proceed to pay
            </button>
          </motion.div>
        )}

        {step === 'pay' && details && (
          <motion.div
            key="pay"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-white rounded-2xl border p-5" style={{ borderColor: 'var(--border-default)' }}
          >
            <p className="font-sans font-semibold text-[14px] mb-4" style={{ color: 'var(--text-primary)' }}>
              Pay renewal for {details.policyNumber}
            </p>

            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Amount to pay (₦)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border font-sans text-[14px] outline-none mb-4"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
            />

            <div className="flex gap-2 mb-4">
              {CARD_NETWORKS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCardNetwork(n)}
                  className="flex-1 h-9 rounded-lg border font-sans text-[12px] font-medium"
                  style={cardNetwork === n
                    ? { borderColor: 'var(--green-700)', backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }
                    : { borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
                >{n}</button>
              ))}
            </div>

            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Card number</label>
            <input
              type="text" inputMode="numeric" value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="w-full h-11 px-4 rounded-xl border font-sans text-[14px] outline-none mb-4"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Expiry (MM/YY)</label>
                <input
                  type="text" inputMode="numeric" value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full h-11 px-4 rounded-xl border font-sans text-[14px] outline-none"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>CVV</label>
                <input
                  type="text" inputMode="numeric" value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  className="w-full h-11 px-4 rounded-xl border font-sans text-[14px] outline-none"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {payError && (
              <p className="font-sans text-[12px] mb-3 flex items-center gap-1.5" style={{ color: 'var(--error)' }}>
                <AlertCircle className="w-3.5 h-3.5" /> {payError}
              </p>
            )}

            <button
              onClick={payRenewal}
              disabled={paying}
              className="w-full h-11 rounded-xl font-sans font-semibold text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {paying ? 'Processing…' : `Pay ${money(amount || '0')}`}
            </button>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border p-6 text-center" style={{ borderColor: 'var(--green-100)' }}
          >
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--green-700)' }} />
            <p className="font-display font-bold text-[18px] mb-1" style={{ color: 'var(--text-primary)' }}>Renewal successful</p>
            <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
              Policy {confirmedPolicyNo} has been renewed.
            </p>
            {transactionRef && (
              <p className="font-sans text-[12px] mb-1" style={{ color: 'var(--text-muted)' }}>Transaction ref: {transactionRef}</p>
            )}
            {certificateUrl && (
              <a href={certificateUrl} target="_blank" rel="noopener noreferrer" className="font-sans text-[13px] font-medium underline" style={{ color: 'var(--green-700)' }}>
                View certificate
              </a>
            )}
            <Link
              href="/renewals"
              className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Back to renewals
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-[11px]" style={{ color: 'var(--text-subtle)' }}>{label}</p>
      <p className="font-sans text-[13px] font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{value || '—'}</p>
    </div>
  )
}
