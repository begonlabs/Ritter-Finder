"use client"

import { LoginForm } from "./LoginForm"
import { WelcomeSection } from "./WelcomeSection"
import { MobileHeader } from "./MobileHeader"
import { MobileFeatures } from "./MobileFeatures"

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Welcome Header */}
      <MobileHeader />

      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-0">
        <LoginForm />
      </div>

      {/* Right: Welcome & Features - Desktop */}
      <WelcomeSection />

      {/* Mobile Features Bottom Section */}
      <MobileFeatures />
    </div>
  )
} 