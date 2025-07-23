 "use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Check,
  ChevronsUpDown,
  Plus,
  Tag,
  Users,
  X,
  AlertTriangle
} from "lucide-react"
import { useCategories } from "../hooks/useCategories"
import type { CategoryOption } from "../hooks/useCategories"
import styles from "../styles/CategorySelector.module.css"

interface CategorySelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showLeadCount?: boolean
}

export function CategorySelector({
  value,
  onChange,
  placeholder = "Seleccionar categoría...",
  disabled = false,
  className = "",
  showLeadCount = true
}: CategorySelectorProps) {
  const {
    categories,
    categoryOptions,
    isLoading,
    error,
    isCreating,
    searchCategories,
    createCategory,
    validateCategoryName
  } = useCategories()

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [createError, setCreateError] = useState<string | null>(null)

  const [filteredOptions, setFilteredOptions] = useState<CategoryOption[]>([])

  // Filtrar opciones basado en búsqueda
  useEffect(() => {
    const options = searchCategories(searchValue)
    setFilteredOptions(options)
  }, [searchValue, searchCategories])

  const handleSelect = useCallback((selectedValue: string) => {
    if (selectedValue.startsWith('new:')) {
      // Crear nueva categoría
      const categoryName = selectedValue.replace('new:', '')
      setNewCategoryName(categoryName)
      setShowCreateDialog(true)
      setOpen(false)
    } else {
      // Seleccionar categoría existente
      onChange(selectedValue)
      setOpen(false)
      setSearchValue("")
    }
  }, [onChange])

  const handleCreateCategory = useCallback(async () => {
    setCreateError(null)

    // Validar nombre
    const validation = validateCategoryName(newCategoryName)
    if (!validation.isValid) {
      setCreateError(validation.error || 'Error de validación')
      return
    }

    try {
      const newCategory = await createCategory(newCategoryName, newCategoryDescription)
      onChange(newCategory.name)
      setShowCreateDialog(false)
      setNewCategoryName("")
      setNewCategoryDescription("")
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error al crear categoría')
    }
  }, [newCategoryName, newCategoryDescription, createCategory, validateCategoryName, onChange])

  const handleClear = useCallback(() => {
    onChange("")
    setSearchValue("")
  }, [onChange])

  const selectedCategory = categories.find(cat => cat.name === value)

  return (
    <div className={`${styles.categorySelector} ${className}`}>
      <div className={styles.selectorContainer}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={styles.trigger}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner} />
                  <span>Cargando categorías...</span>
                </div>
              ) : value ? (
                <div className={styles.selectedValue}>
                  <Tag className={styles.categoryIcon} />
                  <span className={styles.categoryName}>{value}</span>
                  {showLeadCount && selectedCategory && (
                    <Badge variant="secondary" className={styles.leadCount}>
                      {selectedCategory.lead_count} leads
                    </Badge>
                  )}
                </div>
              ) : (
                <div className={styles.placeholder}>
                  <Tag className={styles.placeholderIcon} />
                  <span>{placeholder}</span>
                </div>
              )}
              <ChevronsUpDown className={styles.chevronIcon} />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className={styles.popoverContent} align="start">
            <Command>
              <CommandInput
                placeholder="Buscar categorías..."
                value={searchValue}
                onValueChange={setSearchValue}
                className={styles.commandInput}
              />
              
              <CommandList className={styles.commandList}>
                <CommandEmpty className={styles.commandEmpty}>
                  <div className={styles.emptyState}>
                    <Tag className={styles.emptyIcon} />
                    <span>No se encontraron categorías</span>
                    {searchValue && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateDialog(true)}
                        className={styles.createButton}
                      >
                        <Plus className={styles.createIcon} />
                        Crear "{searchValue}"
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                
                <CommandGroup className={styles.commandGroup}>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className={styles.commandItem}
                    >
                      <div className={styles.itemContent}>
                        {option.isNew ? (
                          <Plus className={styles.newIcon} />
                        ) : (
                          <Check
                            className={`${styles.checkIcon} ${
                              value === option.value ? styles.checked : styles.unchecked
                            }`}
                          />
                        )}
                        <div className={styles.itemText}>
                          <span className={styles.itemLabel}>{option.label}</span>
                          {option.description && (
                            <span className={styles.itemDescription}>
                              {option.description}
                            </span>
                          )}
                        </div>
                        {showLeadCount && !option.isNew && (
                          <Badge variant="secondary" className={styles.itemBadge}>
                            {option.leadCount}
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={disabled}
          >
            <X className={styles.clearIcon} />
          </Button>
        )}
      </div>

      {/* Dialog para crear nueva categoría */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>
              <Plus className={styles.dialogIcon} />
              Crear Nueva Categoría
            </DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              Crea una nueva categoría para organizar mejor tus leads
            </DialogDescription>
          </DialogHeader>

          <div className={styles.dialogForm}>
            <div className={styles.formGroup}>
              <Label htmlFor="categoryName" className={styles.formLabel}>
                Nombre de la Categoría <span className={styles.required}>*</span>
              </Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ej: Tecnología, Salud, Educación..."
                className={styles.formInput}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="categoryDescription" className={styles.formLabel}>
                Descripción (opcional)
              </Label>
              <Input
                id="categoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Describe brevemente esta categoría..."
                className={styles.formInput}
              />
            </div>

            {createError && (
              <div className={styles.errorMessage}>
                <AlertTriangle className={styles.errorIcon} />
                <span>{createError}</span>
              </div>
            )}
          </div>

          <DialogFooter className={styles.dialogFooter}>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || isCreating}
              className={styles.createButton}
            >
              {isCreating ? (
                <>
                  <div className={styles.loadingSpinner} />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className={styles.createIcon} />
                  Crear Categoría
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <div className={styles.errorContainer}>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}
    </div>
  )
}