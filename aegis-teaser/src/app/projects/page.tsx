'use client'
import Link from 'next/link'
import styles from './projects.module.css'

export default function ProjectsPage() {
  const projects = [
    { name: 'aegis-core-backend', lang: 'Python', runs: 42, score: 98 },
    { name: 'payment-gateway-api', lang: 'Node.js', runs: 12, score: 64 },
    { name: 'user-auth-service', lang: 'Go', runs: 8, score: 82 },
    { name: 'frontend-web-portal', lang: 'TypeScript', runs: 24, score: 91 },
  ]

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <h1 className={styles.title}>All Projects</h1>
        <Link href="/phases/phase0" className={styles.newProjectBtn}>+ New Project</Link>
      </header>

      <div className={styles.projectGrid}>
        {projects.map(p => (
          <div key={p.name} className={styles.projectCard}>
            <div className={styles.pHeader}>
              <div className={styles.pIcon}>{p.lang[0]}</div>
              <div className={styles.pInfo}>
                <h3 className={styles.pName}>{p.name}</h3>
                <span className={styles.pLang}>{p.lang}</span>
              </div>
            </div>
            <div className={styles.pStats}>
              <div className={styles.pStat}>
                <span className={styles.psLabel}>Security Score</span>
                <span className={styles.psVal} data-score={p.score}>{p.score}%</span>
              </div>
              <div className={styles.pStat}>
                <span className={styles.psLabel}>Analysis Runs</span>
                <span className={styles.psVal}>{p.runs}</span>
              </div>
            </div>
            <div className={styles.pActions}>
              <Link href="/dashboard" className={styles.viewBtn}>View Dashboard</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
