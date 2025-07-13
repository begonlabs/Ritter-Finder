import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/features/auth/providers/AuthProvider"

export const metadata: Metadata = {
  title: "Ritter Finder",
  description: "AI-Powered Lead Generation Platform",
    generator: 'v0.dev'
}

// Cambiar el atributo lang de "en" a dinámico basado en el idioma actual
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
        <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
