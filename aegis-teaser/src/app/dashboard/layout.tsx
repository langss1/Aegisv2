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
    { name: 'Dashboard', href: '/dashboard', group: 'Platform' },
    { name: 'Projects', href: '/projects', group: 'Platform' },
    { name: 'Reports', href: '/reports', group: 'Platform' },
    { name: 'Phase 0: Ingestion', href: '/phases/phase0', group: 'Security Phases' },
    { name: 'Phase 1: SAST & Heal', href: '/phases/phase1', group: 'Security Phases' },
    { name: 'Phase 2: DAST', href: '/phases/phase2', group: 'Security Phases' },
    { name: 'Phase 3: Monitor', href: '/phases/phase3', group: 'Security Phases' },
  ]

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Link href="/dashboard" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(220,38,38,0.3)"/>
          </svg>
          <span>AEGIS</span>
        </Link>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <div className={styles.navTitle}>Platform</div>
            {navItems.filter(i => i.group === 'Platform').map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={pathname === item.href ? styles.navItemActive : styles.navItem}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={styles.navGroup}>
            <div className={styles.navTitle}>Security Phases</div>
            {navItems.filter(i => i.group === 'Security Phases').map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={pathname === item.href ? styles.navItemActive : styles.navItem}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className={styles.user}>
          <div className={styles.avatar}>D</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Developer</div>
            <div className={styles.userRole}>Security Pro</div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
