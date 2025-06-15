"use client"

import { SearchForm } from "@/features/search"
import type { TabComponentProps } from "../types"
import styles from "../styles/SearchTab.module.css"

export function SearchTab({ state, actions }: TabComponentProps) {
  const searchState = {
    selectedWebsites: state.selectedWebsites,
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
    setSelectedWebsites: actions.setSelectedWebsites,
    setSelectedClientTypes: actions.setSelectedClientTypes,
    setSelectedLocations: actions.setSelectedLocations,
    setRequireWebsite: actions.setRequireWebsite,
    setValidateEmail: actions.setValidateEmail,
    setValidateWebsite: actions.setValidateWebsite,
    handleSearch: actions.handleSearch,
    resetSearch: actions.resetSearch,
    rerunSearch: (config: any) => {
      actions.setSelectedWebsites(config.selectedWebsites)
      actions.setSelectedClientTypes(config.selectedClientTypes)
      actions.setSelectedLocations(config.selectedLocations)
      actions.setRequireWebsite(config.requireWebsite)
      actions.setValidateEmail(config.validateEmail)
      actions.setValidateWebsite(config.validateWebsite)
      actions.handleSearch()
    },
  }

  const canStartSearch = !!(
    state.selectedWebsites.length > 0 && 
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
