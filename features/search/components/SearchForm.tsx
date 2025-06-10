"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { WebsiteSelector } from "./WebsiteSelector"
import { ClientTypeSelector } from "./ClientTypeSelector"
import { ScrapingSimulation } from "./ScrapingSimulation"
import type { SearchState, SearchActions } from "../types"

interface SearchFormProps {
  state: SearchState
  actions: SearchActions
  canStartSearch: boolean
}

export function SearchForm({ state, actions, canStartSearch }: SearchFormProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Búsqueda Inteligente de Leads</h2>
        <p className="text-gray-600">Configura tu búsqueda y deja que nuestra IA encuentre los mejores leads</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
        <Alert>
          <AlertDescription>
            Selecciona al menos un sitio web y un tipo de cliente para comenzar la búsqueda.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center mt-6">
        <Button
          onClick={actions.handleSearch}
          disabled={!canStartSearch}
          className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark px-8 h-12 text-lg"
          size="lg"
        >
          {state.isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ritter-dark mr-2"></div>
              Buscando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              {t("search.button")}
            </>
          )}
        </Button>
      </div>

      {state.isSearching && <ScrapingSimulation websites={state.selectedWebsites} />}
    </div>
  )
}
