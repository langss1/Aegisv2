'use client'
import { useState } from 'react'
import styles from './DemoSection.module.css'

export default function DemoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="demo" className={styles.section}>
      <div className="container">
        <div className={styles.videoWrapper}>
          {/* Glow border */}
          <div className={styles.videoBorder} />

          {/* Video player area */}
          <div className={styles.videoContainer}>
            {!playing ? (
              <div className={styles.thumbnail}>
                {/* Fake code terminal in bg */}
                <div className={styles.terminalBg}>
                  <div className={styles.terminalBar}>
                    <div className={styles.dot} style={{ background: '#ff5f57' }} />
                    <div className={styles.dot} style={{ background: '#febc2e' }} />
                    <div className={styles.dot} style={{ background: '#28c840' }} />
                    <span style={{ marginLeft: 12, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>aegis — terminal</span>
                  </div>
                  <div className={styles.terminalBody}>
                    {[
                      { text: '$ aegis scan ./src --deep', color: '#fca5a5' },
                      { text: '▶ Phase 1: SAST Analysis...', color: 'rgba(255,255,255,0.5)' },
                      { text: '  ✓ SQL Injection detected [CRITICAL]', color: '#ef4444' },
                      { text: '  ✓ XSS vulnerability found [HIGH]', color: '#f97316' },
                      { text: '  ✓ Applying AI auto-heal patch...', color: '#22c55e' },
                      { text: '▶ Phase 2: DAST Attack Sim...', color: 'rgba(255,255,255,0.5)' },
                      { text: '  ✓ OWASP Top-10 tested: 10/10', color: '#22c55e' },
                      { text: '▶ Phase 3: Monitor Active ⚡', color: '#f472b6' },
                    ].map((line, i) => (
                      <div key={i} className={styles.terminalLine} style={{ animationDelay: `${i * 0.3}s` }}>
                        <span style={{ color: line.color }}>{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Play button */}
                <button
                  className={styles.playBtn}
                  onClick={() => setPlaying(true)}
                  id="demo-play-button"
                  aria-label="Play demo video"
                >
                  <div className={styles.playRipple} />
                  <div className={styles.playRipple2} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5l12 7-12 7V5z" fill="white" />
                  </svg>
                </button>

                <div className={styles.thumbnailCaption}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#fca5a5" strokeWidth="1.5"/>
                    <path d="M10 8l6 4-6 4V8z" fill="#fca5a5"/>
                  </svg>
                  3 min • AEGIS Full Demo • Phase 1, 2 & 3
                </div>
              </div>
            ) : (
              <iframe
                className={styles.iframe}
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="AEGIS Demo"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>

          {/* Scanline effect */}
          <div className={styles.scanline} />
        </div>

        <div className={styles.label}>
          <span>▶</span> Product Demo
        </div>
        <h2 className={styles.title}>
          See AEGIS in <span className="gradient-text">Action</span>
        </h2>
        <p className={styles.subtitle}>
          Lihat bagaimana AEGIS mendeteksi kerentanan, mensimulasikan serangan, dan memantau sistem Anda secara real-time dalam hitungan detik.
        </p>

        {/* Feature highlights below video */}
        <div className={styles.features}>
          {[
            { icon: '🔍', title: 'SAST Analysis', desc: 'Deteksi kerentanan di source code sebelum deploy' },
            { icon: '⚔️', title: 'DAST Simulation', desc: 'Simulasi serangan OWASP Top-10 secara otomatis' },
            { icon: '📡', title: 'Real-time Monitor', desc: 'Pantau dan alert ancaman 24/7 via Telegram' },
          ].map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div>
                <div className={styles.featureTitle}>{f.title}</div>
                <div className={styles.featureDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
