"use client"

import { SearchForm } from "@/features/search"
import type { TabComponentProps } from "../types"
import styles from "../styles/SearchTab.module.css"

interface SearchTabProps extends TabComponentProps {
  canStartSearch: boolean
}

export function SearchTab({ state, actions, canStartSearch }: SearchTabProps) {
  // Convert dashboard state/actions to search format
  const searchState = {
    selectedWebsites: state.selectedWebsites,
    selectedClientType: state.selectedClientType,
    isSearching: state.isSearching,
    searchComplete: state.searchComplete,
    searchProgress: 0,
    currentStep: "",
  }

  const searchActions = {
    setSelectedWebsites: actions.setSelectedWebsites,
    setSelectedClientType: actions.setSelectedClientType,
    handleSearch: actions.handleSearch,
    resetSearch: () => {
      actions.setSelectedWebsites([])
      actions.setSelectedClientType("")
    },
    rerunSearch: (config: { selectedWebsites: string[]; selectedClientType: string }) => {
      actions.setSelectedWebsites(config.selectedWebsites)
      actions.setSelectedClientType(config.selectedClientType)
    },
  }

  return (
    <div className={styles.searchTab}>
      <div className={styles.searchFormContainer}>
        <SearchForm 
          state={searchState}
          actions={searchActions}
          canStartSearch={canStartSearch}
        />
      </div>
    </div>
  )
}
