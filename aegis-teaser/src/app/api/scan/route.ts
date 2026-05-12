import { NextRequest, NextResponse } from 'next/server'

// Security vulnerability patterns (based on AEGIS-v2 analyzer)
const patterns: Record<string, RegExp> = {
  "Hardcoded API Key": /(?:api[_-]?key|apikey|token)\s*=\s*['"][^'"]+['"]/gi,
  "Hardcoded Password": /password\s*=\s*['"][^'"]+['"]/gi,
  "Hardcoded Secret": /(?:secret|private[_-]?key)\s*=\s*['"][^'"]+['"]/gi,
  "Eval Usage": /\beval\s*\(/gi,
  "Exec Usage": /\bexec\s*\(/gi,
  "Debug Mode": /debug\s*=\s*(?:true|True|1)/gi,
  "SQL Injection Risk": /(?:SELECT|INSERT|UPDATE|DELETE).*(?:\+|`|\$\{)/gi,
  "Command Injection": /(?:exec|spawn|execSync)\s*\([^)]*(?:\+|`|\$\{)/gi,
  "XSS Vulnerability": /(?:innerHTML|dangerouslySetInnerHTML|res\.send)\s*[=(].*(?:req\.|user|input)/gi,
  "Path Traversal": /(?:readFile|writeFile|unlink|rmdir)\s*\([^)]*(?:\+|`|\$\{)/gi,
  "Insecure Random": /Math\.random\s*\(\)/gi,
  "Console Log Sensitive": /console\.log\s*\([^)]*(?:password|secret|token|key|credential)/gi,
}

const severityMap: Record<string, 'Critical' | 'High' | 'Medium' | 'Low'> = {
  "Hardcoded API Key": "Critical",
  "Hardcoded Password": "Critical",
  "Hardcoded Secret": "Critical",
  "SQL Injection Risk": "Critical",
  "Command Injection": "Critical",
  "XSS Vulnerability": "High",
  "Path Traversal": "High",
  "Eval Usage": "High",
  "Exec Usage": "Medium",
  "Debug Mode": "Medium",
  "Insecure Random": "Low",
  "Console Log Sensitive": "Medium",
}

const fixSuggestions: Record<string, { description: string, fix: string }> = {
  "Hardcoded API Key": {
    description: "API keys should be stored in environment variables, not in source code.",
    fix: "Use process.env.API_KEY or os.environ.get('API_KEY') instead of hardcoding."
  },
  "Hardcoded Password": {
    description: "Passwords should never be stored in source code.",
    fix: "Use environment variables or a secure secrets manager."
  },
  "Hardcoded Secret": {
    description: "Secrets and private keys must be externalized.",
    fix: "Store in environment variables or use a secrets management service."
  },
  "SQL Injection Risk": {
    description: "Dynamic SQL queries can allow attackers to inject malicious SQL.",
    fix: "Use parameterized queries or prepared statements."
  },
  "Command Injection": {
    description: "User input in shell commands can lead to arbitrary command execution.",
    fix: "Use spawn with array arguments instead of exec with string concatenation."
  },
  "XSS Vulnerability": {
    description: "Rendering user input without sanitization can lead to cross-site scripting.",
    fix: "Sanitize user input before rendering or use safe templating methods."
  },
  "Path Traversal": {
    description: "User-controlled paths can allow access to sensitive files.",
    fix: "Validate and sanitize file paths, use path.resolve() and check against allowed directories."
  },
  "Eval Usage": {
    description: "eval() executes arbitrary code and is a security risk.",
    fix: "Avoid eval() entirely. Use JSON.parse() for JSON data or safer alternatives."
  },
  "Exec Usage": {
    description: "exec() can be dangerous if user input is passed to shell commands.",
    fix: "Use spawn() with array arguments for better security."
  },
  "Debug Mode": {
    description: "Debug mode in production can expose sensitive information.",
    fix: "Ensure debug mode is disabled in production environments."
  },
  "Insecure Random": {
    description: "Math.random() is not cryptographically secure.",
    fix: "Use crypto.randomBytes() or crypto.getRandomValues() for security-sensitive operations."
  },
  "Console Log Sensitive": {
    description: "Logging sensitive data can expose credentials in logs.",
    fix: "Remove console.log statements that contain sensitive information."
  },
}

interface Finding {
  id: number
  file: string
  issue: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  line: number
  currentCode: string
  fixedCode: string
  description: string
}

async function fetchRepoContents(repoUrl: string, token?: string): Promise<{ path: string, content: string }[]> {
  // Parse GitHub URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) {
    throw new Error('Invalid GitHub URL')
  }
  
  const [, owner, repo] = match
  const repoName = repo.replace(/\.git$/, '')
  
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AEGIS-Scanner'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  // Get repository tree
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`,
    { headers }
  )
  
  if (!treeResponse.ok) {
    // Try master branch
    const masterResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/master?recursive=1`,
      { headers }
    )
    if (!masterResponse.ok) {
      throw new Error('Could not fetch repository tree')
    }
    const masterData = await masterResponse.json()
    return processTree(masterData.tree, owner, repoName, headers)
  }
  
  const treeData = await treeResponse.json()
  return processTree(treeData.tree, owner, repoName, headers)
}

async function processTree(
  tree: any[], 
  owner: string, 
  repo: string, 
  headers: Record<string, string>
): Promise<{ path: string, content: string }[]> {
  const files: { path: string, content: string }[] = []
  const scanExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.php', '.rb', '.go', '.env', '.yml', '.yaml']
  const excludeDirs = ['node_modules', '.git', '__pycache__', 'venv', 'dist', 'build', '.next']
  
  const filesToScan = tree.filter((item: any) => {
    if (item.type !== 'blob') return false
    if (excludeDirs.some(dir => item.path.includes(`/${dir}/`) || item.path.startsWith(`${dir}/`))) return false
    return scanExtensions.some(ext => item.path.endsWith(ext))
  }).slice(0, 50) // Limit to 50 files for performance
  
  for (const file of filesToScan) {
    try {
      const contentResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        { headers }
      )
      
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        if (contentData.content) {
          const content = Buffer.from(contentData.content, 'base64').toString('utf-8')
          files.push({ path: file.path, content })
        }
      }
    } catch (e) {
      // Skip files that can't be read
      continue
    }
  }
  
  return files
}

function scanContent(files: { path: string, content: string }[]): Finding[] {
  const findings: Finding[] = []
  let id = 1
  
  for (const file of files) {
    const lines = file.content.split('\n')
    
    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum]
      
      // Skip comment lines and empty lines
      if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim() === '') {
        continue
      }
      
      // Skip lines marked as fixed
      if (line.includes('AEGIS: FIXED') || line.includes('// safe')) {
        continue
      }
      
      // Skip env variable usage (not hardcoded)
      if (line.includes('process.env') || line.includes('os.environ') || line.includes('os.getenv')) {
        continue
      }
      
      for (const [issue, pattern] of Object.entries(patterns)) {
        pattern.lastIndex = 0 // Reset regex
        if (pattern.test(line)) {
          const suggestion = fixSuggestions[issue]
          
          findings.push({
            id: id++,
            file: file.path,
            issue,
            severity: severityMap[issue],
            line: lineNum + 1,
            currentCode: line.trim(),
            fixedCode: generateFix(line.trim(), issue),
            description: suggestion?.description || `Potential ${issue} detected`
          })
        }
      }
    }
  }
  
  // Sort by severity
  const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  
  return findings
}

function generateFix(code: string, issue: string): string {
  switch (issue) {
    case "Hardcoded API Key":
      return code.replace(/(['"])[^'"]+\1/, 'process.env.API_KEY')
    case "Hardcoded Password":
      return code.replace(/(['"])[^'"]+\1/, 'process.env.DB_PASSWORD')
    case "Hardcoded Secret":
      return code.replace(/(['"])[^'"]+\1/, 'process.env.SECRET_KEY')
    case "SQL Injection Risk":
      return '// Use parameterized query instead\n' + code.replace(/\+.*$/, ', [params])')
    case "Eval Usage":
      return code.replace(/eval\s*\(/, 'JSON.parse(')
    case "Debug Mode":
      return code.replace(/true|True|1/, 'false')
    case "Insecure Random":
      return code.replace(/Math\.random\(\)/, 'crypto.randomUUID()')
    default:
      return `// AEGIS: Review and fix manually\n${code}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { repoUrl, token } = body
    
    if (!repoUrl) {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 })
    }
    
    // Fetch and scan repository
    const files = await fetchRepoContents(repoUrl, token)
    const findings = scanContent(files)
    
    return NextResponse.json({
      success: true,
      scannedFiles: files.length,
      totalFindings: findings.length,
      findings,
      summary: {
        critical: findings.filter(f => f.severity === 'Critical').length,
        high: findings.filter(f => f.severity === 'High').length,
        medium: findings.filter(f => f.severity === 'Medium').length,
        low: findings.filter(f => f.severity === 'Low').length,
      }
    })
  } catch (error: any) {
    console.error('Scan error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to scan repository' 
    }, { status: 500 })
  }
}
