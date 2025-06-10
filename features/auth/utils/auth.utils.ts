import type { LoginCredentials } from "../types/auth.types"

/**
 * Simulates a login API call
 * In a real app, this would make an HTTP request to your auth API
 */
export async function simulateLogin(credentials: LoginCredentials): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Demo validation - in production, this would be handled by the backend
  return credentials.password === "1234"
}

/**
 * Validates login credentials
 */
export function validateLoginCredentials(credentials: LoginCredentials): string | null {
  if (!credentials.username.trim()) {
    return "Username is required"
  }

  if (!credentials.password.trim()) {
    return "Password is required"
  }

  if (credentials.password.length < 4) {
    return "Password must be at least 4 characters"
  }

  return null
}

/**
 * Clears onboarding state on fresh login
 */
export function clearOnboardingState(): void {
  localStorage.removeItem("hasSeenOnboarding")
}

/**
 * Checks if user should see onboarding
 */
export function shouldShowOnboarding(): boolean {
  return !localStorage.getItem("hasSeenOnboarding")
} 