"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"
import { useLogin } from "../hooks/useLogin"

export function LoginForm() {
  const { t } = useLanguage()
  const { formState, updateField, handleSubmit } = useLogin()

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Image src="/images/ritterlogo.png" alt="RitterMor Energy" width={160} height={60} priority />
          <LanguageSelector />
        </div>
        <CardTitle className="text-2xl text-center font-bold text-ritter-dark">{t("login.title")}</CardTitle>
        <p className="text-center text-muted-foreground text-sm">{t("login.subtitle")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">{t("login.username")}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t("login.username.placeholder")}
                value={formState.username}
                onChange={(e) => updateField("username", e.target.value)}
                required
                className="border-gray-300"
                disabled={formState.isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("login.password.placeholder")}
                value={formState.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                className="border-gray-300"
                disabled={formState.isLoading}
              />
            </div>
            {formState.error && <p className="text-red-500 text-sm">{formState.error}</p>}
            <Button
              type="submit"
              className="w-full bg-ritter-gold hover:bg-amber-500 text-ritter-dark"
              disabled={formState.isLoading}
            >
              {formState.isLoading ? "..." : t("login.button")}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">{t("login.demo")}</p>
      </CardFooter>
    </Card>
  )
} 