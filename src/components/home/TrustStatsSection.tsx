import s from './homepage.module.css'
// Product facts, not unverified customer, sales, rating or claims statistics.
const facts = [
  ['4', 'Types of cover'],
  ['3 steps', 'Details, compare, buy'],
  ['1 place', 'Your policy dashboard'],
  ['Your choice', 'Cover that fits you'],
]
export default function TrustStatsSection() {
  return (
    <section className={s.trust}>
      <div className={s.container}>
        <div>
          <p className={s.eyebrow}>Built around you</p>
          <h2>
            Your trust isn’t assumed,
            <br />
            it’s earned.
          </h2>
        </div>
        <div className={s.trustFacts}>
          {facts.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
