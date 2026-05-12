'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './CTASection.module.css'

export default function CTASection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  }

  return (
    <section id="cta" className={styles.section}>
      <div className={styles.bgGlow} />

      <div className="container">
        <div className={styles.wrapper}>
          {/* Decorative ring */}
          <div className={styles.ringOuter} />
          <div className={styles.ringInner} />

          <div className={styles.content}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Coming Soon · Join Waitlist
            </div>

            <h2 className={styles.title}>
              Build More Secure,<br />
              <span className="gradient-text">Ship More Confident.</span>
            </h2>

            <p className={styles.desc}>
              Jadilah yang pertama menggunakan AEGIS ketika kami meluncur. Dapatkan akses early, priority onboarding, 
              dan harga spesial untuk supporter awal. Security masa depan dimulai hari ini.
            </p>

            {/* Stats */}
            <div className={styles.miniStats}>
              {[
                { val: '500+', label: 'Waitlist' },
                { val: 'Free', label: 'Open Source' },
                { val: 'Beta', label: 'Q3 2025' },
              ].map((s) => (
                <div key={s.label} className={styles.miniStat}>
                  <span className={styles.miniVal}>{s.val}</span>
                  <span className={styles.miniLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className={styles.form} id="cta-email-form">
                <div className={styles.inputWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.inputIcon}>
                    <path d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="rgba(248,113,113,0.6)" strokeWidth="1.5"/>
                  </svg>
                  <input
                    id="cta-email-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" id="cta-submit">
                  Try Now — It's Free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </form>
            ) : (
              <div className={styles.successMsg}>
                <span className={styles.successIcon}>✅</span>
                <div>
                  <div className={styles.successTitle}>You&apos;re on the list!</div>
                  <div className={styles.successDesc}>Kami akan mengirimkan email ke <strong>{email}</strong> saat AEGIS siap.</div>
                </div>
              </div>
            )}

            <div className={styles.trust}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="rgba(248,113,113,0.5)" strokeWidth="1.5"/>
              </svg>
              No spam. No credit card. Open-source first.
            </div>
          </div>
        </div>

        {/* Bottom features strip */}
        <div className={styles.featureStrip}>
          {[
            { icon: '🔓', text: 'Open Source' },
            { icon: '🇮🇩', text: 'Made in Indonesia' },
            { icon: '🤖', text: 'AI-Powered' },
            { icon: '⚡', text: 'Real-time Analysis' },
            { icon: '🛡️', text: 'UU PDP Compliant' },
            { icon: '🌐', text: 'Multi-language Support' },
          ].map((f) => (
            <div key={f.text} className={styles.featureItem}>
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
