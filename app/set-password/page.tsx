"use client"

import { Suspense } from "react"
import { SetPasswordPage } from "@/features/auth"

// Loading component
function SetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ritter-gold mx-auto mb-4"></div>
        <p className="text-slate-600">Cargando...</p>
      </div>
    </div>
  )
}

export default function SetPasswordDemoPage() {
  return (
    <Suspense fallback={<SetPasswordLoading />}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
        {/* Demo Banner */}
        <div className="bg-ritter-gold text-ritter-dark py-2 px-4 text-center">
          <p className="text-sm font-medium">
            🚀 <strong>DEMO:</strong> Vista de establecer contraseña - 
            Usa cualquier token de más de 10 caracteres para probar
          </p>
        </div>
        
        {/* Set Password Page */}
        <SetPasswordPage token="demo-token-123456789" />
      </div>
    </Suspense>
  )
} 