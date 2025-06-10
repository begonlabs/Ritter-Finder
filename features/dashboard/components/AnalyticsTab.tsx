"use client"

import { AnalyticsPage } from "@/features/analytics"
import type { TabComponentProps } from "../types"

export function AnalyticsTab({ state, actions }: TabComponentProps) {
  return (
    <div className="space-y-6">
      <AnalyticsPage 
        showDetailed={true} 
        period="month"
        showDetailedView={true}
      />
    </div>
  )
} 