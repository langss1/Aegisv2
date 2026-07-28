'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Zap, AlertTriangle } from 'lucide-react'
import styles from './DemoSection.module.css'

const problems = [
  {
    id: "01",
    label: "OPERATIONAL RISK",
    title: "Celah Remediasi Otomatis",
    desc: "Menemukan kerentanan adalah langkah awal, namun memperbaiki secara otomatis tanpa mengganggu stabilitas infrastruktur tetap menjadi tantangan kritis.",
    icon: <ShieldAlert size={42} className="text-red-500" />,
    color: "rgba(220, 38, 38, 0.3)", // Red Glow
    border: "border-red-500/50"
  },
  {
    id: "02",
    label: "INTELLIGENCE GAP",
    title: "Analisis Buta Konteks",
    desc: "Banyak solusi AI gagal memahami struktur lokal dan arsitektur unik proyek, menghasilkan rekomendasi generik yang tidak aplikatif pada lingkungan produksi.",
    icon: <AlertTriangle size={42} className="text-orange-500" />,
    color: "rgba(249, 115, 22, 0.3)", // Orange Glow
    border: "border-orange-500/50"
  },
  {
    id: "03",
    label: "DATA ANOMALY",
    title: "Deteksi Trafik Masif",
    desc: "Anomali trafik skala besar seringkali lolos dari pemantauan manual. Tanpa analisis real-time, celah ini menjadi gerbang utama serangan siber.",
    icon: <Zap size={42} className="text-yellow-500" />,
    color: "rgba(234, 179, 8, 0.3)", // Yellow Glow
    border: "border-yellow-500/50"
  }
]

export default function DemoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(0.8)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const visiblePct = Math.min(Math.max((windowHeight - rect.top) / (windowHeight * 0.8), 0), 1)
      setScale(0.8 + (visiblePct * 0.2))
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % problems.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={sectionRef} id="demo" className={styles.section}>
      <div className={styles.dotsBg}></div>
      
      <div 
        className={styles.videoWrapper} 
        style={{ 
            transform: `scale(${scale})`,
            opacity: Math.min(scale * 1.5 - 0.5, 1)
        }}
      >
        <div className={styles.scanline}></div>
        <div className={styles.videoContent}>
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/dQw4w9QwXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9QwXcQ" 
            title="Aegis Demo" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            style={{ filter: 'contrast(1.1) brightness(0.9) saturate(1.1)' }}
          ></iframe>
        </div>
      </div>

      {/* --- PREMIUM CONTENT CARD --- */}
      <div className={styles.cardContainer}>
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-[1px] w-16 bg-red-600"></div>
            <span className="text-[10px] font-bold tracking-[0.8em] text-red-500/80 uppercase font-mono">
              System Integrity Report
            </span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Masalah <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">Utama</span>
          </h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={styles.premiumCard}
            >
              <div className={styles.numberBg}>{problems[current].id}</div>
              
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <div className="relative flex-shrink-0">
                  <div className={styles.iconBox}>
                    {problems[current].icon}
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-2xl"></div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-white/5 bg-white/5 text-[9px] font-bold tracking-[0.4em] text-gray-500 mb-6 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    {problems[current].label}
                  </div>
                  <h3 className="text-3xl md:text-6xl font-bold text-white mb-6 tracking-tight uppercase">
                    {problems[current].title}
                  </h3>
                  <p className="text-lg md:text-2xl text-gray-400 leading-relaxed font-light italic border-l-2 border-red-600/20 pl-8 max-w-2xl">
                    {problems[current].desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* --- CONTROLS --- */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-3">
              {problems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`group relative h-1.5 transition-all duration-500 rounded-full ${
                    current === i ? "w-16 bg-red-600" : "w-6 bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {current === i && (
                    <motion.div 
                      layoutId="activeBarGlow"
                      className="absolute inset-0 bg-red-600 blur-[2px]"
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-6 text-[10px] font-mono tracking-[0.3em] text-gray-600 uppercase">
              <div className="flex items-center">
                <span className="text-red-600 font-bold tracking-widest">SCNR-v.2.0</span>
                <span className="mx-4 h-3 w-[1px] bg-white/20"></span>
                <span className="text-white">Page {current + 1} / {problems.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
