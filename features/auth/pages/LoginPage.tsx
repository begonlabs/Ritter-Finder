"use client"

import { LoginForm } from "../components/LoginForm"
import { WelcomeSection } from "../components/WelcomeSection"
import { MobileHeader } from "../components/MobileHeader"
import { MobileFeatures } from "../components/MobileFeatures"
import styles from "../styles/LoginPage.module.css"

export function LoginPage() {
  return (
    <div className={styles.loginPage}>
      {/* Mobile Welcome Header */}
      <div className={styles.mobileHeader}>
        <MobileHeader />
      </div>

      {/* Left: Login Form */}
      <div className={styles.loginFormContainer}>
        <LoginForm />
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