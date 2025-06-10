"use client"

import { LoginForm } from "../components/LoginForm"
import { WelcomeSection } from "../components/WelcomeSection"
import { MobileHeader } from "../components/MobileHeader"
import { MobileFeatures } from "../components/MobileFeatures"

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