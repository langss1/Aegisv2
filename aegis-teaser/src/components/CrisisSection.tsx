'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, ShieldAlert, Zap, Lock, Activity } from 'lucide-react'

const crises = [
  {
    id: 1,
    title: "Critical Zero-Day Exploit Found in Global Cloud Mesh",
    date: "May 15, 2026",
    category: "Alert",
    icon: <ShieldAlert size={48} className="text-red-600" />,
    link: "#"
  },
  {
    id: 2,
    title: "Autonomous AI Malware: The Next Evolution of Ransomware",
    date: "May 12, 2026",
    category: "Intel",
    icon: <Zap size={48} className="text-red-600" />,
    link: "#"
  },
  {
    id: 3,
    title: "Quantum Supremacy and the Collapse of RSA-2048",
    date: "May 08, 2026",
    category: "Research",
    icon: <Lock size={48} className="text-red-600" />,
    link: "#"
  },
  {
    id: 4,
    title: "Major Financial Data Breach: 500M Records Leaked",
    date: "May 01, 2026",
    category: "Incident",
    icon: <Activity size={48} className="text-red-600" />,
    link: "#"
  }
]

export default function CrisisSection() {
  return (
    <section className="py-24 px-6 md:px-20 bg-white text-black font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1a1a1a]">
            Security Crisis
          </h2>
          <Link 
            href="#" 
            className="px-6 py-2.5 rounded-full border border-neutral-200 bg-[#f8f9fa] text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            View all
          </Link>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crises.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6 bg-neutral-50 group-hover:bg-red-50 transition-colors flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-red-100/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                  {item.icon}
                </div>
              </div>
              
              <div className="space-y-3 pr-4">
                <h3 className="text-[1.75rem] font-medium leading-[1.2] tracking-tight text-[#1a1a1a] group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm font-normal text-neutral-500">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                  <span>{item.category}</span>
                </div>
                
                <Link 
                  href={item.link}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a] mt-2 group-hover:gap-3 transition-all"
                >
                  Read blog <ChevronRight size={14} className="mt-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- FOOTER CONTROLS --- */}
        <div className="mt-12 flex items-center gap-3">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f8f9fa] border border-neutral-100 hover:bg-neutral-100 transition-colors">
            <ChevronLeft size={20} className="text-neutral-600" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f8f9fa] border border-neutral-100 hover:bg-neutral-100 transition-colors">
            <ChevronRight size={20} className="text-neutral-600" />
          </button>
        </div>
      </div>
    </section>
  )
}
