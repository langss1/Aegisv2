'use server'
import { createClient } from '@/utils/supabase/server'

export async function getGitHubRepos() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.provider_token) {
    return { error: 'No GitHub token found. Please sign in with GitHub again.' }
  }

  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repositories from GitHub')
    }

    const repos = await response.json()
    return { repos }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function analyzeGitHubRepo(repoFullName: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.provider_token) {
    return { stack: [], error: 'GitHub connection lost. Please re-login.' }
  }

  try {
    const headers = {
      'Authorization': `Bearer ${session.provider_token}`,
      'Accept': 'application/vnd.github.v3+json'
    }

    // 1. Fetch Full Recursive Tree
    const treeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees/main?recursive=1`, { headers })
    const treeData = treeRes.ok ? await treeRes.json() : { tree: [] }
    const tree = treeData.tree || []
    const filePaths = tree.map((f: any) => f.path)

    const detected = new Set<string>()
    const insights = []

    // 2. Identify High-Value Files for Deep Read
    const highValueFiles = tree.filter((f: any) => 
      ['README.md', 'package.json', 'docker-compose.yml', 'Dockerfile', '.env.example', 'vercel.json', 'next.config.js', 'prisma/schema.prisma'].includes(f.path.split('/').pop() || '')
    )

    // 3. Parallel Deep Analysis (Membuka Isi File)
    const analysisPromises = highValueFiles.map(async (file: any) => {
      try {
        const res = await fetch(file.url, { headers })
        const data = await res.json()
        const content = atob(data.content || '')
        const fileName = file.path.toLowerCase()

        // Analyze README.md
        if (fileName.includes('readme.md')) {
          if (content.toLowerCase().includes('postgresql')) detected.add('PostgreSQL Database')
          if (content.toLowerCase().includes('redis')) detected.add('Redis Cache')
          if (content.toLowerCase().includes('docker')) detected.add('Dockerized Infrastructure')
        }

        // Analyze .env.example
        if (fileName.includes('.env.example')) {
          if (content.includes('STRIPE_')) detected.add('Stripe Payments')
          if (content.includes('AWS_')) detected.add('AWS Infrastructure')
          if (content.includes('SUPABASE_')) detected.add('Supabase Backend')
        }

        // Analyze docker-compose
        if (fileName.includes('docker-compose')) {
          if (content.includes('image: postgres')) detected.add('Postgres Container (Self-Hosted)')
          if (content.includes('image: redis')) detected.add('Redis Container')
        }

        // Analyze package.json (Deep Dependencies)
        if (fileName.includes('package.json')) {
          const pkg = JSON.parse(content)
          const all = { ...pkg.dependencies, ...pkg.devDependencies }
          if (all['next']) detected.add(`Next.js ${all['next']}`)
          if (all['typescript']) detected.add('Strict TypeScript Architecture')
          if (all['prisma']) detected.add('Prisma ORM Layer')
          if (all['tailwindcss']) detected.add('Tailwind CSS Design System')
        }
      } catch (e) {
        console.error('File analysis error:', file.path, e)
      }
    })

    await Promise.all(analysisPromises)

    // 4. Structural Logic Mapping
    if (filePaths.some(p => p.startsWith('src/app') || p.startsWith('app/'))) detected.add('Next.js App Router (Modern Architecture)')
    if (filePaths.some(p => p.includes('actions/'))) detected.add('Server Actions Communication Pattern')
    if (filePaths.some(p => p.includes('middleware.ts'))) detected.add('Edge Security Middleware')
    if (filePaths.some(p => p.includes('.github/workflows'))) detected.add('GitHub Actions CI/CD Pipeline')

    // 5. Language Stats
    const langRes = await fetch(`https://api.github.com/repos/${repoFullName}/languages`, { headers })
    const languages = langRes.ok ? await langRes.json() : {}
    Object.keys(languages).slice(0, 2).forEach(l => {
      if (l !== 'CSS' && l !== 'HTML') detected.add(l)
    })

    // Deduplicate and filter
    const finalStack = Array.from(detected)

    return { 
      stack: finalStack,
      isDeepAudit: true
    }
  } catch (err) {
    console.error('Deep Audit error:', err)
    return { stack: ['Deep Audit Interrupted'], error: 'Deep analysis failed' }
  }
}
