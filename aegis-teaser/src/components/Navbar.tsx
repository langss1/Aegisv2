'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(220,38,38,0.3)"/>
              <path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1" strokeOpacity="0.6"/>
            </svg>
          </div>
          <span className={styles.logoText}>AEGIS</span>
        </a>

        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><a href="#demo" onClick={() => setMenuOpen(false)}>Demo</a></li>
          <li><a href="#why" onClick={() => setMenuOpen(false)}>Why AEGIS</a></li>
          <li><a href="#for-who" onClick={() => setMenuOpen(false)}>For Who</a></li>
          <li><a href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</a></li>
        </ul>

        <div className={styles.navActions}>
          <Link href="/login" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} id="nav-login-btn">
            Get Early Access
          </Link>
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}
