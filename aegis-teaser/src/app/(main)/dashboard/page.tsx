'use client'
import styles from '../dashboard.module.css'

export default function DashboardPage() {
  const stats = [
    { label: 'Overall Risk Score', value: '82/100', desc: 'Posture: Moderate', color: 'textAmber' },
    { label: 'Active Projects', value: '12', desc: '↑ 14% from last week', color: 'textGreen' },
    { label: 'Vulnerabilities Fixed', value: '1,240', desc: '98% automated recovery', color: 'textGreen' },
  ]

  const recentRuns = [
    { name: 'aegis-core-backend', status: 'Healthy', score: 98, lastRun: '2h ago', pill: 'pillGreen', scoreColor: 'scoreGreen' },
    { name: 'payment-gateway-api', status: 'Vulnerable', score: 64, lastRun: '5h ago', pill: 'pillRed', scoreColor: 'scoreAmber' },
    { name: 'user-auth-service', status: 'Testing', score: 82, lastRun: '1d ago', pill: 'pillBlue', scoreColor: 'scoreGreen' },
    { name: 'customer-portal-v3', status: 'Healthy', score: 92, lastRun: '2d ago', pill: 'pillGreen', scoreColor: 'scoreGreen' },
  ]

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Dashboard Overview</h1>
        <p>Monitor your security pipeline and autonomous agent health.</p>
      </div>

      <div className={styles.statsRow}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.cardLabel}>
              {stat.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
              </svg>
            </div>
            <div className={styles.cardValue}>{stat.value}</div>
            <div className={`${styles.cardDesc} ${styles[stat.color]}`}>
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Recent Security Runs</h3>
          <button className={styles.viewAllBtn}>View All</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Security Score</th>
              <th>Last Scanned</th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.map((run, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700, color: '#fff' }}>{run.name}</td>
                <td>
                  <span className={`${styles.statusPill} ${styles[run.pill]}`}>
                    {run.status}
                  </span>
                </td>
                <td>
                  <div className={styles.scoreTrack}>
                    <div className={`${styles.scoreBar} ${styles[run.scoreColor]}`} style={{ width: `${run.score}%` }} />
                  </div>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>{run.score}</span>
                </td>
                <td style={{ color: '#3f3f46' }}>{run.lastRun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
