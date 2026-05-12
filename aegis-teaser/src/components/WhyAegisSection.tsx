'use client'
import styles from './WhyAegisSection.module.css'
import { motion } from 'framer-motion'

const CARDS = [
  {
    title: 'Indonesia #1 Target Serangan',
    desc: 'Menurut laporan BSSN 2024, Indonesia menempati peringkat pertama target anomali trafik siber di Asia Tenggara. Infrastruktur kita sangat rentan.',
    date: 'Jan 20, 2025',
    category: 'Market Risk',
    visual: '🇮🇩'
  },
  {
    title: 'Budaya "Vibe Coding" Developer',
    desc: 'Mayoritas developer fokus pada "vibe" dan kecepatan fitur tanpa memahami struktur keamanan kode, meninggalkan celah fatal bagi hacker.',
    date: 'Dec 15, 2024',
    category: 'Internal Gap',
    visual: '⌨️'
  },
  {
    title: 'Kerugian Hingga Miliaran Rupiah',
    desc: 'Satu insiden kebocoran data di perusahaan Indonesia rata-rata memakan biaya miliaran Rupiah untuk recovery dan hilangnya kepercayaan publik.',
    date: 'Nov 22, 2024',
    category: 'Financial Loss',
    visual: '💸'
  },
  {
    title: 'Full Enforcement UU PDP 2024',
    desc: 'Masa tenggang UU No. 27/2022 berakhir. Sekarang, kebocoran data adalah tindak pidana dengan denda administrasi hingga 2% pendapatan global.',
    date: 'Oct 17, 2024',
    category: 'Legal / Compliance',
    visual: '⚖️'
  }
]

export default function WhyAegisSection() {
  return (
    <section id="why" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>The Security Crisis</h2>
          <button className={styles.viewBlog}>View Analysis</button>
        </div>

        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <motion.div 
              key={i} 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.cardVisual}>
                 <div className={styles.dotsOverlay} />
                 <span className={styles.visualIcon}>{card.visual}</span>
                 <div className={styles.cardTag}>{card.title.split(' ')[0]}</div>
              </div>
              <div className={styles.cardContent}>
                 <h3 className={styles.cardTitle}>{card.title}</h3>
                 <p className={styles.cardDesc}>{card.desc}</p>
                 <div className={styles.cardMeta}>
                    <span>{card.date}</span>
                    <span className={styles.separator}>•</span>
                    <span>{card.category}</span>
                 </div>
                 <button className={styles.readMore}>Read analysis <span>→</span></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
