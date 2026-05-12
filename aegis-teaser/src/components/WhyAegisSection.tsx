'use client'
import { useEffect, useRef } from 'react'
import styles from './WhyAegisSection.module.css'

const PROBLEMS = [
  {
    icon: '⚠️',
    stat: '78%',
    title: 'Developer Tidak Paham Security',
    desc: 'Studi OWASP 2024 menemukan bahwa 78% developer mengakui keamanan bukan prioritas utama saat coding — deadline lebih mendesak dari enkripsi.',
    source: 'OWASP Developer Survey 2024',
    color: '#ef4444',
  },
  {
    icon: '🇮🇩',
    stat: '#1',
    title: 'Indonesia Negara Paling Rentan di Asia',
    desc: 'Indonesia menempati posisi teratas sebagai negara dengan insiden kebocoran data terbanyak di Asia Tenggara, dengan lebih dari 200 juta data bocor sejak 2021.',
    source: 'Surfshark Data Breach Report 2024',
    color: '#f97316',
  },
  {
    icon: '⚖️',
    stat: 'Rp 5M',
    title: 'UU PDP: Denda Hingga Rp 5 Miliar',
    desc: 'UU Perlindungan Data Pribadi (UU No. 27/2022) memberi ancaman denda hingga Rp 5 miliar + penjara 5 tahun bagi pelanggar. Siap menanggung risikonya?',
    source: 'UU PDP No. 27 Tahun 2022',
    color: '#a855f7',
  },
  {
    icon: '⏰',
    stat: '287 hari',
    title: 'Rata-rata Waktu Deteksi Breach',
    desc: 'Rata-rata perusahaan baru menyadari kebocoran data setelah 287 hari. Dalam kurun itu, data sudah tersebar luas di dark web.',
    source: 'IBM Cost of a Data Breach 2024',
    color: '#dc2626',
  },
  {
    icon: '💸',
    stat: '$4.45M',
    title: 'Biaya Rata-rata Satu Kebocoran Data',
    desc: 'Rata-rata kerugian global per insiden kebocoran data mencapai $4.45 juta USD — setara dengan membuang ribuan jam produktivitas tim.',
    source: 'IBM Security Report 2024',
    color: '#ec4899',
  },
  {
    icon: '🛡️',
    stat: '< 5%',
    title: 'Tim dengan Security Pipeline Otomatis',
    desc: 'Kurang dari 5% tim pengembang di Indonesia memiliki automated security pipeline yang terintegrasi dalam CI/CD mereka.',
    source: 'BSSN Laporan Keamanan Siber 2023',
    color: '#f43f5e',
  },
]

export default function WhyAegisSection() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const cards = cardsRef.current?.querySelectorAll(`.${styles.card}`)
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="why" className={styles.section}>
      {/* Top divider */}
      <div className={styles.dividerTop} />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.label}>
            <span className={styles.labelDot} />
            The Problem
          </div>
          <h2 className={styles.title}>
            Mengapa Security Harus Jadi <br />
            <span className="gradient-text">Prioritas Pertama?</span>
          </h2>
          <p className={styles.subtitle}>
            Fakta-fakta ini bukan sekadar statistik — mereka adalah krisis nyata yang mengancam produk, pengguna, dan bisnis Anda setiap hari.
          </p>
        </div>

        <div className={styles.grid} ref={cardsRef}>
          {PROBLEMS.map((p, i) => (
            <div
              key={p.title}
              className={styles.card}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.cardTop}>
                <span className={styles.icon}>{p.icon}</span>
                <span className={styles.stat} style={{ color: p.color }}>{p.stat}</span>
              </div>
              <div className={styles.cardGlow} style={{ background: `radial-gradient(ellipse at top left, ${p.color}20, transparent 60%)` }} />
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <div className={styles.cardSource}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {p.source}
              </div>
            </div>
          ))}
        </div>

        {/* AEGIS solution callout */}
        <div className={styles.solution}>
          <div className={styles.solutionInner}>
            <div className={styles.solutionIcon}>🛡️</div>
            <div>
              <h3 className={styles.solutionTitle}>AEGIS hadir sebagai solusi</h3>
              <p className={styles.solutionText}>
                Dengan tiga fase otomatis — SAST, DAST, dan Monitor — AEGIS memastikan developer bisa fokus pada produktivitas 
                sementara AI bekerja di balik layar menjaga keamanan kode Anda 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.dividerBottom} />
    </section>
  )
}
