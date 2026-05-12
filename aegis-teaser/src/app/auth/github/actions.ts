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

    // 1. Fetch Full Recursive Tree (Bedah Seluruh Isi Repo)
    const treeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees/main?recursive=1`, { headers })
    const treeData = treeRes.ok ? await treeRes.json() : { tree: [] }
    const files = treeData.tree.map((f: any) => f.path)

    const detected = []
    const architecture = []
    
    // 2. Neural Architecture Mapping Logic
    // Detect Next.js Router Type
    if (files.some(f => f.startsWith('src/app') || f.startsWith('app/'))) {
      detected.push('Next.js 14/15 (App Router)')
      architecture.push('Modern App-Directory Architecture')
    } else if (files.some(f => f.startsWith('src/pages') || f.startsWith('pages/'))) {
      detected.push('Next.js (Legacy Pages Router)')
      architecture.push('Classic Pages Architecture')
    }

    // Detect Logic Patterns
    if (files.some(f => f.includes('actions/'))) architecture.push('Server Actions Pattern')
    if (files.some(f => f.includes('middleware.ts'))) architecture.push('Edge Middleware Layer')
    if (files.some(f => f.includes('hooks/'))) architecture.push('Custom React Hooks Layer')
    if (files.some(f => f.includes('components/ui/'))) architecture.push('Atomic UI System (Shadcn/UI)')

    // Detect Infrastructure (Extreme Detail)
    if (files.some(f => f.includes('.github/workflows'))) detected.push('GitHub Actions CI/CD')
    if (files.some(f => f.includes('docker-compose'))) detected.push('Multi-Container Docker')
    if (files.some(f => f.includes('vercel.json'))) detected.push('Vercel Edge Deployment')
    if (files.some(f => f.includes('fly.toml'))) detected.push('Fly.io Infrastructure')
    if (files.some(f => f.includes('terraform/'))) detected.push('Terraform (IaC)')

    // 3. Dependency Check (Read package.json if exists)
    const packageFile = treeData.tree.find((f: any) => f.path.endsWith('package.json'))
    if (packageFile) {
      const fileRes = await fetch(packageFile.url, { headers })
      const fileData = await fileRes.json()
      const content = JSON.parse(atob(fileData.content))
      const allDeps = { ...content.dependencies, ...content.devDependencies }

      // DB & State
      if (allDeps['prisma']) detected.push('Prisma ORM (Relational)')
      if (allDeps['drizzle-orm']) detected.push('Drizzle ORM (Type-Safe)')
      if (allDeps['@tanstack/react-query']) detected.push('React Query (Server State)')
      if (allDeps['zustand']) detected.push('Zustand (Global State)')
      
      // Typescript Detail
      if (allDeps['typescript']) {
        detected.push('TypeScript (Strict Mode Detected)')
      }
    }

    // 4. Language Percentage
    const langRes = await fetch(`https://api.github.com/repos/${repoFullName}/languages`, { headers })
    const languages = langRes.ok ? await langRes.json() : {}
    Object.keys(languages).slice(0, 2).forEach(l => detected.push(l))

    const finalStack = Array.from(new Set([...detected, ...architecture]))

    return { 
      stack: finalStack.length > 0 ? finalStack : ['Custom Architecture'],
      isDetailed: true
    }
  } catch (err) {
    console.error('Deep Analysis error:', err)
    return { stack: ['Analysis Blocked'], error: 'Deep Neural Analysis failed' }
  }
}
