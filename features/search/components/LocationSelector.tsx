"use client"

import { Check, ChevronsUpDown, MapPin, X, RefreshCw, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useLocations } from "../hooks"
import styles from "../styles/LocationSelector.module.css"

interface LocationSelectorProps {
  selectedLocations: string[]
  setSelectedLocations: (locations: string[]) => void
}

export function LocationSelector({ selectedLocations, setSelectedLocations }: LocationSelectorProps) {
  const { t } = useLanguage()
  const { locations, isLoading, error, refetch } = useLocations()

  const handleSelect = (value: string) => {
    if (value === "all") {
      // Si selecciona "Todas las ubicaciones", limpiar otras selecciones
      setSelectedLocations(["all"])
    } else {
      // Si selecciona una ubicación específica, quitar "Todas las ubicaciones" si está seleccionada
      const newSelections = selectedLocations.filter(loc => loc !== "all")
      
      if (newSelections.includes(value)) {
        setSelectedLocations(newSelections.filter(loc => loc !== value))
      } else {
        setSelectedLocations([...newSelections, value])
      }
    }
  }

  const handleRemove = (value: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc !== value))
  }

  const clearAll = () => {
    setSelectedLocations([])
  }

  const getLocationLabel = (value: string) => {
    const location = locations.find(loc => loc.value === value)
    return location ? location.label : value
  }

  return (
    <Card className={styles.locationSelector}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <MapPin className={styles.titleIcon} />
          Ubicación de Búsqueda
          <div className={styles.headerActions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={isLoading}
              className={styles.refreshButton}
            >
              <RefreshCw className={cn(styles.refreshIcon, isLoading && "animate-spin")} />
            </Button>
          </div>
        </CardTitle>
        {error && (
          <p className={styles.errorText}>
            {error} - Usando datos de respaldo
          </p>
        )}
      </CardHeader>
      <CardContent className={styles.content}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className={styles.dropdownTrigger}>
              {selectedLocations.length === 0 
                ? "Seleccionar ubicaciones..." 
                : selectedLocations.includes("all")
                  ? "Toda España"
                  : `${selectedLocations.length} ubicación${selectedLocations.length > 1 ? 'es' : ''} seleccionada${selectedLocations.length > 1 ? 's' : ''}`
              }
              <ChevronsUpDown className={styles.dropdownIcon} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={styles.popoverContent} align="start">
            <Command>
              <CommandInput placeholder="Buscar ubicación..." />
              <CommandList>
                <CommandEmpty>No se encontraron ubicaciones.</CommandEmpty>
                <CommandGroup>
                  {locations.map((location) => (
                    <CommandItem 
                      key={location.value} 
                      value={location.value} 
                      onSelect={() => handleSelect(location.value)}
                      className={styles.commandItem}
                    >
                      <div className={styles.commandItemContent}>
                        <div className={styles.commandItemHeader}>
                          <div className={styles.commandItemLabelSection}>
                          <div className={styles.commandItemDetails}>
                            <span className={styles.commandItemLabel}>
                              {location.label}
                            </span>
                              {location.region && (
                              <div className={styles.commandItemRegion}>{location.region}</div>
                              )}
                            </div>
                            {location.stats && (
                              <div className={styles.commandItemStats}>
                                <TrendingUp className={styles.statsIcon} />
                                <span className={styles.statsText}>
                                  {location.stats.totalLeads.toLocaleString()} leads
                                </span>
                                <span className={styles.qualityScore}>
                                  ★ {location.stats.avgQuality}/5
                                </span>
                                {location.stats.recentActivity > 0 && (
                                  <span className={styles.recentActivity}>
                                    <Clock className={styles.clockIcon} />
                                    {location.stats.recentActivity} recientes
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Check
                            className={cn(
                              styles.commandItemCheckbox,
                              selectedLocations.includes(location.value) 
                                ? styles.commandItemCheckboxChecked 
                                : styles.commandItemCheckboxUnchecked
                            )}
                          />
                        </div>
                        {location.stats && (
                          <div className={styles.commandItemExtendedStats}>
                            <span className={styles.extendedStat}>
                              📧 {location.stats.verifiedEmails} emails verificados
                            </span>
                            {location.stats.contactablePercentage > 0 && (
                              <span className={styles.extendedStat}>
                                📞 {location.stats.contactablePercentage}% contactables
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Locations */}
        {selectedLocations.length > 0 && (
          <div className={styles.selectedSection}>
            <div className={styles.selectedHeader}>
              <span className={styles.selectedLabel}>Ubicaciones seleccionadas:</span>
              <Button variant="ghost" size="sm" onClick={clearAll} className={styles.clearButton}>
                <X className={styles.clearButtonIcon} />
                Limpiar todo
              </Button>
            </div>
            <div className={styles.badgeContainer}>
              {selectedLocations.map((locationValue) => (
                <Badge key={locationValue} variant="secondary" className={styles.badge}>
                  {getLocationLabel(locationValue)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.badgeRemoveButton}
                    onClick={() => handleRemove(locationValue)}
                  >
                    <X className={styles.badgeRemoveIcon} />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 