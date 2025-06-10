/**
 * @deprecated This component has been moved to features/history/SearchHistory.tsx
 * Please use the modular version from @/features/history instead.
 * This file will be removed in a future version.
 */
import { SearchHistory as ModularSearchHistory } from "@/features/history"

interface SearchHistoryProps {
  history: unknown[]
  onRerunSearch: (searchData: unknown) => void
  onViewLeads: (searchId: string) => void
}

export function SearchHistory({ onRerunSearch, onViewLeads }: SearchHistoryProps) {
  console.warn('Using deprecated SearchHistory component. Please use @/features/history/SearchHistory instead.')
  
  return (
    <ModularSearchHistory
      onRerunSearch={onRerunSearch}
      onViewLeads={onViewLeads}
    />
  )
}
