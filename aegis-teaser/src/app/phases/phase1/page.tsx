'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './phase1.module.css'

export default function Phase1Page() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Scanning Source Code...')
  const [findings, setFindings] = useState<{file: string, issue: string, severity: string}[]>([])
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus('Analysis Complete. Reviewing Findings...')
          setTimeout(() => router.push('/phases/review-findings'), 2000)
          return 100
        }
        
        // Add dummy findings as we progress
        if (prev === 20) setFindings(f => [...f, { file: 'auth.py', issue: 'Weak password hashing', severity: 'High' }])
        if (prev === 50) setFindings(f => [...f, { file: 'db.py', issue: 'SQL Injection possibility', severity: 'Critical' }])
        if (prev === 80) setFindings(f => [...f, { file: 'utils.py', issue: 'Insecure temp file creation', severity: 'Medium' }])
        
        return prev + 2
      })
    }, 100)
    return () => clearInterval(interval)
  }, [router])

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div className={styles.badge}>Phase 1</div>
        <h1 className={styles.title}>Static Analysis & AI Healing</h1>
        <p className={styles.subtitle}>Analyzing source code for security patterns, secrets, and OWASP vulnerabilities.</p>
      </header>

      <div className={styles.scannerCard}>
        <div className={styles.scanStatus}>
          <div className={styles.statusInfo}>
            <span className={styles.statusText}>{status}</span>
            <span className={styles.percentage}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={styles.findingsArea}>
          <h3>Real-time Findings</h3>
          <div className={styles.findingList}>
            {findings.length === 0 ? (
              <div className={styles.empty}>Searching for vulnerabilities...</div>
            ) : (
              findings.map((f, i) => (
                <div key={i} className={styles.findingItem} data-severity={f.severity}>
                  <div className={styles.findingHeader}>
                    <span className={styles.severityTag}>{f.severity}</span>
                    <span className={styles.fileName}>{f.file}</span>
                  </div>
                  <div className={styles.issueText}>{f.issue}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.termTitle}>aegis-engine — sast-output</span>
        </div>
        <div className={styles.termBody}>
          <div>[INFO] Loading deep-scan engine v2.4...</div>
          <div>[INFO] Scanning 124 files in /src...</div>
          {progress > 10 && <div>[WARN] Potential sensitive data in config.json...</div>}
          {progress > 30 && <div>[CRIT] SQL Injection detected at db.py:45</div>}
          {progress > 60 && <div>[INFO] AI Agent generating patch for auth.py...</div>}
          {progress > 90 && <div>[INFO] All files scanned. Finalizing report.</div>}
          <div className={styles.blinker}>_</div>
        </div>
      </div>
    </div>
  )
}
