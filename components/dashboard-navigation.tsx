/**
 * @deprecated This component has been moved to features/layout/components/DashboardNavigation.tsx
 * Please use the modular version from @/features/layout instead.
 * This file will be removed in a future version.
 */

import { DashboardNavigation as ModularDashboardNavigation } from "@/features/layout"
import type { NavigationProps } from "@/features/layout"

// Legacy export for backward compatibility
export function DashboardNavigation(props: NavigationProps) {
  console.warn('DashboardNavigation: Using deprecated component. Please import from @/features/layout instead.')
  return <ModularDashboardNavigation {...props} />
}
