"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useSetupPassword } from "../hooks/useSetupPassword"
import type { SetupPasswordProps } from "../types"
import styles from "../styles/SetupPasswordForm.module.css"

export function SetupPasswordForm({ token, email }: SetupPasswordProps) {
  const { formState, updateField, handleSubmit } = useSetupPassword(token)

  return (
    <Card className={`${styles.setupPasswordForm} w-full max-w-md shadow-lg border-0`}>
      <CardHeader className={`${styles.header} space-y-1 pb-2`}>
        <div className={`${styles.headerTop} flex items-center justify-center mb-4`}>
          <Image 
            src="/images/ritterlogo.png" 
            alt="RitterMor Energy" 
            width={160} 
            height={60} 
            priority 
            className={styles.logo}
          />
        </div>
        <CardTitle className={`${styles.title} text-2xl text-center font-bold text-ritter-dark`}>
          Configura tu contraseña
        </CardTitle>
        <p className={`${styles.subtitle} text-center text-muted-foreground text-sm`}>
          {email ? `Configurando cuenta para: ${email}` : "Completa la configuración de tu cuenta"}
        </p>
      </CardHeader>
      <CardContent className={styles.content}>
        <form onSubmit={handleSubmit} className={`${styles.form} animate-in fade-in duration-500`}>
          <div className={`${styles.formGrid} grid gap-4`}>
            <div className={`${styles.fieldGroup} grid gap-2`}>
              <Label htmlFor="password" className={styles.fieldLabel}>
                Nueva contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formState.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                minLength={8}
                className={`${styles.fieldInput} border-gray-300`}
                disabled={formState.isLoading}
              />
            </div>
            <div className={`${styles.fieldGroup} grid gap-2`}>
              <Label htmlFor="confirmPassword" className={styles.fieldLabel}>
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formState.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                required
                minLength={8}
                className={`${styles.fieldInput} border-gray-300`}
                disabled={formState.isLoading}
              />
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
                {formState.isLoading ? "Configurando..." : "Configurar contraseña"}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className={`${styles.footer} flex justify-center`}>
        <p className={`${styles.infoText} text-sm text-muted-foreground text-center`}>
          Una vez configurada tu contraseña, podrás acceder a tu cuenta de RitterFinder.
        </p>
      </CardFooter>
    </Card>
  )
} 