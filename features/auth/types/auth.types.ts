export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginFormData extends LoginCredentials {
  isLoading: boolean
  error: string
}

export interface AuthUser {
  username: string
  // Aquí se pueden agregar más campos cuando se implemente auth real
  // id: string
  // email: string
  // role: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
} 