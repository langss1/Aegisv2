'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './dashboard.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Projects', href: '/projects', icon: '📁' },
    { name: 'Reports', href: '/reports', icon: '📜' },
  ]

  const securityPhases = [
    { name: 'Ingestion', href: '/phases/phase0', phase: '0' },
    { name: 'SAST & Heal', href: '/phases/phase1', phase: '1' },
    { name: 'DAST', href: '/phases/phase2', phase: '2' },
  ]

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sideNav} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.navHeader}>
          <div 
            className={styles.brand} 
            onClick={() => isCollapsed && setIsCollapsed(false)}
            style={{ cursor: isCollapsed ? 'pointer' : 'default' }}
          >
            <div className={styles.brandIcon}>A</div>
            {!isCollapsed && <span>AEGIS</span>}
          </div>
          
          {!isCollapsed && (
            <button 
              className={styles.menuToggle} 
              onClick={() => setIsCollapsed(true)}
              aria-label="Collapse Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}
        </div>

        <div className={styles.navSections}>
          <div className={styles.navSection}>
            {!isCollapsed && <label>Platform</label>}
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={pathname === item.href ? styles.activeNavItem : styles.navLink}
                title={isCollapsed ? item.name : ''}
              >
                <span className={styles.icon}>{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          <div className={styles.navSection}>
            {!isCollapsed && <label>Security Pipeline</label>}
            <div className={styles.pipelineItems}>
              {securityPhases.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={pathname === item.href ? styles.activeNavItem : styles.navLink}
                  title={isCollapsed ? item.name : ''}
                >
                  <span className={styles.phaseTag}>P{item.phase}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.navFooter}>
          <div className={styles.userBrief}>
            <div className={styles.userAvatar}>G</div>
            {!isCollapsed && (
              <div className={styles.userMeta}>
                <strong>Gilang Wasi</strong>
                <span>Security Architect</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className={`${styles.viewContainer} ${isCollapsed ? styles.expanded : ''}`}>
        {/* Top Header */}
        <header className={styles.topBar}>
          <div className={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" placeholder="Search security runs..." />
            <span className={styles.searchKey}>⌘K</span>
          </div>
          <div className={styles.topActions}>
            <div className={styles.notificationBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <span className={styles.badge} />
            </div>
            <Link href="/phases/phase0" className={styles.newScanBtn}>
              + New Scan
            </Link>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>

      {/* New Scan Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowModal(false)}>✕</button>
            
            <div className={styles.modalHeader}>
              <h2>Initialize New Scan</h2>
              <p>Select your target source to start AEGIS autonomous analysis.</p>
            </div>

            <div className={styles.modalActions}>
              <div className={styles.scanOption} onClick={() => setShowModal(false)}>
                <div className={styles.optionIcon}>📦</div>
                <h4>GitHub Repository</h4>
                <p>Connect your private or public repository for full SAST analysis.</p>
              </div>

              <div className={styles.scanOption} onClick={() => setShowModal(false)}>
                <div className={styles.optionIcon}>🌐</div>
                <h4>Public Website</h4>
                <p>Scan a live production URL for DAST and surface vulnerabilities.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
