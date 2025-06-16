"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useSetPassword } from "../hooks/useSetPassword"
import { useState, useEffect } from "react"
import type { SetPasswordFormProps } from "../types"
import styles from "../styles/SetPasswordForm.module.css"

export function SetPasswordForm({ token, className = "" }: SetPasswordFormProps) {
  const { t } = useLanguage()
  const { formState, updateField, handleSubmit, getPasswordStrength, setToken } = useSetPassword()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Set token from prop if provided
  useEffect(() => {
    if (token && token !== formState.token) {
      setToken(token)
    }
  }, [token, formState.token, setToken])

  const passwordStrength = getPasswordStrength(formState.password)

  if (formState.success) {
    return (
      <Card className={`${styles.successCard} ${className} w-full max-w-md shadow-lg border-0`}>
        <CardContent className={styles.successContent}>
          <div className={styles.successAnimation}>
            <CheckCircle className={styles.successIcon} size={64} />
            <h2 className={styles.successTitle}>¡Contraseña establecida!</h2>
            <p className={styles.successMessage}>
              Tu contraseña ha sido configurada exitosamente. 
              Serás redirigido al login en unos momentos.
            </p>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${styles.setPasswordForm} ${className} w-full max-w-md shadow-lg border-0`}>
      <CardHeader className={`${styles.header} space-y-1 pb-2`}>
        <div className={`${styles.headerTop} flex items-center justify-between mb-4`}>
          <Image 
            src="/images/ritterlogo.png" 
            alt="RitterMor Energy" 
            width={160} 
            height={60} 
            priority 
            className={styles.logo}
          />
          <LanguageSelector />
        </div>
        <CardTitle className={`${styles.title} text-2xl text-center font-bold text-ritter-dark`}>
          Establecer Contraseña
        </CardTitle>
        <p className={`${styles.subtitle} text-center text-muted-foreground text-sm`}>
          Crea una contraseña segura para tu cuenta
        </p>
      </CardHeader>
      <CardContent className={styles.content}>
        <form onSubmit={handleSubmit} className={`${styles.form} animate-in fade-in duration-500`}>
          <div className={`${styles.formGrid} grid gap-4`}>
            {/* Debug info for demo */} 
            {/* #Remover */}
            {token && (
              <div className={styles.debugInfo}>
                <p className={styles.debugText}>
                  🔑 <strong>Token Demo:</strong> {token.substring(0, 20)}...
                </p>
              </div>
            )}

            <div className={`${styles.fieldGroup} grid gap-2`}>
              <Label htmlFor="password" className={styles.fieldLabel}>
                Nueva Contraseña
              </Label>
              <div className={styles.passwordWrapper}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu nueva contraseña"
                  value={formState.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  className={`${styles.fieldInput} ${formState.password ? styles.hasValue : ""} border-gray-300`}
                  disabled={formState.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                  disabled={formState.isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formState.password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBar}>
                    <div 
                      className={styles.strengthFill}
                      style={{ 
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }}
                    />
                  </div>
                  <span className={styles.strengthLabel} style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className={`${styles.fieldGroup} grid gap-2`}>
              <Label htmlFor="confirmPassword" className={styles.fieldLabel}>
                Confirmar Contraseña
              </Label>
              <div className={styles.passwordWrapper}>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma tu nueva contraseña"
                  value={formState.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                  className={`${styles.fieldInput} ${
                    formState.confirmPassword 
                      ? formState.password === formState.confirmPassword 
                        ? styles.valid 
                        : styles.invalid
                      : ""
                  } border-gray-300`}
                  disabled={formState.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                  disabled={formState.isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={styles.requirements}>
              <p className={styles.requirementsTitle}>La contraseña debe contener:</p>
              <ul className={styles.requirementsList}>
                <li className={formState.password.length >= 8 ? styles.valid : ""}>
                  Al menos 8 caracteres
                </li>
                <li className={/(?=.*[a-z])/.test(formState.password) ? styles.valid : ""}>
                  Una letra minúscula
                </li>
                <li className={/(?=.*[A-Z])/.test(formState.password) ? styles.valid : ""}>
                  Una letra mayúscula
                </li>
                <li className={/(?=.*\d)/.test(formState.password) ? styles.valid : ""}>
                  Un número
                </li>
                <li className={/(?=.*[@$!%*?&])/.test(formState.password) ? styles.valid : ""}>
                  Un carácter especial (@$!%*?&)
                </li>
              </ul>
            </div>

            {formState.error && (
              <p className={`${styles.errorMessage} text-red-500 text-sm`}>
                {formState.error}
              </p>
            )}

            <Button
              type="submit"
              className={`${styles.submitButton} w-full bg-ritter-gold hover:bg-amber-500 text-ritter-dark`}
              disabled={formState.isLoading || !formState.password || !formState.confirmPassword}
            >
              <span className={formState.isLoading ? styles.loadingText : ""}>
                {formState.isLoading ? "Estableciendo..." : "Establecer Contraseña"}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className={`${styles.footer} flex justify-center`}>
        <p className={`${styles.helpText} text-sm text-muted-foreground text-center`}>
          ¿Tienes problemas? <br />
          <a href="/contacto" className={styles.helpLink}>Contacta con soporte</a>
        </p>
      </CardFooter>
    </Card>
  )
} 