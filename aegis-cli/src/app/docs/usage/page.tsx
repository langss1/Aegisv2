'use client'
import { motion } from 'framer-motion'
import styles from '../../terminal.module.css'
import Link from 'next/link'

export default function UsageDocs() {
  const sections = [
    {
      title: "Navigation & Shell",
      content: "Aegis operates in two primary modes: Core and Passthrough. Use 'terminal' to enter Passthrough mode for standard shell operations. Use 'ui' to launch the web dashboard synchronized with your current directory."
    },
    {
      title: "Intelligence Switching",
      content: "Switch between AI models by typing their ID (AEGIS-PRO, LOCAL-OLLAMA, CUSTOM-AI). Aegis Pro is best for complex security logic, while Ollama provides maximum privacy. You can configure custom API keys in the [AI Dashboard](/config)."
    },
    {
      title: "Security Pipeline",
      content: "The P0-P3 pipeline represents the full security lifecycle: Ingestion (P0), Static Analysis (P1), Dynamic Analysis (P2), and Real-time Monitoring (P3). Use 'scan' to trigger the active phase."
    },
    {
      title: "Auto-Remediation",
      content: "When vulnerabilities are found in P1, Aegis generates AI patches. You can apply these patches directly through the CLI or review them in the web dashboard before deployment."
    }
  ]

  return (
    <div className={styles.terminalContainer} style={{ overflowY: 'auto', padding: '40px' }}>
      <div className={styles.scanline} />
      <div className={styles.vignette} />
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-5xl mx-auto"
      >
        <header className="mb-20 border-b border-red-900/30 pb-12">
          <Link href="/" className="text-red-500 hover:text-red-400 mb-8 inline-block uppercase font-bold tracking-[0.3em] text-xs">← Kembali ke Core</Link>
          <h1 className="text-7xl font-black gradient-text mb-6 sans uppercase tracking-tighter leading-none">Panduan Sistem</h1>
          <p className="text-2xl text-zinc-400 font-light max-w-2xl">Dokumentasi komprehensif untuk pengoperasian Platform Keamanan Aegis.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 hover:border-red-600/50 transition-colors group"
            >
              <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-widest group-hover:text-red-500 transition-colors">
                {idx + 1}. {section.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <section className="mt-20 glass-card p-12 bg-red-950/5 border-red-900/20">
          <h2 className="text-3xl font-black mb-8 uppercase sans gradient-text">Intelligence Comparison</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 border border-zinc-900 rounded bg-black/40">
              <div className="w-32 font-bold text-red-500 uppercase text-xs tracking-widest">Aegis Pro</div>
              <div className="flex-1 text-xs text-zinc-400">High-speed reasoning, full context awareness, cloud-powered security patterns.</div>
              <div className="text-green-500 font-bold text-xs">ELITE</div>
            </div>
            <div className="flex items-center gap-6 p-4 border border-zinc-900 rounded bg-black/40">
              <div className="w-32 font-bold text-zinc-500 uppercase text-xs tracking-widest">Ollama</div>
              <div className="flex-1 text-xs text-zinc-400">100% Offline, maximum privacy, requires local hardware. Lower logic depth.</div>
              <div className="text-yellow-500 font-bold text-xs">PRIVACY</div>
            </div>
            <div className="flex items-center gap-6 p-4 border border-zinc-900 rounded bg-black/40">
              <div className="w-32 font-bold text-blue-500 uppercase text-xs tracking-widest">Custom AI</div>
              <div className="flex-1 text-xs text-zinc-400">Bring your own GPT-4/Claude keys. Balanced speed and intelligence.</div>
              <div className="text-blue-500 font-bold text-xs">FLEXIBLE</div>
            </div>
          </div>
        </section>

        <footer className="mt-24 pt-10 border-t border-zinc-900 flex justify-between items-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <div>Aegis Secure Systems v2.3.0</div>
          <div>Authorized Personnel Only</div>
          <div>© 2026 Aegis Security</div>
        </footer>
      </motion.div>
    </div>
  )
}
