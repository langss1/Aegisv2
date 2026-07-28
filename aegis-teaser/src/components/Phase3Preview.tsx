'use client'
import { motion } from 'framer-motion'
import { Shield, Eye, Zap, ArrowRight, Activity, Lock } from 'lucide-react'
import Link from 'next/link'

export default function Phase3Preview() {
  return (
    <section className="py-32 px-6 md:px-20 bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              New: Phase 3 Monitoring
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Real-time Defense & <br />
              <span className="text-green-500">Self-Healing</span> Dashboard
            </h2>
            
            <p className="text-xl text-neutral-400 max-w-lg leading-relaxed">
              Detect attacks as they happen. Aegis Phase 3 provides a mission-control interface for your autonomous security fleet.
            </p>
            
            <ul className="space-y-4">
              {[
                { icon: <Activity size={20} />, text: "Live attack detection & blocking" },
                { icon: <Lock size={20} />, text: "AI-powered self-healing WAF" },
                { icon: <Eye size={20} />, text: "CVE monitoring & auto-patching" }
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-neutral-300 font-medium"
                >
                  <div className="text-green-500">{item.icon}</div>
                  {item.text}
                </motion.li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-green-500 hover:text-white transition-all group"
              >
                Launch Dashboard <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Right: Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              {/* Fake UI Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="px-4 py-1 rounded-md bg-white/5 text-[10px] font-mono text-neutral-500">
                  ae-dashboard-v3.0.1
                </div>
              </div>
              
              {/* Fake Metrics Grid */}
              <div className="p-8 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-widest">Attacks Blocked</div>
                  <div className="text-4xl font-bold text-green-500 font-mono">1,248</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-widest">System Health</div>
                  <div className="text-4xl font-bold text-white font-mono">99.9%</div>
                </div>
                <div className="col-span-2 p-6 rounded-2xl bg-green-500/10 border border-green-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-green-500 uppercase tracking-widest font-bold">Self-Healing Event</div>
                    <div className="text-[10px] text-green-500/60 font-mono">2m ago</div>
                  </div>
                  <div className="h-2 w-full bg-green-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="text-sm text-neutral-300 font-mono">
                    PATCH APPLIED: CVE-2026-1042 Remediation... <span className="text-green-500 underline">DONE</span>
                  </div>
                </div>
              </div>
              
              {/* Scanning Lines */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                  className="w-full h-1/2 bg-gradient-to-b from-green-500/5 to-transparent border-t border-green-500/20"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 p-6 rounded-2xl bg-neutral-800 border border-white/10 shadow-2xl backdrop-blur-xl"
            >
              <Zap className="text-yellow-500 mb-2" size={32} />
              <div className="text-xl font-bold">0.4ms</div>
              <div className="text-[10px] text-neutral-500 uppercase">Detection Latency</div>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
