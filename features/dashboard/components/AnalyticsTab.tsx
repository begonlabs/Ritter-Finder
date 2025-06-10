"use client"

import { AnalyticsPage } from "@/features/analytics"
import type { TabComponentProps } from "../types"
import styles from "../styles/AnalyticsTab.module.css"

export function AnalyticsTab({ state, actions }: TabComponentProps) {
  return (
    <div className={`${styles.analyticsTab} space-y-6`}>
      <div className={styles.analyticsContainer}>
        <AnalyticsPage 
          showDetailed={true} 
          period="month"
          showDetailedView={true}
        />
      </div>
    </div>
  )
} 