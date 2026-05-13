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

import { motion } from 'framer-motion'
import { User, Quote, Star } from 'lucide-react'

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const titleWords = "Dipercaya oleh Mereka yang Peduli".split(" ")

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
      <div className={styles.dotBg} />
      <div className="container">
        <div className={styles.header}>
          <div className={styles.label}>What They Say</div>
          <h2 className={styles.title}>
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 70,
                  damping: 20,
                  delay: i * 0.2,
                }}
                viewport={{ once: true }}
                style={{ display: 'inline-block', marginRight: '0.25em' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p className={styles.subtitle}>
            Dari dosen, developer, hingga mahasiswa — AEGIS telah mengubah cara mereka memandang keamanan software.
          </p>
        </div>
      </div>

      <div className={styles.carouselWrapper}>
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
        <div className={styles.track} ref={trackRef}>
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <motion.div 
              key={i} 
              className={styles.card}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Quote className={styles.quoteIcon} size={60} />
              <div className={styles.cardHeader}>
                <div className={styles.avatarWrap} style={{ borderColor: `${t.color}40` }}>
                  <User size={24} color={t.color} />
                  <div className={styles.avatarGlow} style={{ backgroundColor: t.color }} />
                </div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                  <div className={styles.org}>{t.org}</div>
                </div>
              </div>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < t.stars ? "#ff0000" : "transparent"} color={i < t.stars ? "#ff0000" : "rgba(255,255,255,0.2)"} />
                ))}
              </div>
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.tag} style={{ color: t.color, borderColor: `${t.color}30`, background: `${t.color}10` }}>
                {t.tag}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
