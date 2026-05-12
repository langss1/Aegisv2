'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './terminal.module.css'

type LogEntry = {
  id: number
  type: 'input' | 'output' | 'error' | 'success' | 'info'
  content: string | React.ReactNode
}

function TerminalContent() {
  const searchParams = useSearchParams()
  const initialPath = searchParams.get('path') || 'C:\\Project Sems 6\\aegis'
  const [currentPath, setCurrentPath] = useState(initialPath)
  
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, type: 'info', content: `SYSTEM READY. NODE CONNECTED AT: ${initialPath}` },
    { id: 2, type: 'info', content: 'Type "aegis" to initialize the agent core.' },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const focusInput = () => inputRef.current?.focus()

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newLogs = [...logs, { id: Date.now(), type: 'input', content: input }] as LogEntry[]
    const cmd = input.trim().toLowerCase()
    
    // Command logic
    if (cmd === 'aegis') {
      newLogs.push({ id: Date.now() + 1, type: 'success', content: `
   _____  __________________________________
  /  _  \\ \\_   _____/\\_   _____/\\_   _____/
 /  /_\\  \\ |    __)_  |    __)_  |    __)  
/    |    \\|        \\ |        \\ |        \\
\\____|__  /_______  //_______  //_______  /
        \\/        \\/         \\/         \\/ 
[ AGENT CORE INITIALIZED ]
[ ACCESS LEVEL: ROOT_ADMIN ]
[ SYSTEM: AUTONOMOUS_MODE_ENABLED ]
[ WORKING DIR: ${currentPath} ]
--------------------------------------------------
Welcome to AEGIS Command Interface.
Type "/help" to begin security operations.
--------------------------------------------------`})
    }
    else if (cmd === '/help') {
      newLogs.push({ id: Date.now() + 1, type: 'info', content: `
AVAILABLE COMMANDS:
--------------------------------------------------
/help           - Display this help menu
/models         - List available security AI models
/status         - Check agent system health
/clear          - Clear the terminal screen
/path [dir]     - Change current working directory
scan [target]   - Start autonomous security scan
heal [file]    - Apply AI patch to vulnerable file
--------------------------------------------------`})
    } 
    else if (cmd === '/models') {
      newLogs.push({ id: Date.now() + 1, type: 'success', content: `
DEPLOYED MODELS:
[ID]            [NAME]          [PHASE]         [STATUS]
--------------------------------------------------------
AE-GPT-4        Aegis Core V4   SAST/DAST       ONLINE
DEEP-SEEK-S1    Vulnerability   Analysis        ONLINE
CLAUDE-3.5-S    Agentic Reasoning Logic         ONLINE
AE-HEAL-V2      Auto-Patch Gen  Remediation     ONLINE
--------------------------------------------------------`})
    }
    else if (cmd === '/status') {
      newLogs.push({ id: Date.now() + 1, type: 'info', content: `SYSTEM STATUS: [OK]\nAI AGENT: [ACTIVE]\nLOCATION: ${currentPath}\nNETWORK: [PROTECTED]\nLATENCY: 12ms` })
    }
    else if (cmd === '/clear' || cmd === 'clear' || cmd === 'cls') {
      setLogs([
        { id: Date.now(), type: 'info', content: `SYSTEM RELOADED. NODE: ${currentPath}` },
        { id: Date.now() + 1, type: 'info', content: 'Type "aegis" to initialize the agent core.' },
      ])
      setInput('')
      return
    }
    else if (cmd.startsWith('/path ')) {
      const newP = cmd.substring(6).trim()
      setCurrentPath(newP)
      newLogs.push({ id: Date.now() + 1, type: 'success', content: `Working directory changed to: ${newP}` })
    }
    else if (cmd.startsWith('scan ') || cmd === 'scan') {
      const target = cmd.split(' ')[1] || 'current_workspace'
      newLogs.push({ id: Date.now() + 1, type: 'info', content: `[AI_ANALYSIS] Initializing Deep Scan for: ${target}...` })
      
      // Call Backend
      fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'aegis', prompt: `Scan ${target}` })
      })
      .then(res => res.json())
      .then(data => {
        setLogs(prev => [...prev, { id: Date.now() + 2, type: 'success', content: data.response || 'Scan complete.' }])
      })
    }
    else if (cmd.startsWith('ai ')) {
      const prompt = cmd.substring(3)
      newLogs.push({ id: Date.now() + 1, type: 'info', content: `[THINKING] Connecting to Aegis Core...` })
      
      fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'aegis', prompt })
      })
      .then(res => res.json())
      .then(data => {
        setLogs(prev => [...prev, { id: Date.now() + 2, type: 'success', content: data.response }])
      })
    }
    else {
      newLogs.push({ id: Date.now() + 1, type: 'error', content: `Command not found: "${input}". Type "/help" for list of commands.` })
    }

    setLogs(newLogs)
    setInput('')
  }

  const shortPath = currentPath.split(/[\\/]/).pop() || currentPath

  return (
    <div className={styles.terminalContainer} onClick={focusInput}>
      <div className={styles.scanline} />
      <div className={styles.vignette} />
      
      <div className={styles.edgeGlowLeft} />
      <div className={styles.edgeGlowRight} />

      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.headerIcon}>🛡️</span>
          <span>AEGIS_CLI_v2.0_AGENT</span>
          <span className={styles.headerPath}>[{currentPath}]</span>
        </div>
        <div className={styles.headerStatus}>
          <span className={styles.pulse} />
          SYSTEM_ARMED
        </div>
      </header>

      <div className={styles.terminalBody} ref={scrollRef}>
        <div className={styles.logList}>
          {logs.map((log) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -5 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`${styles.logEntry} ${styles[log.type]}`}
            >
              {log.type === 'input' && <span className={styles.prompt}>aegis@{shortPath}:~# </span>}
              <pre className={styles.preContent}>{log.content}</pre>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleCommand} className={styles.inputArea}>
          <span className={styles.prompt}>aegis@{shortPath}:~# </span>
          <input
            ref={inputRef}
            type="text"
            autoFocus
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.input}
          />
          <span className={styles.cursor} />
        </form>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerItem}>USER: AEGIS_ROOT</div>
        <div className={styles.footerItem}>PATH: {currentPath}</div>
        <div className={styles.footerItem}>MODE: AUTONOMOUS_ENFORCER</div>
      </footer>
    </div>
  )
}

export default function TerminalPage() {
  return (
    <Suspense fallback={<div>Loading Aegis Core...</div>}>
      <TerminalContent />
    </Suspense>
  )
}
