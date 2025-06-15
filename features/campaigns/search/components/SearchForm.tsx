"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { WebsiteSelector } from "./WebsiteSelector"
import { ClientTypeSelector } from "./ClientTypeSelector"
import { ScrapingSimulation } from "./ScrapingSimulation"
import type { SearchState, SearchActions } from "../types"
import styles from "../styles/SearchForm.module.css"

interface SearchFormProps {
  state: SearchState
  actions: SearchActions
  canStartSearch: boolean
}

export function SearchForm({ state, actions, canStartSearch }: SearchFormProps) {
  const { t } = useLanguage()

  return (
    <div className={styles.searchForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Búsqueda Inteligente de Leads</h2>
        <p className={styles.formDescription}>Configura tu búsqueda y deja que nuestra IA encuentre los mejores leads</p>
      </div>

      <div className={styles.configGrid}>
        <WebsiteSelector 
          selectedWebsites={state.selectedWebsites} 
          setSelectedWebsites={actions.setSelectedWebsites} 
        />
        <ClientTypeSelector
          selectedClientType={state.selectedClientType}
          setSelectedClientType={actions.setSelectedClientType}
        />
      </div>

      {!canStartSearch && !state.isSearching && (
        <Alert className={styles.alert}>
          <AlertDescription className={styles.alertText}>
            Selecciona al menos un sitio web y un tipo de cliente para comenzar la búsqueda.
          </AlertDescription>
        </Alert>
      )}

      <div className={styles.searchButtonContainer}>
        <Button
          onClick={actions.handleSearch}
          disabled={!canStartSearch}
          className={`${styles.searchButton} ${state.isSearching ? styles.loadingButton : ''}`}
          size="lg"
        >
          {state.isSearching ? (
            <>
              <div className={styles.loadingSpinner}></div>
              <span className={styles.loadingText}>Buscando...</span>
            </>
          ) : (
            <>
              <Search className={styles.searchButtonIcon} />
              {t("search.button")}
            </>
          )}
        </Button>
      </div>

      {state.isSearching && <ScrapingSimulation websites={state.selectedWebsites} />}
    </div>
  )
}
