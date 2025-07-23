"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft,
  Shield,
  Users
} from 'lucide-react'
import { useUnsubscribe } from '@/features/campaigns/hooks/useUnsubscribe'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const email = searchParams?.get('email')
  
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [unsubscribeData, setUnsubscribeData] = useState<{
    email: string
    user_agent: string
    unsubscribe_reason: string
  } | null>(null)

  const { isUnsubscribed, isLoading, error, unsubscribeEmail } = useUnsubscribe()

  useEffect(() => {
    if (email) {
      setUnsubscribeData({
        email: email,
        user_agent: navigator.userAgent,
        unsubscribe_reason: 'user_request'
      })
    }
  }, [email])

  const handleConfirmUnsubscribe = async () => {
    if (!unsubscribeData) return

    const success = await unsubscribeEmail(unsubscribeData)
    
    if (success) {
      setIsSuccess(true)
      setIsConfirmed(true)
    }
  }

  const handleCancel = () => {
    window.history.back()
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Enlace Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              El enlace de baja no es válido o no contiene un email.
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">¡Baja Confirmada!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              El email <strong>{email}</strong> ha sido dado de baja exitosamente.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Ya no recibirás más emails de RitterFinder. Si cambias de opinión, 
              puedes contactarnos directamente.
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Confirmar Baja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que no deseas seguir recibiendo estos correos?
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <Mail className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Email a dar de baja:</span>
              </div>
              <p className="text-blue-900 font-semibold break-all">{email}</p>
            </div>

            <Alert className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Tu privacidad es importante para nosotros. Al confirmar, tu email será 
                removido de nuestras listas de envío.
              </AlertDescription>
            </Alert>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            
            <Button 
              onClick={handleConfirmUnsubscribe}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Baja
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              RitterFinder Energy
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 