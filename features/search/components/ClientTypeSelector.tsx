"use client"

import { Check, ChevronsUpDown, Users, X, RefreshCw, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { useClientTypes } from "../hooks"
import styles from "../styles/ClientTypeSelector.module.css"

interface ClientTypeSelectorProps {
  selectedClientTypes: string[]
  setSelectedClientTypes: (clientTypes: string[]) => void
}

export function ClientTypeSelector({ selectedClientTypes, setSelectedClientTypes }: ClientTypeSelectorProps) {
  const { t } = useLanguage()
  const { clientTypes, isLoading, error, refetch } = useClientTypes()
  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()

  const handleSelect = (value: string) => {
    if (selectedClientTypes.includes(value)) {
      setSelectedClientTypes(selectedClientTypes.filter(type => type !== value))
    } else {
      setSelectedClientTypes([...selectedClientTypes, value])
    }
  }

  const handleRemove = (value: string) => {
    setSelectedClientTypes(selectedClientTypes.filter(type => type !== value))
  }

  const clearAll = () => {
    setSelectedClientTypes([])
  }

  const getClientTypeLabel = (value: string) => {
    const clientType = clientTypes.find(type => type.value === value)
    return clientType ? clientType.label : value
  }

  return (
    <Card className={cn(
      styles.clientTypeSelector,
      isSmallScreen && styles.clientTypeSelectorMobile,
      isMediumScreen && styles.clientTypeSelectorTablet,
      isLargeScreen && styles.clientTypeSelectorDesktop
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
          <Users className={cn(
            styles.titleIcon,
            isSmallScreen && styles.titleIconMobile
          )} />
          Tipos de Cliente Objetivo
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
              {selectedClientTypes.length === 0 
                ? "Selecciona tipos de cliente..." 
                : `${selectedClientTypes.length} tipo${selectedClientTypes.length > 1 ? 's' : ''} seleccionado${selectedClientTypes.length > 1 ? 's' : ''}`
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
              <CommandInput placeholder="Buscar tipos de cliente..." />
              <CommandList>
                <CommandEmpty>No se encontraron tipos de cliente.</CommandEmpty>
                <CommandGroup>
                  {clientTypes.map((clientType) => (
                    <CommandItem 
                      key={clientType.value}
                      value={clientType.value}
                      onSelect={() => handleSelect(clientType.value)}
                      className={styles.commandItem}
                    >
                      <div className={styles.commandItemContent}>
                        <div className={styles.commandItemHeader}>
                          <div className={styles.commandItemLabelSection}>
                          <span className={styles.commandItemLabel}>
                            {clientType.label}
                          </span>
                            {clientType.stats && (
                              <div className={styles.commandItemStats}>
                                <TrendingUp className={styles.statsIcon} />
                                <span className={styles.statsText}>
                                  {clientType.stats.totalLeads.toLocaleString()} leads
                                </span>
                                <span className={styles.qualityScore}>
                                  ★ {clientType.stats.avgQuality}/5
                                </span>
                              </div>
                            )}
                          </div>
                          <Check
                          className={cn(
                            styles.commandItemCheckbox,
                              selectedClientTypes.includes(clientType.value) 
                                ? styles.commandItemCheckboxChecked 
                                : styles.commandItemCheckboxUnchecked
                          )}
                          />
                        </div>
                        <span className={styles.commandItemDescription}>
                          {clientType.description}
                        </span>
                        {clientType.stats && (
                          <div className={styles.commandItemExtendedStats}>
                            <span className={styles.extendedStat}>
                              📧 {clientType.stats.verifiedEmails} emails verificados
                            </span>
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

        {/* Selected Client Types */}
        {selectedClientTypes.length > 0 && (
          <div className={cn(
            styles.selectedTypes,
            isSmallScreen && styles.selectedTypesMobile
          )}>
            <div className={cn(
              styles.selectedTypesHeader,
              isSmallScreen && styles.selectedTypesHeaderMobile
            )}>
              <span className={cn(
                styles.selectedTypesLabel,
                isSmallScreen && styles.selectedTypesLabelMobile
              )}>
                Tipos seleccionados:
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
              {selectedClientTypes.map((clientType) => (
                <Badge 
                  key={clientType} 
                  variant="secondary" 
                  className={cn(
                    styles.badge,
                    isSmallScreen && styles.badgeMobile
                  )}
                >
                  {getClientTypeLabel(clientType)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      styles.badgeRemoveButton,
                      isSmallScreen && styles.badgeRemoveButtonMobile
                    )}
                    onClick={() => handleRemove(clientType)}
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
