import { Smartphone, Zap, Shield, Bell, CheckCircle } from 'lucide-react'

const FEATURES = [
  { icon: Zap,     text: 'Get quotes & buy cover in under 3 minutes' },
  { icon: Shield,  text: 'Instant digital certificate — valid nationwide' },
  { icon: Bell,    text: 'Renewal reminders & real-time claims updates' },
]

export default function AppDownloadSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: 'var(--green-900)' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Mobile App — Coming Soon
            </p>
            <h2 className="font-display font-extrabold text-[32px] md:text-[42px] leading-tight tracking-tight text-white mb-5">
              Insurance in your pocket,{' '}
              <span style={{ color: 'var(--green-400)' }}>always accessible</span>
            </h2>
            <p className="font-sans text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Join 50,000+ Nigerians managing their policies on the go.
              Available on iOS and Android — free forever.
            </p>

            <div className="space-y-4 mb-10">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Icon className="w-4 h-4" style={{ color: 'var(--green-400)' }} />
                  </div>
                  <p className="font-sans text-[14px]" style={{ color: 'rgba(255,255,255,0.8)' }}>{text}</p>
                </div>
              ))}
            </div>

            {/* App store badges */}
            <div className="flex flex-wrap gap-3">
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-2xl cursor-pointer transition-all hover:opacity-90 border"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="font-sans text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Download on the</p>
                  <p className="font-sans font-bold text-[13px] text-white">App Store</p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 px-5 py-3 rounded-2xl cursor-pointer transition-all hover:opacity-90 border"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M3.18 23.76a2 2 0 0 0 2.07-.14l11.17-6.45-2.83-2.83-10.41 9.42zm15.16-8.75L4.59 7.59 3.18.24A2 2 0 0 0 1.11 2v20a2 2 0 0 0 2.07 1.76l.14-.12 15.02-8.63zm1.48-.86L16.55 12l2.27-2.15 3.13 1.81a2 2 0 0 1 0 3.48l-3.13 1.81zM4.59 16.41l13.75-7.93-2.83-2.83L4.59 16.41z"/>
                </svg>
                <div>
                  <p className="font-sans text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Get it on</p>
                  <p className="font-sans font-bold text-[13px] text-white">Google Play</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-sans text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <span className="font-bold text-white">50,000+</span> active policyholders · rated 4.8/5
              </p>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="relative flex justify-center md:justify-end">
            <div
              className="w-[220px] h-[440px] rounded-[40px] border-4 shadow-2xl relative overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: '#0A1628' }}
            >
              {/* Status bar */}
              <div className="h-8 flex items-center justify-between px-5 pt-1">
                <span className="font-sans font-semibold text-[10px] text-white/60">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1.5 rounded-sm bg-white/60" />
                  <div className="w-3 h-1.5 rounded-sm bg-white/40" />
                  <div className="w-3 h-1.5 rounded-sm bg-white/40" />
                </div>
              </div>

              {/* App header */}
              <div className="px-4 pt-3 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: 'var(--green-600)' }} />
                  <span className="font-display font-bold text-[12px] text-white">ShopInsurance</span>
                </div>
                <p className="font-sans text-[10px] text-white/50">Good morning, Emeka</p>
                <p className="font-display font-bold text-[16px] text-white mt-0.5">3 Active Policies</p>
              </div>

              {/* Policy cards */}
              <div className="px-3 space-y-2">
                {[
                  { label: 'Motor Insurance', val: '₦45K/yr', color: '#1D4ED8', status: 'Active' },
                  { label: 'Medical Plan',    val: '₦72K/yr', color: '#059669', status: 'Active' },
                  { label: 'Travel Cover',    val: '₦12K',    color: '#D97706', status: 'Expiring' },
                ].map(({ label, val, color, status }) => (
                  <div key={label} className="rounded-2xl px-3 py-2.5" style={{ backgroundColor: `${color}22` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-sans font-semibold text-[9px] text-white/70">{label}</p>
                        <p className="font-display font-bold text-[13px] text-white">{val}</p>
                      </div>
                      <span
                        className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: status === 'Active' ? '#22c55e22' : '#f59e0b22', color: status === 'Active' ? '#22c55e' : '#f59e0b' }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom tab bar */}
              <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-around px-2" style={{ backgroundColor: '#0f1f38', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[Smartphone, Shield, Zap, Bell].map((Icon, i) => (
                  <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-[var(--green-700)]' : ''}`}>
                    <Icon className="w-3.5 h-3.5" style={{ color: i === 0 ? 'white' : 'rgba(255,255,255,0.4)' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating notification */}
            <div
              className="absolute top-12 -left-4 md:left-4 rounded-2xl px-4 py-3 shadow-xl max-w-[150px]"
              style={{ backgroundColor: 'white' }}
            >
              <p className="font-sans font-bold text-[10px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}><CheckCircle className="w-3 h-3 text-green-600" /> Claim Approved</p>
              <p className="font-sans text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>₦320,000 — Motor claim settled</p>
            </div>

            {/* Floating badge */}
            <div
              className="absolute bottom-20 -right-2 md:-right-4 rounded-2xl px-4 py-3 shadow-xl"
              style={{ backgroundColor: 'white' }}
            >
              <p className="font-sans font-bold text-[10px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}><Bell className="w-3 h-3 text-amber-500" /> Renew in 14 days</p>
              <p className="font-sans text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Motor · Leadway Assurance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
