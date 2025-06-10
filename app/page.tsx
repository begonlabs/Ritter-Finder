"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import Image from "next/image"
import { useLanguage } from "@/shared/lib/language-context"
import { LanguageSelector } from "@/shared/components/language-selector"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (password === "1234") {
      // Resetear el estado del onboarding para que se muestre al iniciar sesión
      localStorage.removeItem("hasSeenOnboarding")
      router.push("/dashboard")
    } else {
      setError(t("login.error"))
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ritter-gray">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center justify-between mb-4">
            <Image src="/images/ritterlogo.png" alt="RitterMor Energy" width={200} height={80} priority />
            <LanguageSelector />
          </div>
          <CardTitle className="text-2xl text-center font-bold text-ritter-dark">{t("login.title")}</CardTitle>
          <CardDescription className="text-center">{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="animate-in fade-in duration-500">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">{t("login.username")}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("login.username.placeholder")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("login.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("login.password.placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-ritter-gold hover:bg-amber-500 text-ritter-dark"
                disabled={isLoading}
              >
                {isLoading ? "..." : t("login.button")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">{t("login.demo")}</p>
        </CardFooter>
      </Card>
    </div>
  )
} 