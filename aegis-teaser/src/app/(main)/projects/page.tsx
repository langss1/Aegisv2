'use client'
import Link from 'next/link'
import styles from './projects.module.css'

export default function ProjectsPage() {
  const projects = [
    { 
      name: 'aegis-core-backend', 
      lang: 'Python', 
      runs: 42, 
      score: 98, 
      status: 'Healthy',
      lastScan: '2 hours ago',
      threats: 0,
      vulnerabilities: 0
    },
    { 
      name: 'payment-gateway-api', 
      lang: 'Node.js', 
      runs: 12, 
      score: 64, 
      status: 'Vulnerable',
      lastScan: '5 hours ago',
      threats: 3,
      vulnerabilities: 8
    },
    { 
      name: 'user-auth-service', 
      lang: 'Go', 
      runs: 8, 
      score: 82, 
      status: 'Testing',
      lastScan: '1 day ago',
      threats: 0,
      vulnerabilities: 2
    },
    { 
      name: 'frontend-web-portal', 
      lang: 'TypeScript', 
      runs: 24, 
      score: 91, 
      status: 'Healthy',
      lastScan: '2 days ago',
      threats: 0,
      vulnerabilities: 0
    },
  ]

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>All Projects</h1>
          <p className={styles.subtitle}>Manage and monitor your security posture across all environments.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.filterGroup}>
            <button className={styles.filterBtn} data-active="true">All</button>
            <button className={styles.filterBtn}>Vulnerable</button>
            <button className={styles.filterBtn}>Healthy</button>
          </div>
          <button className={styles.addBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Project
          </button>
        </div>
      </header>

      <div className={styles.projectGrid}>
        {projects.map((p, i) => (
          <div 
            key={p.name} 
            className={styles.projectCard} 
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={styles.cardGlow} data-status={p.status} />
            
            <div className={styles.pHeader}>
              <div className={styles.pBrand}>
                <div className={styles.pIcon} data-lang={p.lang}>{p.lang[0]}</div>
                <div className={styles.pTitleInfo}>
                  <h3 className={styles.pName}>{p.name}</h3>
                  <div className={styles.pMeta}>
                    <span className={styles.pLang}>{p.lang}</span>
                    <span className={styles.pDot} />
                    <span className={styles.pTime}>Last scan: {p.lastScan}</span>
                  </div>
                </div>
              </div>
              <div className={`${styles.statusIndicator} ${styles[p.status.toLowerCase()]}`}>
                <div className={styles.statusDot} />
                {p.status}
              </div>
            </div>

            <div className={styles.pBody}>
              <div className={styles.mainScore}>
                <div className={styles.scoreCircle}>
                  <svg viewBox="0 0 36 36" className={styles.circularChart}>
                    <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path 
                      className={styles.circle} 
                      style={{ strokeDasharray: `${p.score}, 100` }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                  </svg>
                  <div className={styles.scoreText}>
                    <span className={styles.scoreVal}>{p.score}</span>
                    <span className={styles.scorePerc}>%</span>
                  </div>
                </div>
                <div className={styles.scoreLabel}>Security Score</div>
              </div>

              <div className={styles.quickStats}>
                <div className={styles.qStat}>
                  <span className={styles.qsLabel}>Runs</span>
                  <span className={styles.qsVal}>{p.runs}</span>
                </div>
                <div className={styles.qStat}>
                  <span className={styles.qsLabel}>Threats</span>
                  <span className={styles.qsVal} data-alert={p.threats > 0}>{p.threats}</span>
                </div>
                <div className={styles.qStat}>
                  <span className={styles.qsLabel}>Vulns</span>
                  <span className={styles.qsVal} data-alert={p.vulnerabilities > 0}>{p.vulnerabilities}</span>
                </div>
              </div>
            </div>

            <div className={styles.pActions}>
              <Link href="/phases/phase3" className={styles.viewBtn}>
                <span>Enter Terminal View</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
