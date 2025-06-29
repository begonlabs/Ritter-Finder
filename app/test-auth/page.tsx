"use client"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, User, Mail, Calendar, Shield } from "lucide-react"

export default function TestAuthPage() {
  const auth = useAuth()

  const handleSignOut = async () => {
    await auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          🔐 RitterFinder Auth Test
        </h1>

        {/* Auth Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {auth.user ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant={auth.user ? "default" : "destructive"}>
                {auth.user ? "Authenticated ✅" : "Not Authenticated ❌"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Loading:</span>
              <Badge variant={auth.isLoading ? "secondary" : "outline"}>
                {auth.isLoading ? "Loading..." : "Ready"}
              </Badge>
            </div>

            {auth.user && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <User size={18} />
                  User Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{auth.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-gray-500" />
                    <span className="font-medium">ID:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded">
                      {auth.user.id}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="font-medium">Created:</span>
                    <span>{new Date(auth.user.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-gray-500" />
                    <span className="font-medium">Email Confirmed:</span>
                    <Badge variant={auth.user.email_confirmed_at ? "default" : "destructive"}>
                      {auth.user.email_confirmed_at ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {!auth.user && !auth.isLoading && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Not Authenticated</h3>
                <p className="text-red-700 text-sm">
                  You need to log in to access this information.
                </p>
                <Button 
                  className="mt-3" 
                  onClick={() => window.location.href = '/'}
                >
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Info Card */}
        {auth.session && (
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Access Token:</span>
                  <code className="block mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                    {auth.session.access_token.substring(0, 50)}...
                  </code>
                </div>
                <div>
                  <span className="font-medium">Expires At:</span>
                  <span className="ml-2">
                    {new Date(auth.session.expires_at! * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {auth.user && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="destructive"
                className="w-full"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify({
                hasUser: !!auth.user,
                hasSession: !!auth.session,
                isLoading: auth.isLoading,
                userEmail: auth.user?.email || null,
                sessionExpiry: auth.session?.expires_at ? new Date(auth.session.expires_at * 1000) : null
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 