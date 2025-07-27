"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { ClientTypeSelector } from "./ClientTypeSelector"
import { LocationSelector } from "./LocationSelector"
import { ValidationOptions } from "./ValidationOptions"
import { ScrapingSimulation } from "./ScrapingSimulation"
import type { SearchState, SearchActions } from "../types"
import styles from "../styles/SearchForm.module.css"
import { cn } from "@/lib/utils"

interface SearchFormProps {
  state: SearchState
  actions: SearchActions
  canStartSearch: boolean
  searchComplete?: boolean
  currentSearchId?: string | null
}

export function SearchForm({ state, actions, canStartSearch, searchComplete, currentSearchId }: SearchFormProps) {
  const { t } = useLanguage()
  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()

  const gridCols = utils.getGridCols()
  const buttonSize = utils.getButtonSize()
  const textSize = utils.getTextSize('base')
  const spacing = utils.getSpacing('md')

  return (
    <div className={cn(
      styles.searchForm,
      isSmallScreen && styles.searchFormMobile,
      isMediumScreen && styles.searchFormTablet,
      isLargeScreen && styles.searchFormDesktop
    )}>
      <div className={cn(
        styles.formHeader,
        isSmallScreen && styles.formHeaderMobile
      )}>
        <h2 className={cn(
          styles.formTitle,
          isSmallScreen && styles.formTitleMobile,
          isMediumScreen && styles.formTitleTablet
        )}>
          Búsqueda Inteligente de Leads
        </h2>
        <p className={cn(
          styles.formDescription,
          isSmallScreen && styles.formDescriptionMobile
        )}>
          Configura tu búsqueda y deja que nuestra IA encuentre los mejores leads
        </p>
      </div>

      <div className={cn(
        styles.configGrid,
        isSmallScreen && styles.configGridMobile,
        isMediumScreen && styles.configGridTablet,
        isLargeScreen && styles.configGridDesktop
      )} style={{ '--grid-cols': gridCols, '--spacing': spacing } as React.CSSProperties}>
        <ClientTypeSelector
          selectedClientTypes={state.selectedClientTypes}
          setSelectedClientTypes={actions.setSelectedClientTypes}
        />
        <LocationSelector
          selectedLocations={state.selectedLocations}
          setSelectedLocations={actions.setSelectedLocations}
        />
        <ValidationOptions
          requireWebsite={state.requireWebsite}
          requireEmail={state.requireEmail}
          requirePhone={state.requirePhone}
          setRequireWebsite={actions.setRequireWebsite}
          setRequireEmail={actions.setRequireEmail}
          setRequirePhone={actions.setRequirePhone}
        />
      </div>

      {!canStartSearch && !state.isSearching && (
        <Alert className={cn(
          styles.alert,
          isSmallScreen && styles.alertMobile
        )}>
          <AlertDescription className={cn(
            styles.alertText,
            isSmallScreen && styles.alertTextMobile
          )}>
            Selecciona al menos un tipo de cliente y una ubicación para comenzar la búsqueda.
          </AlertDescription>
        </Alert>
      )}

      {searchComplete && currentSearchId && (
        <Alert className={cn(
          styles.alert,
          styles.successAlert,
          isSmallScreen && styles.alertMobile
        )}>
          <CheckCircle className={cn(
            styles.successIcon,
            isSmallScreen && styles.successIconMobile
          )} />
          <AlertDescription className={cn(
            styles.alertText,
            isSmallScreen && styles.alertTextMobile
          )}>
            Búsqueda completada y guardada en el historial. ID: {currentSearchId.slice(-8)}
          </AlertDescription>
        </Alert>
      )}

      <div className={cn(
        styles.searchButtonContainer,
        isSmallScreen && styles.searchButtonContainerMobile,
        isMediumScreen && styles.searchButtonContainerTablet
      )}>
        <Button
          onClick={actions.handleSearch}
          disabled={!canStartSearch}
          className={cn(
            styles.searchButton,
            state.isSearching && styles.loadingButton,
            isSmallScreen && styles.searchButtonMobile,
            isMediumScreen && styles.searchButtonTablet,
            isLargeScreen && styles.searchButtonDesktop
          )}
          size={buttonSize}
        >
          {state.isSearching ? (
            <>
              <div className={styles.loadingSpinner}></div>
              <span className={cn(
                styles.loadingText,
                isSmallScreen && styles.loadingTextMobile
              )}>
                Buscando...
              </span>
            </>
          ) : (
            <>
              <Search className={cn(
                styles.searchButtonIcon,
                isSmallScreen && styles.searchButtonIconMobile
              )} />
              {t("search.button")}
            </>
          )}
        </Button>
      </div>

      {state.isSearching && <ScrapingSimulation />}
    </div>
  )
}
