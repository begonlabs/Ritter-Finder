// Legacy component - redirects to modular analytics
"use client"

import { ScrapingStats as ModularScrapingStats } from "@/features/analytics"

export function ScrapingStats() {
  return <ModularScrapingStats />
}
