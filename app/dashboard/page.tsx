"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { useLanguage } from "@/shared/lib/language-context"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-ritter-gray p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-ritter-dark">
              {t("nav.dashboard")} - Ritter Finder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              ¡Bienvenido al dashboard! Esta es una versión básica que se ampliará después.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Has iniciado sesión exitosamente. La funcionalidad completa del dashboard se implementará en la siguiente fase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 