"use client"

import { SetPasswordForm } from "../components/SetPasswordForm"
import { WelcomeSection } from "../components/WelcomeSection"
import { MobileHeader } from "../components/MobileHeader"
import { MobileFeatures } from "../components/MobileFeatures"
import { useSearchParams } from "next/navigation"
import type { SetPasswordPageProps } from "../types"
import styles from "../styles/SetPasswordPage.module.css"

export function SetPasswordPage({ token }: SetPasswordPageProps) {
  const searchParams = useSearchParams()
  const tokenFromUrl = token || searchParams.get("token") || ""

  return (
    <div className={styles.setPasswordPage}>
      {/* Mobile Welcome Header */}
      <div className={styles.mobileHeader}>
        <MobileHeader />
      </div>

      {/* Left: Set Password Form */}
      <div className={styles.formContainer}>
        <SetPasswordForm token={tokenFromUrl} />
      </div>

      {/* Right: Welcome & Features - Desktop */}
      <div className={styles.welcomeSection}>
        <WelcomeSection />
      </div>

      {/* Mobile Features Bottom Section */}
      <div className={styles.mobileFeatures}>
        <MobileFeatures />
      </div>
    </div>
  )
} 