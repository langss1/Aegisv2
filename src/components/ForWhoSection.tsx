'use client'
import { useState } from 'react'
import styles from './ForWhoSection.module.css'

const AUDIENCES = [
  {
    id: 'developer',
    emoji: '👨‍💻',
    role: 'Developer',
    tagline: 'Code more, worry less',
    headline: 'Fokus Pada Fitur, Bukan Vulnerability',
    desc: 'AEGIS terintegrasi langsung ke dalam workflow development Anda. Jalankan satu command, dan AI kami akan scan, patch, dan simulasikan serangan pada kode Anda secara otomatis — tanpa mengubah cara Anda bekerja.',
    benefits: [
      'Auto-heal vulnerability dengan AI patch suggestions',
      'Integrasi dengan IDE & CI/CD pipeline',
      'Laporan vulnerability dalam bahasa manusia',
      'Hemat 10x waktu security review',
    ],
    productivity: 'Tingkatkan produktivitas development hingga 40% dengan menghilangkan bottleneck security review.',
    color: '#ef4444',
  },
  {
    id: 'student',
    emoji: '🎓',
    role: 'Mahasiswa',
    tagline: 'Learn by doing, securely',
    headline: 'Belajar Security Sambil Coding',
    desc: 'AEGIS adalah lab security sekaligus mentor AI. Setiap kali menulis kode, Anda belajar kerentanan apa yang ada dan bagaimana memperbaikinya — persiapan terbaik sebelum masuk industri.',
    benefits: [
      'Feedback security real-time saat coding',
      'Penjelasan vulnerability yang mudah dipahami',
      'Latihan OWASP Top-10 attack simulation',
      'Portfolio security analysis yang siap dishow',
    ],
    productivity: 'Mahasiswa yang menggunakan AEGIS 3x lebih siap menghadapi interview security engineering.',
    color: '#f472b6',
  },
  {
    id: 'everyone',
    emoji: '🏢',
    role: 'Tim & Startup',
    tagline: 'Ship fast, stay secure',
    headline: 'Keamanan Enterprise untuk Tim Kecil',
    desc: 'Tidak perlu dedicated security engineer. AEGIS memberikan coverage enterprise-grade security untuk tim kecil yang bergerak cepat — comply dengan UU PDP tanpa mengorbankan velocity.',
    benefits: [
      'Dashboard monitoring tim terpusat',
      'Alert Telegram real-time ke seluruh tim',
      'Compliance report UU PDP otomatis',
      'Mulai dari Rp 0 untuk open-source project',
    ],
    productivity: 'Kurangi technical debt security hingga 60% di sprint pertama.',
    color: '#f97316',
  },
  {
    id: 'security',
    emoji: '🔐',
    role: 'Security Analyst',
    tagline: 'Automate the routine',
    headline: 'Perluas Jangkauan Audit Anda',
    desc: 'Biarkan AEGIS mengurus pengecekan rutin sementara Anda fokus pada ancaman kompleks. Dengan DAST otomatis dan monitor real-time, audit coverage Anda meningkat tanpa menambah beban manual.',
    benefits: [
      'OWASP Top-10 automated attack simulation',
      'Custom rule definition untuk scan SAST',
      'Integrasi dengan SIEM dan tools existing',
      'Exportable report untuk compliance audit',
    ],
    productivity: 'Tingkatkan coverage audit hingga 5x dengan effort yang sama.',
    color: '#a855f7',
  },
]

export default function ForWhoSection() {
  const [active, setActive] = useState('developer')
  const current = AUDIENCES.find(a => a.id === active)!

  return (
    <section id="for-who" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.label}>Built For Everyone</div>
          <h2 className={styles.title}>
            AEGIS untuk <span className="gradient-text">Siapa Saja</span>
          </h2>
          <p className={styles.subtitle}>
            Apapun peran Anda dalam ekosistem software, AEGIS hadir sebagai rekan keamanan yang tidak pernah tidur.
          </p>
        </div>

        {/* Tab switcher */}
        <div className={styles.tabs}>
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              id={`for-who-tab-${a.id}`}
              className={`${styles.tab} ${active === a.id ? styles.tabActive : ''}`}
              onClick={() => setActive(a.id)}
              style={active === a.id ? { '--tab-color': a.color } as React.CSSProperties : {}}
            >
              <span>{a.emoji}</span>
              <span>{a.role}</span>
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className={styles.panel} key={active}>
          <div className={styles.panelLeft}>
            <div className={styles.panelTagline} style={{ color: current.color }}>
              {current.tagline}
            </div>
            <h3 className={styles.panelTitle}>{current.headline}</h3>
            <p className={styles.panelDesc}>{current.desc}</p>

            <div className={styles.benefits}>
              {current.benefits.map((b) => (
                <div key={b} className={styles.benefit}>
                  <div className={styles.benefitCheck} style={{ background: current.color }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className={styles.productivityBadge} style={{ borderColor: `${current.color}40`, background: `${current.color}10` }}>
              <span>⚡</span>
              <span>{current.productivity}</span>
            </div>
          </div>

          <div className={styles.panelRight}>
            <div className={styles.roleCard} style={{ '--role-color': current.color } as React.CSSProperties}>
              <div className={styles.roleEmoji}>{current.emoji}</div>
              <div className={styles.roleGlow} style={{ background: `radial-gradient(ellipse, ${current.color}30, transparent 70%)` }} />
              <div className={styles.roleName}>{current.role}</div>
              <div className={styles.roleMetrics}>
                {[
                  { icon: '🔍', val: 'SAST', active: true },
                  { icon: '⚔️', val: 'DAST', active: current.id !== 'everyone' },
                  { icon: '📡', val: 'Monitor', active: true },
                  { icon: '🤖', val: 'AI Heal', active: current.id === 'developer' || current.id === 'student' },
                ].map(m => (
                  <div key={m.val} className={`${styles.metricBadge} ${m.active ? styles.metricActive : styles.metricOff}`}>
                    <span>{m.icon}</span> {m.val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
