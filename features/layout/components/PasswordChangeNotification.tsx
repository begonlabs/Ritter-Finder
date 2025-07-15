"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "../styles/UserProfile.module.css"

interface PasswordChangeNotificationProps {
  type: 'success' | 'error'
  message: string
  onClose: () => void
  onLogout?: () => void
}

export function PasswordChangeNotification({ 
  type, 
  message, 
  onClose, 
  onLogout 
}: PasswordChangeNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, 5000) // Auto-hide after 5 seconds

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleLogout = () => {
    onLogout?.()
  }

  return (
    <div className={`${styles.notification} ${styles[type]} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationIcon}>
          {type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
        </div>
        <div className={styles.notificationText}>
          <h4 className={styles.notificationTitle}>
            {type === 'success' ? '¡Éxito!' : 'Error'}
          </h4>
          <p className={styles.notificationMessage}>{message}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className={styles.notificationClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {type === 'success' && onLogout && (
        <div className={styles.notificationActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Cerrar Sesión
          </Button>
        </div>
      )}
    </div>
  )
} 