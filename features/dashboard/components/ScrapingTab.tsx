"use client"

import { ScrapingStats } from "@/features/analytics"
import type { TabComponentProps } from "../types"
import styles from "../styles/ScrapingTab.module.css"

export function ScrapingTab({ state, actions }: TabComponentProps) {
  return (
    <div className={`${styles.scrapingTab} space-y-6`}>
      <div className={styles.scrapingContainer}>
        <ScrapingStats showHeader={true} showRefreshButton={true} />
      </div>
    </div>
  )
} 