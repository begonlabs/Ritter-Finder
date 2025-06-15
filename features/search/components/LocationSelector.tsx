"use client"

import { Check, ChevronsUpDown, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import styles from "../styles/LocationSelector.module.css"

const spanishLocations = [
  { value: "all", label: "Toda España", region: "España" },
  { value: "madrid", label: "Madrid", region: "Comunidad de Madrid" },
  { value: "barcelona", label: "Barcelona", region: "Cataluña" },
  { value: "valencia", label: "Valencia", region: "Comunidad Valenciana" },
  { value: "sevilla", label: "Sevilla", region: "Andalucía" },
  { value: "bilbao", label: "Bilbao", region: "País Vasco" },
  { value: "malaga", label: "Málaga", region: "Andalucía" },
  { value: "zaragoza", label: "Zaragoza", region: "Aragón" },
  { value: "murcia", label: "Murcia", region: "Región de Murcia" },
  { value: "palma", label: "Palma", region: "Islas Baleares" },
  { value: "las-palmas", label: "Las Palmas", region: "Canarias" },
  { value: "vigo", label: "Vigo", region: "Galicia" },
  { value: "gijon", label: "Gijón", region: "Asturias" },
  { value: "hospitalet", label: "L'Hospitalet", region: "Cataluña" },
  { value: "cordoba", label: "Córdoba", region: "Andalucía" },
  { value: "valladolid", label: "Valladolid", region: "Castilla y León" },
]

interface LocationSelectorProps {
  selectedLocations: string[]
  setSelectedLocations: (locations: string[]) => void
}

export function LocationSelector({ selectedLocations, setSelectedLocations }: LocationSelectorProps) {
  const { t } = useLanguage()

  const handleSelect = (value: string) => {
    if (value === "all") {
      // Si selecciona "Toda España", limpiar otras selecciones
      setSelectedLocations(["all"])
    } else {
      // Si selecciona una ubicación específica, quitar "Toda España" si está seleccionada
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
    const location = spanishLocations.find(loc => loc.value === value)
    return location ? location.label : value
  }

  return (
    <Card className={styles.locationSelector}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <MapPin className={styles.titleIcon} />
          Ubicación de Búsqueda
        </CardTitle>
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
                  {spanishLocations.map((location) => (
                    <CommandItem 
                      key={location.value} 
                      value={location.value} 
                      onSelect={() => handleSelect(location.value)}
                      className={styles.commandItem}
                    >
                      <div className={styles.commandItemContent}>
                        <div className={styles.commandItemHeader}>
                          <div className={styles.commandItemDetails}>
                            <span className={styles.commandItemLabel}>
                              {location.label}
                            </span>
                            {location.value !== "all" && (
                              <div className={styles.commandItemRegion}>{location.region}</div>
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