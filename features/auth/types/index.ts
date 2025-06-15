export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginFormState {
  username: string
  password: string
  error: string
  isLoading: boolean
}

export interface AuthResponse {
  success: boolean
  error?: string
  redirectUrl?: string
}

export interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  isLoading: boolean
  error: string
}

export interface WelcomeSectionProps {
  className?: string
}

export interface MobileHeaderProps {
  className?: string
}

export interface FeatureItem {
  icon: string
  text: string
  id: string
}

export interface SetupPasswordCredentials {
  password: string
  confirmPassword: string
}

export interface SetupPasswordFormState {
  password: string
  confirmPassword: string
  error: string
  isLoading: boolean
  token?: string
}

export interface SetupPasswordProps {
  token: string
  email?: string
}

export interface SetupPasswordResponse {
  success: boolean
  error?: string
  redirectUrl?: string
} 