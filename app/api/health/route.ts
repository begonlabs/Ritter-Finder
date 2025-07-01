import { NextRequest, NextResponse } from 'next/server'

/**
 * Health check endpoint for Docker health monitoring
 * Returns application status and basic system information
 */
export async function GET(request: NextRequest) {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
      // Basic connectivity checks
      checks: {
        database: await checkDatabase(),
        environment: checkEnvironment(),
      }
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

/**
 * Check database connectivity (basic check)
 */
async function checkDatabase(): Promise<{ status: string; message?: string }> {
  try {
    // Basic check - verify Supabase URL is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { status: 'error', message: 'Supabase URL not configured' }
    }
    
    return { status: 'ok' }
  } catch (error) {
    return { 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Database check failed' 
    }
  }
}

/**
 * Check environment configuration
 */
function checkEnvironment(): { status: string; missing?: string[] } {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    return { status: 'warning', missing }
  }
  
  return { status: 'ok' }
} 