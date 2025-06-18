"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, RefreshCw } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { TwoFactorFormProps, TwoFactorFormState, TwoFactorResponse } from "../types"
import styles from "../styles/TwoFactorForm.module.css"

export function TwoFactorForm({ 
  sessionToken, 
  onSuccess, 
  onCancel, 
  className = "" 
}: TwoFactorFormProps) {
  const [formState, setFormState] = useState<TwoFactorFormState>({
    code: "",
    error: "",
    isLoading: false,
    remainingAttempts: 3,
  })

  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const updateField = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setFormState(prev => ({
      ...prev,
      code: numericValue,
      error: "", // Clear error when user types
    }))
  }

  const handleVerify = async () => {
    if (formState.code.length !== 6) {
      setFormState(prev => ({
        ...prev,
        error: "El código debe tener 6 dígitos"
      }))
      return
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: "" }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo validation - accept 123456 as valid code
      if (formState.code === "123456") {
        const response: TwoFactorResponse = {
          success: true,
          redirectUrl: "/dashboard"
        }
        onSuccess(response)
      } else {
        const remainingAttempts = formState.remainingAttempts - 1
        
        if (remainingAttempts <= 0) {
          setFormState(prev => ({
            ...prev,
            error: "Demasiados intentos fallidos. Inicia sesión nuevamente.",
            isLoading: false,
            remainingAttempts: 0
          }))
          
          // Auto cancel after too many attempts
          setTimeout(() => onCancel(), 2000)
        } else {
          setFormState(prev => ({
            ...prev,
            error: `Código incorrecto. Te quedan ${remainingAttempts} intentos.`,
            isLoading: false,
            remainingAttempts,
            code: "" // Clear the input
          }))
        }
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: "Error de conexión. Inténtalo de nuevo.",
        isLoading: false
      }))
    }
  }

  const handleResendCode = async () => {
    setFormState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setCountdown(30)
      setCanResend(false)
      setFormState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: "",
        remainingAttempts: 3 // Reset attempts on resend
      }))
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: "No se pudo reenviar el código",
        isLoading: false
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formState.code.length === 6) {
      handleVerify()
    }
  }

  return (
    <Card className={`${styles.twoFactorForm} ${className} w-full max-w-md shadow-lg border-0`}>
      <CardHeader className={`${styles.header} space-y-1 pb-2`}>
        <div className={`${styles.headerTop} flex items-center justify-center mb-4`}>
          <div className={styles.iconWrapper}>
            <Shield className={styles.shieldIcon} size={32} />
          </div>
        </div>
        <CardTitle className={`${styles.title} text-2xl text-center font-bold text-ritter-dark`}>
          Verificación en Dos Pasos
        </CardTitle>
        <p className={`${styles.subtitle} text-center text-muted-foreground text-sm`}>
          Ingresa el código de 6 dígitos de tu aplicación de autenticación
        </p>
      </CardHeader>
      
      <CardContent className={styles.content}>
        <form onSubmit={handleSubmit} className={`${styles.form} animate-in fade-in duration-500`}>
          <div className={`${styles.formGrid} grid gap-4`}>
            <div className={`${styles.fieldGroup} grid gap-2`}>
              <Label htmlFor="twoFactorCode" className={styles.fieldLabel}>
                Código de Verificación
              </Label>
              <Input
                ref={inputRef}
                id="twoFactorCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="000000"
                value={formState.code}
                onChange={(e) => updateField(e.target.value)}
                maxLength={6}
                className={`${styles.codeInput} text-center text-2xl tracking-widest font-mono`}
                disabled={formState.isLoading || formState.remainingAttempts <= 0}
                onKeyPress={handleKeyPress}
              />
              <div className={styles.codeHelper}>
                {formState.code.length}/6 dígitos
              </div>
            </div>

            {formState.error && (
              <p className={`${styles.errorMessage} text-red-500 text-sm text-center`}>
                {formState.error}
              </p>
            )}

            <div className={`${styles.buttonGroup} grid gap-3`}>
              <Button
                type="submit"
                className={`${styles.verifyButton} w-full bg-ritter-gold hover:bg-amber-500 text-ritter-dark`}
                disabled={formState.isLoading || formState.code.length !== 6 || formState.remainingAttempts <= 0}
              >
                {formState.isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar Código"
                )}
              </Button>

              <div className={styles.actionButtons}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={!canResend || formState.isLoading}
                  className={styles.resendButton}
                >
                  {canResend ? "Reenviar Código" : `Reenviar en ${countdown}s`}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={formState.isLoading}
                  className={styles.cancelButton}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Login
                </Button>
              </div>
            </div>

            <div className={styles.helpSection}>
              <p className={styles.helpText}>
                ¿No tienes acceso a tu aplicación de autenticación?
              </p>
              <Button
                type="button"
                variant="link"
                className={styles.helpLink}
                onClick={() => {
                  // In real app, this would open a help modal or contact support
                  alert("Contacta con soporte para recuperar tu cuenta")
                }}
              >
                Contactar Soporte
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 