"use client"

import type React from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useLanguage } from "@/shared/lib/language-context"
import { useAuth } from "../hooks/use-auth"

export function LoginForm() {
  const { t } = useLanguage()
  const { formData, updateField, login, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({
      username: formData.username,
      password: formData.password
    })
  }

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">{t("login.username")}</Label>
          <Input
            id="username"
            type="text"
            placeholder={t("login.username.placeholder")}
            value={formData.username}
            onChange={(e) => updateField("username", e.target.value)}
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
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
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
  )
} 