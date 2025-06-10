"use client"

import { ScrapingStats } from "@/features/analytics"
import type { TabComponentProps } from "../types"

export function ScrapingTab({ state, actions }: TabComponentProps) {
  return (
    <div className="space-y-6">
      <ScrapingStats showHeader={true} showRefreshButton={true} />
    </div>
  )
} 