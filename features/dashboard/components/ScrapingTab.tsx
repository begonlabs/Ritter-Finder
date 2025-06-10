"use client"

import { ScrapingStats } from "@/components/scraping-stats"
import type { TabComponentProps } from "../types"

export function ScrapingTab({ state, actions }: TabComponentProps) {
  return (
    <div className="space-y-6">
      <ScrapingStats />
    </div>
  )
} 