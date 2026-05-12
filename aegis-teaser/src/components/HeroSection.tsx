'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

const WORDS = ['Secure', 'Trusted', 'Protected', 'Defended', 'Resilient']

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const orbRef = useRef<HTMLDivElement>(null)

  // Typewriter effect
  useEffect(() => {
    const word = WORDS[wordIndex]
    let i = typing ? displayed.length : displayed.length
    let timeout: ReturnType<typeof setTimeout>

    if (typing) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
      } else {
        timeout = setTimeout(() => setTyping(false), 1800)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
      } else {
        setWordIndex((wordIndex + 1) % WORDS.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, wordIndex])

  // Mouse parallax orb
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className={styles.hero}>
      {/* Background glow orbs */}
      <div className={styles.orbContainer} ref={orbRef}>
        <div className={styles.orbPrimary} />
        <div className={styles.orbSecondary} />
        <div className={styles.orbTertiary} />
      </div>

      {/* Shield decoration */}
      <div className={styles.shieldDeco}>
        <svg className={styles.shieldSvg} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10L20 45v80c0 55 80 100 80 100s80-45 80-100V45L100 10z" 
            stroke="url(#shieldGrad)" strokeWidth="1.5" fill="none" opacity="0.4"/>
          <path d="M100 30L35 60v65c0 45 65 82 65 82s65-37 65-82V60L100 30z" 
            stroke="url(#shieldGrad)" strokeWidth="1" fill="rgba(220,38,38,0.05)" opacity="0.6"/>
          <defs>
            <linearGradient id="shieldGrad" x1="20" y1="10" x2="180" y2="240">
              <stop offset="0%" stopColor="#dc2626"/>
              <stop offset="100%" stopColor="#f472b6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className={styles.gradientBg} />

      <div className={styles.content}>
        {/* Headline */}
        <h1 className={styles.headline}>
          A New Way to <br /> Build <br />
          <span className="gradient-text">{displayed}</span> <br />
          Software
        </h1>

        {/* Subtext */}
        <p className={styles.subtext}>
          AEGIS adalah platform keamanan berbasis AI yang menganalisis, menyerang, dan memantau kode Anda secara otomatis — 
          sehingga developer bisa fokus membangun, tanpa mengorbankan keamanan.
        </p>

        {/* CTA buttons */}
        <div className={styles.actions}>
          <a href="#demo" className="btn-primary" id="hero-watch-demo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
              <path d="M10 8l6 4-6 4V8z" fill="white"/>
            </svg>
            Watch Demo
          </a>
          <Link href="/login" className="btn-outline" id="hero-early-access">
            Get Early Access
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          {[
            { val: '98%', label: 'Vulnerability Detection Rate' },
            { val: '10x', label: 'Faster Security Review' },
            { val: '3', label: 'Security Phases Automated' },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}
