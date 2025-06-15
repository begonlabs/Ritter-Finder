import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import type { OnboardingStep, OnboardingHookReturn } from "@/features/onboarding/types";

export function useOnboarding(): OnboardingHookReturn {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);

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
  ];

  // Solo ejecutar en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificar si el usuario ya ha visto el onboarding
  useEffect(() => {
    if (isClient) {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      if (!hasSeenOnboarding) {
        setTimeout(() => setIsOpen(true), 2000);
      }
    }
  }, [isClient]);

  // Manejar el cierre del onboarding
  const handleClose = () => {
    setIsOpen(false);
    if (isClient) {
      localStorage.setItem("hasSeenOnboarding", "true");
    }
  };

  // Manejar el avance al siguiente paso
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  // Manejar el retroceso al paso anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    isOpen,
    currentStep,
    isClient,
    steps,
    handleClose,
    handleNext,
    handlePrevious,
  };
} 