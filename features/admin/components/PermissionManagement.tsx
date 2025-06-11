"use client"

import { Key } from "lucide-react"
import type { PermissionManagementProps } from "../types"
import styles from "../styles/PermissionManagement.module.css"

export function PermissionManagement({ className = "" }: PermissionManagementProps) {
  return (
    <div className={`${styles.permissionManagement} ${className}`}>
      <div className={styles.placeholderContainer}>
        <div className={styles.placeholderContent}>
          <Key className={styles.placeholderIcon} />
          <h3 className={styles.placeholderTitle}>Gestión de Permisos</h3>
          <p className={styles.placeholderDescription}>
            Define permisos granulares para el sistema. Controla el acceso a funcionalidades específicas y recursos del dashboard.
          </p>
        </div>
      </div>
    </div>
  )
} 