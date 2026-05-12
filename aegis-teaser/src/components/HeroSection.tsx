'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

const WORDS = ['Secure', 'Trusted', 'Protected', 'Defended', 'Resilient']

export default function HeroSection({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const fullText = 'The next-gen security agent platform.'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsDone(true)
          onComplete()
        }, 500)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Autonomous AI Security
          </div>
          
          <h1 className={styles.headline}>
            {text}<span className={styles.cursor}>|</span>
          </h1>

          <div className={`${styles.revealContent} ${isDone ? styles.visible : ''}`}>
            <p className={styles.subtext}>
              Experience the future of DevSecOps. AEGIS analyzes, attacks, and monitors your code automatically.
            </p>

            <div className={styles.actions}>
              <Link href="/login" className="btn-primary">
                Get Started
              </Link>
              <a href="#demo" className="btn-outline">
                View Documentation
              </a>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statVal}>98%</span>
                <span className={styles.statLabel}>Detection</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statVal}>10x</span>
                <span className={styles.statLabel}>Faster</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.visual} ${isDone ? styles.visible : ''}`}>
           {/* Minimal Security Visual */}
           <div className={styles.shieldWrapper}>
              <svg width="400" height="400" viewBox="0 0 24 24" fill="none" className={styles.shieldSvg}>
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" stroke="#0f172a" strokeWidth="0.5" strokeOpacity="0.1"/>
                <circle cx="12" cy="12" r="8" stroke="#dc2626" strokeWidth="0.5" strokeOpacity="0.2" className={styles.pulseCircle}/>
              </svg>
           </div>
        </div>
      </div>
    </section>
  )
}
