"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface OnboardingStep {
  title: string
  description: string
  image: string
}

export function Onboarding() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Define los pasos del onboarding
  const steps: OnboardingStep[] = [
    {
      title: t("onboarding.welcome.title"),
      description: t("onboarding.welcome.description"),
      image: "/placeholder.svg?height=300&width=500&text=Welcome+to+Ritter+Finder",
    },
    {
      title: t("onboarding.search.title"),
      description: t("onboarding.search.description"),
      image: "/placeholder.svg?height=300&width=500&text=Lead+Search",
    },
    {
      title: t("onboarding.results.title"),
      description: t("onboarding.results.description"),
      image: "/placeholder.svg?height=300&width=500&text=Lead+Results",
    },
    {
      title: t("onboarding.campaigns.title"),
      description: t("onboarding.campaigns.description"),
      image: "/placeholder.svg?height=300&width=500&text=Email+Campaigns",
    },
    {
      title: t("onboarding.email.title"),
      description: t("onboarding.email.description"),
      image: "/placeholder.svg?height=300&width=500&text=Email+Composer",
    },
    {
      title: t("onboarding.history.title"),
      description: t("onboarding.history.description"),
      image: "/placeholder.svg?height=300&width=500&text=History+Analytics",
    },
  ]

  // Solo ejecutar en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Verificar si el usuario ya ha visto el onboarding
  useEffect(() => {
    if (isClient) {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
      if (!hasSeenOnboarding) {
        setTimeout(() => setIsOpen(true), 2000)
      }
    }
  }, [isClient])

  // Manejar el cierre del onboarding
  const handleClose = () => {
    setIsOpen(false)
    if (isClient) {
      localStorage.setItem("hasSeenOnboarding", "true")
    }
  }

  // Manejar el avance al siguiente paso
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  // Manejar el retroceso al paso anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Si no está en el cliente o el onboarding no está abierto, no renderizar nada
  if (!isClient || !isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{steps[currentStep]?.title || "Welcome"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <img
              src={steps[currentStep]?.image || "/placeholder.svg"}
              alt={steps[currentStep]?.title || "Onboarding"}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-muted-foreground">{steps[currentStep]?.description || ""}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("onboarding.previous")}
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClose}>
                {t("onboarding.skip")}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-ritter-gold" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <Button onClick={handleNext} className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark">
              {currentStep === steps.length - 1 ? (
                <>
                  {t("onboarding.finish")}
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  {t("onboarding.next")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
