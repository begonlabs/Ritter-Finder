/**
 * @deprecated This component has been moved to features/layout/components/DashboardHeader.tsx
 * Please use the modular version from @/features/layout instead.
 * This file will be removed in a future version.
 */

import { DashboardHeader as ModularDashboardHeader } from "@/features/layout"
import type { HeaderProps } from "@/features/layout"

// Legacy export for backward compatibility
export function DashboardHeader(props: Partial<HeaderProps>) {
  console.warn('DashboardHeader: Using deprecated component. Please import from @/features/layout instead.')
  return <ModularDashboardHeader {...props} />
} 