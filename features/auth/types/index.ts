export interface LoginCredentials {
  email: string
  password: string
  twoFactorCode?: string
}

export interface LoginFormState {
  email: string
  password: string
  twoFactorCode: string
  showTwoFactor: boolean
  error: string
  isLoading: boolean
  needsTwoFactor: boolean
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

// Set Password Types
export interface SetPasswordCredentials {
  token: string
  password: string
  confirmPassword: string
}

export interface SetPasswordFormState {
  password: string
  confirmPassword: string
  token: string
  error: string
  isLoading: boolean
  success: boolean
}

export interface SetPasswordResponse {
  success: boolean
  error?: string
  redirectUrl?: string
}

// Two Factor Authentication Types
export interface TwoFactorCredentials {
  code: string
  sessionToken: string
}

export interface TwoFactorFormState {
  code: string
  error: string
  isLoading: boolean
  remainingAttempts: number
}

export interface TwoFactorResponse {
  success: boolean
  error?: string
  redirectUrl?: string
  remainingAttempts?: number
}

// Component Props
export interface SetPasswordFormProps {
  token?: string
  className?: string
}

export interface SetPasswordPageProps {
  token?: string
}

export interface TwoFactorFormProps {
  sessionToken: string
  onSuccess: (response: TwoFactorResponse) => void
  onCancel: () => void
  className?: string
}

// Change Password Types
export interface ChangePasswordCredentials {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  error: string
  isLoading: boolean
  success: boolean
}

export interface ChangePasswordResponse {
  success: boolean
  error?: string
  message?: string
} 