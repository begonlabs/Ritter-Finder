// @deprecated - Use SearchHistory from @/features/history instead
// This component is kept for backward compatibility only

import { SearchHistory as ModularSearchHistory } from "@/features/history"

interface SearchHistoryProps {
  history: any[]
  onRerunSearch: (searchData: any) => void
  onViewLeads: (searchId: string) => void
}

export function SearchHistory({ history, onRerunSearch, onViewLeads }: SearchHistoryProps) {
  console.warn('Using deprecated SearchHistory component. Please use @/features/history/SearchHistory instead.')
  
  return (
    <ModularSearchHistory
      onRerunSearch={onRerunSearch}
      onViewLeads={onViewLeads}
    />
  )
}
