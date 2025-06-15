export interface OnboardingStep {
  title: string
  description: string
  image: string
}

export interface OnboardingState {
  isOpen: boolean
  currentStep: number
  isClient: boolean
}

export interface OnboardingActions {
  handleClose: () => void
  handleNext: () => void
  handlePrevious: () => void
}

export interface OnboardingHookReturn extends OnboardingState, OnboardingActions {
  steps: OnboardingStep[]
}

export interface OnboardingModalProps {
  className?: string
} 