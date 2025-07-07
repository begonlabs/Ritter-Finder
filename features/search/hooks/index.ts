// Export all search hooks for better organization
export { useClientTypes } from './useClientTypes'
export { useLocations } from './useLocations'
export { useSearch } from './useSearch'
export { useSearchConfig } from './useSearchConfig'
export { useSearchHistory } from './useSearchHistory'

// Re-export types for convenience
export type { 
  ClientTypeData, 
  ClientTypeOption 
} from './useClientTypes'

export type {
  CountryData,
  StateData,
  LocationOption
} from './useLocations'

export type {
  SearchHistoryRecord
} from './useSearchHistory' 