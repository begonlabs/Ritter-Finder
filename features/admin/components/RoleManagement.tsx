"use client"

import { Shield } from "lucide-react"
import type { RoleManagementProps } from "../types"
import styles from "../styles/RoleManagement.module.css"

export function RoleManagement({ className = "" }: RoleManagementProps) {
  return (
    <div className={`${styles.roleManagement} ${className}`}>
      <div className={styles.placeholderContainer}>
        <div className={styles.placeholderContent}>
          <Shield className={styles.placeholderIcon} />
          <h3 className={styles.placeholderTitle}>Gestión de Roles</h3>
          <p className={styles.placeholderDescription}>
            Configura y administra los roles del sistema. Define permisos específicos para cada rol y asigna usuarios automáticamente.
          </p>
        </div>
      </div>
    </div>
  )
} 