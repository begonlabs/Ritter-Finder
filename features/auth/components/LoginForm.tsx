"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useLogin } from "../hooks/useLogin"
import { TwoFactorForm } from "./TwoFactorForm"
import { useState } from "react"
import type { TwoFactorResponse } from "../types"
import styles from "../styles/LoginForm.module.css"

export function LoginForm() {
  const { t } = useLanguage()
  const { formState, updateField, handleSubmit } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  // Handle 2FA success
  const handleTwoFactorSuccess = (response: TwoFactorResponse) => {
    if (response.success && response.redirectUrl) {
      window.location.href = response.redirectUrl
    }
  }

  // Handle 2FA cancel
  const handleTwoFactorCancel = () => {
    updateField("showTwoFactor", false)
    updateField("needsTwoFactor", false)
    updateField("twoFactorCode", "")
  }

  // Show 2FA form if needed
  if (formState.showTwoFactor && formState.needsTwoFactor) {
    return (
      <TwoFactorForm
        sessionToken="demo-session-token"
        onSuccess={handleTwoFactorSuccess}
        onCancel={handleTwoFactorCancel}
      />
    )
  }

  return (
    <Card className={`${styles.loginForm} w-full max-w-md shadow-lg border-0`}>
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
          {t("login.title")}
        </CardTitle>
        <p className={`${styles.subtitle} text-center text-muted-foreground text-sm`}>
          {t("login.subtitle")}
        </p>
      </CardHeader>
      <CardContent className={styles.content}>
        <form onSubmit={handleSubmit} className={`${styles.form} animate-in fade-in duration-500`}>
          <div className={`${styles.formGrid} grid gap-4`}>
            <div className={`${styles.fieldGroup} grid gap-2`}>
              <Label htmlFor="email" className={styles.fieldLabel}>
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@empresa.com"
                value={formState.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                className={`${styles.fieldInput} border-gray-300`}
                disabled={formState.isLoading}
              />
            </div>
            <div className={`${styles.fieldGroup} grid gap-2`}>
              <Label htmlFor="password" className={styles.fieldLabel}>
                {t("login.password")}
              </Label>
              <div className={styles.passwordWrapper}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.password.placeholder")}
                  value={formState.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  className={`${styles.fieldInput} border-gray-300`}
                  disabled={formState.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                  disabled={formState.isLoading}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {formState.error && (
              <p className={`${styles.errorMessage} text-red-500 text-sm`}>
                {formState.error}
              </p>
            )}
            <Button
              type="submit"
              className={`${styles.submitButton} w-full bg-ritter-gold hover:bg-amber-500 text-ritter-dark`}
              disabled={formState.isLoading}
            >
              <span className={formState.isLoading ? styles.loadingText : ""}>
                {formState.isLoading ? "..." : t("login.button")}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className={`${styles.footer} flex justify-center`}>
        <div className={`${styles.demoSection} text-center`}>
          <p className={`${styles.demoText} text-sm text-muted-foreground mb-2`}>
            🔐 <strong>Admin:</strong> itsjhonalex@gmail.com | Tu contraseña configurada
          </p>
          <p className={`${styles.demoText} text-xs text-muted-foreground`}>
            💡 <strong>2FA Demo:</strong> Usa email con "2fa" o "admin" | Código: <strong>123456</strong>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
} 