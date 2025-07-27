"use client"

import { Check, ChevronsUpDown, MapPin, X, RefreshCw, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { useLocations } from "../hooks"
import styles from "../styles/LocationSelector.module.css"

interface LocationSelectorProps {
  selectedLocations: string[]
  setSelectedLocations: (locations: string[]) => void
}

export function LocationSelector({ selectedLocations, setSelectedLocations }: LocationSelectorProps) {
  const { t } = useLanguage()
  const { locations, isLoading, error, refetch } = useLocations()
  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()

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
    <Card className={cn(
      styles.locationSelector,
      isSmallScreen && styles.locationSelectorMobile,
      isMediumScreen && styles.locationSelectorTablet,
      isLargeScreen && styles.locationSelectorDesktop
    )}>
      <CardHeader className={cn(
        styles.header,
        isSmallScreen && styles.headerMobile
      )}>
        <CardTitle className={cn(
          styles.title,
          isSmallScreen && styles.titleMobile,
          isMediumScreen && styles.titleTablet
        )}>
          <MapPin className={cn(
            styles.titleIcon,
            isSmallScreen && styles.titleIconMobile
          )} />
          Ubicación de Búsqueda
          <div className={styles.headerActions}>
            <Button
              variant="ghost"
              size={isSmallScreen ? "sm" : "sm"}
              onClick={refetch}
              disabled={isLoading}
              className={cn(
                styles.refreshButton,
                isSmallScreen && styles.refreshButtonMobile
              )}
            >
              <RefreshCw className={cn(
                styles.refreshIcon, 
                isLoading && "animate-spin",
                isSmallScreen && styles.refreshIconMobile
              )} />
            </Button>
          </div>
        </CardTitle>
        {error && (
          <p className={cn(
            styles.errorText,
            isSmallScreen && styles.errorTextMobile
          )}>
            {error} - Usando datos de respaldo
          </p>
        )}
      </CardHeader>
      <CardContent className={cn(
        styles.content,
        isSmallScreen && styles.contentMobile
      )}>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              className={cn(
                styles.dropdownTrigger,
                isSmallScreen && styles.dropdownTriggerMobile,
                isMediumScreen && styles.dropdownTriggerTablet
              )}
            >
              {selectedLocations.length === 0 
                ? "Seleccionar ubicaciones..." 
                : selectedLocations.includes("all")
                  ? "Toda España"
                  : `${selectedLocations.length} ubicación${selectedLocations.length > 1 ? 'es' : ''} seleccionada${selectedLocations.length > 1 ? 's' : ''}`
              }
              <ChevronsUpDown className={cn(
                styles.dropdownIcon,
                isSmallScreen && styles.dropdownIconMobile
              )} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={cn(
            styles.popoverContent,
            isSmallScreen && styles.popoverContentMobile
          )} align="start">
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
          <div className={cn(
            styles.selectedSection,
            isSmallScreen && styles.selectedSectionMobile
          )}>
            <div className={cn(
              styles.selectedHeader,
              isSmallScreen && styles.selectedHeaderMobile
            )}>
              <span className={cn(
                styles.selectedLabel,
                isSmallScreen && styles.selectedLabelMobile
              )}>
                Ubicaciones seleccionadas:
              </span>
              <Button 
                variant="ghost" 
                size={isSmallScreen ? "sm" : "sm"} 
                onClick={clearAll} 
                className={cn(
                  styles.clearButton,
                  isSmallScreen && styles.clearButtonMobile
                )}
              >
                <X className={cn(
                  styles.clearButtonIcon,
                  isSmallScreen && styles.clearButtonIconMobile
                )} />
                {!isSmallScreen && "Limpiar todo"}
              </Button>
            </div>
            <div className={cn(
              styles.badgeContainer,
              isSmallScreen && styles.badgeContainerMobile
            )}>
              {selectedLocations.map((locationValue) => (
                <Badge 
                  key={locationValue} 
                  variant="secondary" 
                  className={cn(
                    styles.badge,
                    isSmallScreen && styles.badgeMobile
                  )}
                >
                  {getLocationLabel(locationValue)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      styles.badgeRemoveButton,
                      isSmallScreen && styles.badgeRemoveButtonMobile
                    )}
                    onClick={() => handleRemove(locationValue)}
                  >
                    <X className={cn(
                      styles.badgeRemoveIcon,
                      isSmallScreen && styles.badgeRemoveIconMobile
                    )} />
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