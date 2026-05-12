import { NextRequest, NextResponse } from 'next/server'

const VERCEL_API = 'https://api.vercel.com'

interface DeploymentStatus {
  id: string
  url: string
  status: 'BUILDING' | 'ERROR' | 'READY' | 'QUEUED' | 'CANCELED'
  readyState: string
}

// Deploy a GitHub repo to Vercel
async function deployToVercel(repoUrl: string, projectName: string): Promise<{
  deploymentId: string
  url: string
  projectId: string
}> {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    throw new Error('VERCEL_TOKEN not configured')
  }

  // Parse GitHub URL to get owner and repo
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/)
  if (!match) {
    throw new Error('Invalid GitHub URL format')
  }
  const [, owner, repo] = match

  // Clean project name (Vercel requirements)
  const cleanName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)

  // Step 1: Create or get project
  let projectId: string
  
  try {
    // Try to create new project
    const createProjectRes = await fetch(`${VERCEL_API}/v9/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `aegis-${cleanName}-${Date.now().toString(36)}`,
        gitRepository: {
          type: 'github',
          repo: `${owner}/${repo}`
        },
        framework: null // Auto-detect
      })
    })

    const projectData = await createProjectRes.json()
    
    if (projectData.error) {
      // If project exists or other error, try direct deployment
      console.log('Project creation response:', projectData)
    }
    
    projectId = projectData.id || `aegis-${cleanName}`
  } catch (e) {
    projectId = `aegis-${cleanName}`
  }

  // Step 2: Create deployment from GitHub
  const deployRes = await fetch(`${VERCEL_API}/v13/deployments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `aegis-${cleanName}`,
      gitSource: {
        type: 'github',
        org: owner,
        repo: repo,
        ref: 'main' // or master
      },
      projectSettings: {
        framework: null // Auto-detect
      }
    })
  })

  const deployData = await deployRes.json()
  
  if (deployData.error) {
    // Try with 'master' branch if 'main' fails
    const retryRes = await fetch(`${VERCEL_API}/v13/deployments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `aegis-${cleanName}`,
        gitSource: {
          type: 'github',
          org: owner,
          repo: repo,
          ref: 'master'
        }
      })
    })
    
    const retryData = await retryRes.json()
    if (retryData.error) {
      throw new Error(retryData.error.message || 'Deployment failed')
    }
    
    return {
      deploymentId: retryData.id,
      url: `https://${retryData.url}`,
      projectId: retryData.projectId || projectId
    }
  }

  return {
    deploymentId: deployData.id,
    url: `https://${deployData.url}`,
    projectId: deployData.projectId || projectId
  }
}

// Check deployment status
async function getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    throw new Error('VERCEL_TOKEN not configured')
  }

  const res = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const data = await res.json()
  
  return {
    id: data.id,
    url: data.url ? `https://${data.url}` : '',
    status: data.readyState || data.state,
    readyState: data.readyState
  }
}

// Delete deployment/project
async function deleteDeployment(deploymentId: string): Promise<boolean> {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    throw new Error('VERCEL_TOKEN not configured')
  }

  const res = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return res.ok
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, repoUrl, projectName, deploymentId } = body

    if (action === 'deploy') {
      if (!repoUrl) {
        return NextResponse.json({ error: 'repoUrl is required' }, { status: 400 })
      }

      const result = await deployToVercel(repoUrl, projectName || 'test-app')
      
      return NextResponse.json({
        success: true,
        deploymentId: result.deploymentId,
        url: result.url,
        projectId: result.projectId,
        message: 'Deployment started'
      })
    }

    if (action === 'status') {
      if (!deploymentId) {
        return NextResponse.json({ error: 'deploymentId is required' }, { status: 400 })
      }

      const status = await getDeploymentStatus(deploymentId)
      
      return NextResponse.json({
        success: true,
        ...status
      })
    }

    if (action === 'delete') {
      if (!deploymentId) {
        return NextResponse.json({ error: 'deploymentId is required' }, { status: 400 })
      }

      const deleted = await deleteDeployment(deploymentId)
      
      return NextResponse.json({
        success: deleted,
        message: deleted ? 'Deployment deleted' : 'Failed to delete'
      })
    }

    return NextResponse.json({ error: 'Invalid action. Use: deploy, status, delete' }, { status: 400 })
  } catch (error: any) {
    console.error('Vercel API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Vercel operation failed' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const deploymentId = request.nextUrl.searchParams.get('deploymentId')
  
  if (!deploymentId) {
    return NextResponse.json({ error: 'deploymentId required' }, { status: 400 })
  }

  try {
    const status = await getDeploymentStatus(deploymentId)
    return NextResponse.json(status)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
