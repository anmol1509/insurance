import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import s from './homepage.module.css'
const questions = [
  [
    'Who provides my insurance cover?',
    'Your selected insurer provides the cover. Review the insurer’s name, policy wording, exclusions and terms before you buy. Contact our team if you need help understanding a plan.',
  ],
  [
    'When will I get my insurance documents?',
    'Timing depends on your insurer, product and any required checks. After purchase, check your dashboard for policy documents and contact support if you need help.',
  ],
  [
    'Can I compare quotes from multiple insurers?',
    'Yes. Complete the quote form to see the available plans for your details. Compare the price, cover, exclusions and benefits before choosing.',
  ],
  [
    'What payment methods can I use?',
    'The checkout shows the payment methods available for your selected policy. Follow the instructions shown there to complete your purchase.',
  ],
  [
    'How do I file a claim?',
    'Choose “Start a Claim” and provide the incident details and supporting documents requested. Your policy terms explain the cover, exclusions and any reporting deadlines.',
  ],
  [
    'Can I buy insurance for someone else?',
    'This depends on the product and insurer. Enter the correct details for the person or property being insured, and contact support if you are unsure.',
  ],
  [
    'What happens when I need to renew my policy?',
    'Visit the renewal page or check your policies in your dashboard. Review the cover and current terms before completing your renewal.',
  ],
]
export default function FAQSection() {
  return (
    <section id="faqs" className={s.faq}>
      <div className={s.container}>
        <div>
          <p className={s.eyebrow}>FAQ</p>
          <h2>
            Everything you
            <br />
            need to know.
          </h2>
          <p>
            Got questions? We’ve got answers.
            <br />
            If you can’t find what you’re looking for, our support team is here
            to help.
          </p>
          <Link href="/contact" className={s.textButton}>
            Visit Help Centre <ArrowRight size={14} />
          </Link>
        </div>
        <div className={s.questions}>
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={17} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
