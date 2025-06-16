"use client"

import { SearchForm } from "@/features/search"
import type { TabComponentProps } from "../types"
import styles from "../styles/SearchTab.module.css"

export function SearchTab({ state, actions }: TabComponentProps) {
  const searchState = {
    selectedClientTypes: state.selectedClientTypes,
    selectedLocations: state.selectedLocations,
    requireWebsite: state.requireWebsite,
    validateEmail: state.validateEmail,
    validateWebsite: state.validateWebsite,
    isSearching: state.isSearching,
    searchComplete: state.searchComplete,
    searchProgress: state.searchProgress,
    currentStep: state.currentStep,
  }

  const searchActions = {
    setSelectedClientTypes: actions.setSelectedClientTypes,
    setSelectedLocations: actions.setSelectedLocations,
    setRequireWebsite: actions.setRequireWebsite,
    setValidateEmail: actions.setValidateEmail,
    setValidateWebsite: actions.setValidateWebsite,
    handleSearch: actions.handleSearch,
    resetSearch: actions.resetSearch,
    rerunSearch: (config: any) => {
      actions.setSelectedClientTypes(config.selectedClientTypes)
      actions.setSelectedLocations(config.selectedLocations)
      actions.setRequireWebsite(config.requireWebsite)
      actions.setValidateEmail(config.validateEmail)
      actions.setValidateWebsite(config.validateWebsite)
      actions.handleSearch()
    },
  }

  const canStartSearch = !!(
    state.selectedClientTypes.length > 0 && 
    state.selectedLocations.length > 0 && 
    !state.isSearching
  )

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
