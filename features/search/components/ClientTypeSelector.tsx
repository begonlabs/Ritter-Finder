"use client"

import { Check, ChevronsUpDown, Users, X, RefreshCw, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useClientTypes } from "../hooks"
import styles from "../styles/ClientTypeSelector.module.css"

interface ClientTypeSelectorProps {
  selectedClientTypes: string[]
  setSelectedClientTypes: (clientTypes: string[]) => void
}

export function ClientTypeSelector({ selectedClientTypes, setSelectedClientTypes }: ClientTypeSelectorProps) {
  const { t } = useLanguage()
  const { clientTypes, isLoading, error, refetch } = useClientTypes()

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
    <Card className={styles.clientTypeSelector}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <Users className={styles.titleIcon} />
          Tipos de Cliente Objetivo
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
            <Button
              variant="outline"
              role="combobox"
              className={styles.dropdownTrigger}
            >
              {selectedClientTypes.length === 0 
                ? "Selecciona tipos de cliente..." 
                : `${selectedClientTypes.length} tipo${selectedClientTypes.length > 1 ? 's' : ''} seleccionado${selectedClientTypes.length > 1 ? 's' : ''}`
              }
              <ChevronsUpDown className={styles.dropdownIcon} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={styles.popoverContent} align="start">
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
          <div className={styles.selectedTypes}>
            <div className={styles.selectedTypesHeader}>
              <span className={styles.selectedTypesLabel}>Tipos seleccionados:</span>
              <Button variant="ghost" size="sm" onClick={clearAll} className={styles.clearButton}>
                <X className={styles.clearButtonIcon} />
                Limpiar todo
              </Button>
            </div>
            <div className={styles.badgeContainer}>
              {selectedClientTypes.map((clientType) => (
                <Badge key={clientType} variant="secondary" className={styles.badge}>
                  {getClientTypeLabel(clientType)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.badgeRemoveButton}
                    onClick={() => handleRemove(clientType)}
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
