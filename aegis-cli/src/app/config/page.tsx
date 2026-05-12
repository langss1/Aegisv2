'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from '../terminal.module.css'
import Link from 'next/link'

export default function ConfigPage() {
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')

  const handleSave = () => {
    alert(`Configuration saved for ${provider}. Aegis will now use your custom key.`)
    // In a real app, we would save this to local storage or a config file
  }

  return (
    <div className={styles.terminalContainer} style={{ padding: '40px' }}>
      <div className={styles.scanline} />
      <div className={styles.vignette} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto glass-card p-10 bg-zinc-900/80 mt-10"
      >
        <Link href="/" className="text-red-500 hover:text-red-400 mb-6 inline-block text-sm uppercase font-bold tracking-widest">← Return to Core</Link>
        
        <h1 className="text-4xl font-black mb-2 sans uppercase gradient-text">Intelligence Config</h1>
        <p className="text-zinc-500 mb-10 text-sm">Deploy your own AI models into the Aegis Security Pipeline.</p>

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-3 tracking-widest">Select Provider</label>
            <div className="grid grid-cols-3 gap-4">
              {['openai', 'google', 'deepseek'].map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`py-3 rounded border transition-all uppercase text-xs font-bold ${
                    provider === p 
                    ? 'border-red-600 bg-red-600/20 text-white' 
                    : 'border-zinc-800 bg-black/40 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-3 tracking-widest">Secure API Key</label>
            <input
              type="password"
              placeholder="sk-••••••••••••••••••••••••••••"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded p-4 text-red-400 mono focus:border-red-600 outline-none transition-colors"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
          >
            Authenticate & Deploy
          </button>
        </div>

        <div className="mt-10 p-4 border border-red-900/30 bg-red-950/10 rounded flex items-start gap-4">
          <span className="text-red-500 mt-1">⚠️</span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your API keys are processed locally and never stored on Aegis servers. 
            Usage costs incurred through third-party APIs are the responsibility of the user.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
