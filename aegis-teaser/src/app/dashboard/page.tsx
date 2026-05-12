'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={styles.contentWrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <div className={styles.headerActions}>
          <Link href="/phases/phase0" className={styles.newProjectBtn}>+ New Project</Link>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Overall Risk Score</div>
          <div className={styles.riskValue}>82<span>/100</span></div>
          <div className={styles.riskDesc}>Your security posture is <span style={{color: '#fbbf24'}}>Moderate</span></div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Active Projects</div>
          <div className={styles.bigVal}>12</div>
          <div className={styles.cardTrend}>+2 from last month</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Vulnerabilities Fixed</div>
          <div className={styles.bigVal}>1,240</div>
          <div className={styles.cardTrend} style={{color: '#22c55e'}}>98% auto-healed</div>
        </div>
      </div>

      <section className={styles.recentProjects}>
        <h2 className={styles.sectionTitle}>Recent Security Runs</h2>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Project Name</span>
            <span>Status</span>
            <span>Score</span>
            <span>Last Run</span>
          </div>
          {[
            { name: 'aegis-core-backend', status: 'Healthy', score: 98, date: '2h ago' },
            { name: 'payment-gateway-api', status: 'Vulnerable', score: 64, date: '5h ago' },
            { name: 'user-auth-service', status: 'Testing', score: 82, date: '1d ago' },
          ].map((p) => (
            <div key={p.name} className={styles.tableRow}>
              <span className={styles.pName}>{p.name}</span>
              <span className={styles.pStatus}>{p.status}</span>
              <span className={styles.pScore}>{p.score}</span>
              <span className={styles.pDate}>{p.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
