'use client'
import Link from 'next/link'
import styles from './docs.module.css'

export default function DocsPage() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/">AEGIS Docs</Link>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <h4>Getting Started</h4>
            <a href="#introduction">Introduction</a>
            <a href="#cli-setup">CLI Setup</a>
            <a href="#web-integration">Web Integration</a>
          </div>
          <div className={styles.navGroup}>
            <h4>Features</h4>
            <a href="#phase1">Phase 1: SAST</a>
            <a href="#phase2">Phase 2: DAST</a>
            <a href="#phase3">Phase 3: Monitoring</a>
          </div>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <Link href="/login" className={styles.backBtn}>← Back to Login</Link>
        </header>

        <section id="introduction" className={styles.section}>
          <h1>Introduction</h1>
          <p>AEGIS is an autonomous AI-powered security platform designed to secure your development era. It provides both a cloud-based dashboard and a local CLI agent for maximum privacy.</p>
        </section>

        <section id="cli-setup" className={styles.section}>
          <h1>CLI Setup</h1>
          <p>For developers who prioritize data privacy, the AEGIS CLI runs all security processes locally on your machine.</p>
          <div className={styles.codeBlock}>
            <code>npx aegis-security@latest init</code>
          </div>
          <p>This command will initialize the AEGIS core engine and guide you through the setup process for your local IDE (VS Code, IntelliJ, etc).</p>
        </section>

        <section id="web-integration" className={styles.section}>
          <h1>Web Integration</h1>
          <p>The Web Dashboard allows you to manage security across your entire team. Simply connect your GitHub repository or provide a public URL to start automated monitoring.</p>
          <div className={styles.stepBox}>
            <div className={styles.step}>
              <span>1</span>
              <div>
                <strong>Connect Repository</strong>
                <p>Authorize AEGIS to access your code via GitHub OAuth.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span>2</span>
              <div>
                <strong>Automated Scanning</strong>
                <p>AEGIS will automatically detect vulnerabilities and suggest AI patches.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="phase1" className={styles.section}>
          <h1>Phase 1: Static Analysis (SAST)</h1>
          <p>AEGIS scans your source code for common security patterns, exposed secrets, and logic flaws. It provides instant AI-generated patches that you can apply with one click.</p>
        </section>

        <footer className={styles.footer}>
          <p>© 2026 AEGIS Security Platform. Built for the modern developer.</p>
        </footer>
      </main>
    </div>
  )
}
