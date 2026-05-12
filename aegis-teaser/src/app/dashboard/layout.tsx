'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './dashboard.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Projects', href: '/projects', icon: '📁' },
    { name: 'Reports', href: '/reports', icon: '📜' },
  ]

  const securityPhases = [
    { name: 'Ingestion', href: '/phases/phase0', phase: '0' },
    { name: 'SAST & Heal', href: '/phases/phase1', phase: '1' },
    { name: 'DAST', href: '/phases/phase2', phase: '2' },
    { name: 'Monitor', href: '/phases/phase3', phase: '3' },
  ]

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <aside className={styles.sideNav}>
        <div className={styles.navHeader}>
          <Link href="/dashboard" className={styles.brand}>
            <div className={styles.brandIcon}>A</div>
            <span>AEGIS</span>
          </Link>
        </div>

        <div className={styles.navSections}>
          <div className={styles.navSection}>
            <label>Platform</label>
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={pathname === item.href ? styles.activeNavItem : styles.navLink}
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          <div className={styles.navSection}>
            <label>Security Pipeline</label>
            {securityPhases.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={pathname === item.href ? styles.activeNavItem : styles.navLink}
              >
                <span className={styles.phaseTag}>P{item.phase}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.navFooter}>
          <div className={styles.userBrief}>
            <div className={styles.userAvatar}>G</div>
            <div className={styles.userMeta}>
              <strong>Gilang Wasi</strong>
              <span>Security Architect</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className={styles.viewContainer}>
        {/* Top Header */}
        <header className={styles.topBar}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" placeholder="Search security runs..." />
          </div>
          <div className={styles.topActions}>
            <div className={styles.notificationBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <span className={styles.badge} />
            </div>
            <button className={styles.primaryBtn}>+ New Scan</button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  )
}
