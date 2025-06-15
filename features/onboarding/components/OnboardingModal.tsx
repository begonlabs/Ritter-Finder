"use client"

import { X, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding"
import type { OnboardingStep } from "@/features/onboarding/types"
import styles from "../styles/OnboardingModal.module.css"

export function OnboardingModal() {
  const { t } = useLanguage()
  const {
    isOpen,
    currentStep,
    steps,
    isClient,
    handleClose,
    handleNext,
    handlePrevious
  } = useOnboarding()

  // Si no está en el cliente o el onboarding no está abierto, no renderizar nada
  if (!isClient || !isOpen) {
    return null
  }

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal}>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>
              {steps[currentStep]?.title || "Welcome"}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className={styles.imageContainer}>
              <img
                src={steps[currentStep]?.image || "/placeholder.svg"}
                alt={steps[currentStep]?.title || "Onboarding"}
                className={styles.image}
              />
            </div>
            <p className="text-muted-foreground">
              {steps[currentStep]?.description || ""}
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex justify-between items-center w-full">
            <div>
              {currentStep > 0 ? (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="btn-outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("onboarding.previous")}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="btn-outline"
                >
                  {t("onboarding.skip")}
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className={styles.stepIndicators}>
                {steps.map((_: OnboardingStep, index: number) => (
                  <div
                    key={index}
                    className={`${styles.stepIndicator} ${
                      index === currentStep ? styles.stepIndicatorActive : styles.stepIndicatorInactive
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={handleNext} 
                className={styles.finishButton}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t("onboarding.finish")}
                  </>
                ) : (
                  <>
                    {t("onboarding.next")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 