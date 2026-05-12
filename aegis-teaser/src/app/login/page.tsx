'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'
import ParticleField from '@/components/ParticleField'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [bypassLoading, setBypassLoading] = useState(false)
  const router = useRouter()

  const handleGitHubLogin = () => {
    setLoading(true)
    // Simulate GitHub OAuth
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const handleBypassLogin = () => {
    setBypassLoading(true)
    // Direct bypass
    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }

  return (
    <div className={styles.container}>
      <div className={styles.particles}>
        <ParticleField />
      </div>

      <div className={styles.glow} />

      <Link href="/" className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Home
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(220,38,38,0.3)"/>
              <path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1" strokeOpacity="0.6"/>
            </svg>
          </div>
          <h1 className={styles.title}>Welcome to AEGIS</h1>
          <p className={styles.subtitle}>Enter the new era of secure development</p>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.githubBtn} 
            onClick={handleGitHubLogin}
            disabled={loading || bypassLoading}
          >
            {loading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button 
            className={styles.bypassBtn} 
            onClick={handleBypassLogin}
            disabled={loading || bypassLoading}
          >
            {bypassLoading ? (
              <div className={styles.spinner} />
            ) : (
              'Login Bypass (Developer Demo)'
            )}
          </button>
        </div>

        <div className={styles.footer}>
          <p>By logging in, you agree to our Terms of Service and Privacy Policy.</p>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            System Status: All Systems Operational
          </div>
        </div>
      </div>
    </div>
  )
}
