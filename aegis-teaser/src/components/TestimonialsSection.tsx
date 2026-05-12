'use client'
import { useEffect, useRef } from 'react'
import styles from './TestimonialsSection.module.css'

const TESTIMONIALS = [
  {
    name: 'Dr. Budi Santoso, S.T., M.Kom.',
    role: 'Dosen Keamanan Siber',
    org: 'Universitas Teknologi Indonesia',
    avatar: '👨‍🏫',
    quote: 'AEGIS mengubah cara mahasiswa saya belajar security. Bukan lagi teori semata — mereka langsung melihat vulnerability di kode mereka sendiri dan cara memperbaikinya. Ini adalah pendidikan security yang sesungguhnya.',
    stars: 5,
    tag: 'Akademisi',
    color: '#f97316',
  },
  {
    name: 'Rizky Pratama',
    role: 'Backend Developer',
    org: 'Startup Fintech Series B',
    avatar: '👨‍💻',
    quote: 'Sebelum AEGIS, security review di tim kami bisa makan waktu 2 minggu per sprint. Sekarang? AEGIS scan langsung di pipeline, dan developer menerima feedback detil dalam hitungan menit. Game changer.',
    stars: 5,
    tag: 'Developer',
    color: '#ef4444',
  },
  {
    name: 'Aulia Rahma',
    role: 'Mahasiswi Informatika Semester 6',
    org: 'Institut Teknologi Bandung',
    avatar: '👩‍🎓',
    quote: 'Saya pakai AEGIS untuk proyek TA saya. Yang bikin saya terkejut adalah betapa banyak kerentanan yang tidak saya sadari ada di kode saya sendiri. AEGIS bukan hanya tools, tapi juga guru terbaik.',
    stars: 5,
    tag: 'Mahasiswa',
    color: '#f472b6',
  },
  {
    name: 'Agus Wijaya, CISSP',
    role: 'Head of Information Security',
    org: 'PT. Teknologi Nusantara',
    avatar: '🔐',
    quote: 'Kami memiliki tim 5 security engineer yang harus mengaudit 30+ microservices. Dengan AEGIS, coverage audit kami naik 4x lipat tanpa menambah headcount. ROI-nya sangat jelas dalam bulan pertama.',
    stars: 5,
    tag: 'Security Pro',
    color: '#a855f7',
  },
  {
    name: 'Prof. Siti Hajar, Ph.D.',
    role: 'Ketua Prodi Teknik Informatika',
    org: 'Universitas Gadjah Mada',
    avatar: '👩‍🔬',
    quote: 'Dalam kurikulum modern, security bukan lagi mata kuliah tersendiri — harus terintegrasi dalam setiap baris kode. AEGIS adalah tools yang kami butuhkan untuk mewujudkan DevSecOps di lingkungan akademik.',
    stars: 5,
    tag: 'Akademisi',
    color: '#f97316',
  },
  {
    name: 'Dian Permadi',
    role: 'CTO & Co-Founder',
    org: 'Layana Health Tech',
    avatar: '🚀',
    quote: 'Sebagai startup di industri kesehatan, compliance security adalah non-negotiable. AEGIS membantu kami memenuhi standar ISO 27001 dan UU PDP tanpa harus menyewa konsultan mahal. Luar biasa.',
    stars: 5,
    tag: 'Startup',
    color: '#22c55e',
  },
]

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let pos = 0
    let animId: number
    const speed = 0.4

    function animate() {
      pos += speed
      if (pos >= track!.scrollWidth / 2) pos = 0
      track!.style.transform = `translateX(-${pos}px)`
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    const pause = () => cancelAnimationFrame(animId)
    const resume = () => { animId = requestAnimationFrame(animate) }

    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)

    return () => {
      cancelAnimationFrame(animId)
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
    }
  }, [])

  return (
    <section id="testimonials" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.label}>What They Say</div>
          <h2 className={styles.title}>
            Dipercaya oleh <span className="gradient-text">Mereka yang Peduli</span>
          </h2>
          <p className={styles.subtitle}>
            Dari dosen, developer, hingga mahasiswa — AEGIS telah mengubah cara mereka memandang keamanan software.
          </p>
        </div>
      </div>

      {/* Auto-scrolling testimonials */}
      <div className={styles.carouselWrapper}>
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
        <div className={styles.track} ref={trackRef}>
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatarWrap} style={{ background: `${t.color}20`, border: `1px solid ${t.color}40` }}>
                  <span className={styles.avatar}>{t.avatar}</span>
                </div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                  <div className={styles.org}>{t.org}</div>
                </div>
              </div>
              <div className={styles.stars}>
                {'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}
              </div>
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.tag} style={{ color: t.color, background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
                {t.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
