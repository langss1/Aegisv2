'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase2.module.css'

export default function Phase2Page() {
  const [log, setLog] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const attackSteps = [
    '[AGENT] Initializing AEGIS Attack Module...',
    '[SCAN] Reconnaissance on target application...',
    '[ATTACK] Testing SQL Injection on /api/users...',
    '[RESULT] Target sanitized. Injection failed (SAST patch confirmed).',
    '[ATTACK] Attempting XSS injection on /search...',
    '[RESULT] Vulnerability found! Payload reflected in DOM.',
    '[ATTACK] Bruteforce simulation on /login...',
    '[SCAN] Rate limiting detected. Attack throttled.',
    '[INFO] Pentest phase complete. Compiling dynamic results...'
  ]

  useEffect(() => {
    let step = 0
    const interval = setInterval(() => {
      if (step < attackSteps.length) {
        setLog(prev => [...prev, attackSteps[step]])
        setProgress(Math.min(100, (step + 1) * (100 / attackSteps.length)))
        step++
      } else {
        clearInterval(interval)
        setTimeout(() => router.push('/phases/review-pentest'), 2000)
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [router])

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div className={styles.badge}>Phase 2</div>
        <h1 className={styles.title}>Active Pentest (DAST)</h1>
        <p className={styles.subtitle}>Simulating real-world attacks to verify defense efficiency and find dynamic vulnerabilities.</p>
      </header>

      <div className={styles.pentestView}>
        <div className={styles.visualizer}>
          <div className={styles.agentBox}>
            <div className={styles.agentIcon}>🤖</div>
            <span>AEGIS AGENT</span>
          </div>
          <div className={styles.bridge}>
            <div className={styles.pulseLine} />
          </div>
          <div className={styles.targetBox}>
            <div className={styles.targetIcon}>🌐</div>
            <span>TARGET APP</span>
          </div>
        </div>

        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            <span>LIVE PENTEST LOG</span>
            <div className={styles.progressText}>{Math.round(progress)}%</div>
          </div>
          <div className={styles.terminalBody}>
            {log.map((line, i) => (
              <div key={i} className={styles.logLine}>{line}</div>
            ))}
            <div className={styles.blinker}>_</div>
          </div>
        </div>
      </div>
    </div>
  )
}
