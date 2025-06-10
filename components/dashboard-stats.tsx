// Legacy component - redirects to modular analytics
"use client"

import { DashboardStats as ModularDashboardStats } from "@/features/analytics"

export function DashboardStats() {
  return <ModularDashboardStats />
}
