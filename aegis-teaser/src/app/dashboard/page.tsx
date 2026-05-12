'use client'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const stats = [
    { label: 'Overall Risk Score', value: '82/100', trend: 'Posture: Moderate', type: 'warning' },
    { label: 'Active Projects', value: '12', trend: '+2 this month', type: 'up' },
    { label: 'Vulnerabilities Fixed', value: '1,240', trend: '98% auto-healed', type: 'up' },
  ]

  const recentRuns = [
    { name: 'aegis-core-backend', status: 'Healthy', score: 98, lastRun: '2h ago' },
    { name: 'payment-gateway-api', status: 'Vulnerable', score: 64, lastRun: '5h ago' },
    { name: 'user-auth-service', status: 'Testing', score: 82, lastRun: '1d ago' },
  ]

  return (
    <div>
      <header className={styles.contentHeader}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <Link href="/phases/phase0" className={styles.newProjectBtn}>
          + New Project
        </Link>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={`${styles.statTrend} ${stat.type === 'up' ? styles.trendUp : styles.trendWarning}`}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Recent Security Runs</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Score</th>
              <th>Last Run</th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.map((run, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{run.name}</td>
                <td>
                  <span className={`${styles.statusBadge} ${
                    run.status === 'Healthy' ? styles.statusHealthy : 
                    run.status === 'Vulnerable' ? styles.statusVulnerable : 
                    styles.statusTesting
                  }`}>
                    {run.status}
                  </span>
                </td>
                <td style={{ color: run.score > 80 ? '#4ade80' : '#f87171', fontWeight: 800 }}>{run.score}</td>
                <td style={{ color: 'rgba(255,255,255,0.4)' }}>{run.lastRun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
