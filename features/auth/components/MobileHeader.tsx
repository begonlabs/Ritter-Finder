"use client"

import type { MobileHeaderProps } from "../types"
import styles from "../styles/MobileHeader.module.css"

export function MobileHeader({ className = "" }: MobileHeaderProps) {
  return (
    <div className={`${styles.mobileHeader} md:hidden bg-ritter-dark text-white p-6 text-center ${className}`}>
      <div className={styles.content}>
        <h2 className={`${styles.title} text-xl font-bold text-ritter-gold mb-2`}>
          RitterMor Energy
        </h2>
        <p className={`${styles.subtitle} text-sm text-gray-300`}>
          Encuentra leads de energías renovables
        </p>
      </div>
    </div>
  )
} 