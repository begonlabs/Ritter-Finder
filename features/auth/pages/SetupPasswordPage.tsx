"use client"

import { SetupPasswordForm } from "../components/SetupPasswordForm"
import { WelcomeSection } from "../components/WelcomeSection"
import { MobileHeader } from "../components/MobileHeader"
import { MobileFeatures } from "../components/MobileFeatures"
import type { SetupPasswordProps } from "../types"
import styles from "../styles/SetupPasswordPage.module.css"

export function SetupPasswordPage({ token, email }: SetupPasswordProps) {
  return (
    <div className={styles.setupPasswordPage}>
      {/* Mobile Welcome Header */}
      <div className={styles.mobileHeader}>
        <MobileHeader />
      </div>

      {/* Left: Setup Password Form */}
      <div className={styles.setupPasswordFormContainer}>
        <SetupPasswordForm token={token} email={email} />
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