"use client"

import { UserProfile } from "../components/UserProfile"
import { DashboardLayout } from "../components/DashboardLayout"
import type { DashboardLayoutProps } from "../types"
import styles from "../styles/LayoutPage.module.css"

interface ProfilePageProps extends Omit<DashboardLayoutProps, 'children'> {
  className?: string
}

export function ProfilePage({
  activeTab,
  onTabChange,
  searchComplete,
  selectedLeadsCount,
  user,
  onLogout,
  className = ""
}: ProfilePageProps) {
  
  const handleProfileUpdate = (data: any) => {
    console.log("Perfil actualizado:", data)
    // Here you would typically call an API to update the user profile
  }

  const handlePasswordChange = (data: any) => {
    console.log("Contraseña cambiada exitosamente:", data)
    // Here you would typically:
    // 1. Show a success notification
    // 2. Optionally log the user out to re-authenticate with new password
    // 3. Update any local state if needed
    
    // For now, we'll just log the success
    // In a real app, you might want to show a toast notification
    console.log("¡Contraseña actualizada exitosamente! Por seguridad, se recomienda cerrar sesión y volver a iniciar.")
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={onTabChange}
      searchComplete={searchComplete}
      selectedLeadsCount={selectedLeadsCount}
      user={user}
      onLogout={onLogout}
      className={className}
    >
      <div className={styles.layoutPage}>
        <div className={styles.layoutContainer}>
          {/* Page Header */}
          <div className={styles.layoutHeader}>
            <div className={styles.layoutHeaderContent}>
              <div>
                <h1 className={styles.layoutTitle}>Mi Perfil</h1>
                <p className={styles.layoutSubtitle}>
                  Gestiona tu información personal, seguridad y configuración de cuenta
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className={styles.layoutContent}>
            <div className={styles.layoutContentCard}>
              <div className={styles.layoutContentInner}>
                <UserProfile
                  user={user}
                  onProfileUpdate={handleProfileUpdate}
                  onPasswordChange={handlePasswordChange}
                  onLogout={onLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Export with alias to avoid conflicts
export { ProfilePage as UserProfilePage } 