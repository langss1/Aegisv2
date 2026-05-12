import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topLine} />
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="white" strokeWidth="1.5" fill="rgba(220,38,38,0.3)"/>
                  <path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1" strokeOpacity="0.6"/>
                </svg>
              </div>
              <span>AEGIS</span>
            </div>
            <p className={styles.tagline}>
              Autonomous AI Security Agent.<br />
              Built for developers, trusted by teams.
            </p>
            <p className={styles.made}>
              🇮🇩 Made with ❤️ in Indonesia
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <div className={styles.linkTitle}>Product</div>
              <a href="#demo">Demo</a>
              <a href="#why">Why AEGIS</a>
              <a href="#for-who">For Who</a>
              <a href="#cta">Early Access</a>
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkTitle}>Phases</div>
              <a href="#">Phase 1: SAST & Heal</a>
              <a href="#">Phase 2: DAST</a>
              <a href="#">Phase 3: Monitor</a>
              <a href="#">AI Engine</a>
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkTitle}>Legal</div>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Kepatuhan UU PDP</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© 2025 AEGIS. All rights reserved.</span>
          <span className={styles.bottomRight}>
            Security is not an option — it&apos;s a foundation.
          </span>
        </div>
      </div>
    </footer>
  )
}
