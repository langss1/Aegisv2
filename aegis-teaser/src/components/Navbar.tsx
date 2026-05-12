'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <div className={styles.left}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(255,0,0,0.4)"/>
                </svg>
              </div>
              <span className={styles.logoText}>Aegis</span>
            </Link>
        </div>

        <ul className={styles.navLinks}>
          <li><a href="#platform">Platform</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#engine">AI Engine</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#docs">Docs</a></li>
        </ul>

        <div className={styles.navActions}>
          <Link href="/login" className={styles.loginBtn}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}
