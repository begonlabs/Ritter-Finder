import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Get the current path
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/admin', 
    '/search',
    '/results',
    '/campaigns',
    '/history',
    '/analytics'
  ]

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  )

  if (isProtectedRoute) {
    // Get session for protected routes
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session || error) {
      // Redirect to login with return URL
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect authenticated users away from login
  if (path === '/' || path === '/login') {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
} 