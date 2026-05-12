'use client'
import { motion } from 'framer-motion'
import styles from '../../terminal.module.css'
import Link from 'next/link'

export default function OllamaDocs() {
  return (
    <div className={styles.terminalContainer} style={{ overflowY: 'auto', padding: '40px' }}>
      <div className={styles.scanline} />
      <div className={styles.vignette} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-12">
          <Link href="/" className="text-red-500 hover:text-red-400 mb-4 inline-block">← Back to Terminal</Link>
          <h1 className="text-5xl font-black gradient-text mb-4 sans uppercase tracking-tighter">
            Ollama Offline Engine
          </h1>
          <p className="text-xl text-zinc-400">Setup guide for local autonomous security intelligence.</p>
        </header>

        <section className="space-y-12">
          <div className="glass-card p-8 border-l-4 border-red-600 bg-zinc-900/50">
            <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest">1. Install Ollama</h2>
            <p className="text-zinc-300 mb-4">Download and install the Ollama framework for your operating system.</p>
            <div className="bg-black/50 p-4 rounded mono text-sm text-red-400 border border-zinc-800">
              curl -fsSL https://ollama.com/install.sh | sh
            </div>
          </div>

          <div className="glass-card p-8 border-l-4 border-red-600 bg-zinc-900/50">
            <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest">2. Pull Security Models</h2>
            <p className="text-zinc-300 mb-4">We recommend high-performance models optimized for code analysis.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded border border-zinc-800">
                <span className="text-white font-bold block mb-2">DeepSeek Coder</span>
                <code className="text-red-400 text-xs">ollama run deepseek-coder:6.7b</code>
              </div>
              <div className="bg-black/50 p-4 rounded border border-zinc-800">
                <span className="text-white font-bold block mb-2">Llama 3 Security</span>
                <code className="text-red-400 text-xs">ollama run llama3</code>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-l-4 border-red-600 bg-zinc-900/50">
            <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest">3. Link to Aegis</h2>
            <p className="text-zinc-300 mb-4">Ensure the Ollama API is running locally (default: port 11434).</p>
            <div className="bg-black/50 p-4 rounded mono text-sm text-green-400 border border-zinc-800">
              [SYSTEM] Checking endpoint... http://localhost:11434/api/generate
            </div>
            <p className="mt-4 text-sm text-zinc-500 italic">Aegis will automatically detect the local instance once active.</p>
          </div>
        </section>

        <footer className="mt-20 pt-10 border-t border-zinc-900 text-center text-zinc-600 text-sm">
          AEGIS SECURE DOCS // VERSION 2.0 // OFFLINE_MODE_SUPPORT
        </footer>
      </motion.div>
    </div>
  )
}
