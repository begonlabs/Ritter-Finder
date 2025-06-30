"use client"

import { Shield, Globe, Mail, Phone, CheckCircle, X, Filter, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import styles from "../styles/ValidationOptions.module.css"

interface ValidationOptionsProps {
  // Filtros - Solo mostrar empresas que tengan estos datos
  requireWebsite: boolean
  requireEmail: boolean
  requirePhone: boolean
  setRequireWebsite: (require: boolean) => void
  setRequireEmail: (require: boolean) => void
  setRequirePhone: (require: boolean) => void
  
  // Validaciones - Verificar calidad de los datos
  validateEmail: boolean
  validateWebsite: boolean
  validatePhone: boolean
  setValidateEmail: (validate: boolean) => void
  setValidateWebsite: (validate: boolean) => void
  setValidatePhone: (validate: boolean) => void
}

export function ValidationOptions({ 
  // Filtros
  requireWebsite, 
  requireEmail,
  requirePhone,
  setRequireWebsite,
  setRequireEmail,
  setRequirePhone,
  
  // Validaciones
  validateEmail, 
  validateWebsite,
  validatePhone,
  setValidateEmail,
  setValidateWebsite,
  setValidatePhone
}: ValidationOptionsProps) {
  
  const clearAllFilters = () => {
    setRequireWebsite(false)
    setRequireEmail(false)
    setRequirePhone(false)
  }

  const clearAllValidations = () => {
    setValidateEmail(false)
    setValidateWebsite(false)
    setValidatePhone(false)
  }

  const clearAll = () => {
    clearAllFilters()
    clearAllValidations()
  }

  const hasAnyFilter = requireWebsite || requireEmail || requirePhone
  const hasAnyValidation = validateEmail || validateWebsite || validatePhone
  const hasAnyOption = hasAnyFilter || hasAnyValidation

  return (
    <Card className={styles.validationOptions}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <Shield className={styles.titleIcon} />
          Opciones de Validación
        </CardTitle>
        {hasAnyOption && (
          <Button variant="ghost" size="sm" onClick={clearAll} className={styles.clearButton}>
            <X className={styles.clearButtonIcon} />
            Limpiar todo
          </Button>
        )}
      </CardHeader>
      <CardContent className={styles.content}>
        {/* TWO COLUMN LAYOUT */}
        <div className={styles.sectionsContainer}>
          {/* FILTROS SECTION */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Filter className={styles.sectionIcon} />
                Filtros de Datos
              </h3>
              {hasAnyFilter && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className={styles.sectionClearButton}>
                  <X className={styles.clearButtonIcon} />
                  Limpiar
                </Button>
              )}
            </div>
            <p className={styles.sectionDescription}>
              Mostrar solo empresas que tengan estos tipos de información
            </p>
            
            <div className={styles.optionsGrid}>
              {/* Require Website Filter */}
              <div className={styles.optionItem}>
                <div className={styles.optionHeader}>
                  <Checkbox
                    id="require-website"
                    checked={requireWebsite}
                    onCheckedChange={setRequireWebsite}
                    className={styles.optionCheckbox}
                  />
                  <Label htmlFor="require-website" className={styles.optionLabel}>
                    <Globe className={styles.optionIcon} />
                    Solo con sitio web
                  </Label>
                </div>
                <p className={styles.optionDescription}>
                  Filtrar solo empresas que tengan un sitio web registrado
                </p>
              </div>

              {/* Require Email Filter */}
              <div className={styles.optionItem}>
                <div className={styles.optionHeader}>
                  <Checkbox
                    id="require-email"
                    checked={requireEmail}
                    onCheckedChange={setRequireEmail}
                    className={styles.optionCheckbox}
                  />
                  <Label htmlFor="require-email" className={styles.optionLabel}>
                    <Mail className={styles.optionIcon} />
                    Solo con email
                  </Label>
                </div>
                <p className={styles.optionDescription}>
                  Filtrar solo empresas que tengan una dirección de email registrada
                </p>
              </div>

              {/* Require Phone Filter */}
              <div className={styles.optionItem}>
                <div className={styles.optionHeader}>
                  <Checkbox
                    id="require-phone"
                    checked={requirePhone}
                    onCheckedChange={setRequirePhone}
                    className={styles.optionCheckbox}
                  />
                  <Label htmlFor="require-phone" className={styles.optionLabel}>
                    <Phone className={styles.optionIcon} />
                    Solo con teléfono
                  </Label>
                </div>
                <p className={styles.optionDescription}>
                  Filtrar solo empresas que tengan un número de teléfono registrado
                </p>
              </div>
            </div>
          </div>

          {/* VALIDACIONES SECTION */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Zap className={styles.sectionIcon} />
                Validaciones de Calidad
              </h3>
              {hasAnyValidation && (
                <Button variant="ghost" size="sm" onClick={clearAllValidations} className={styles.sectionClearButton}>
                  <X className={styles.clearButtonIcon} />
                  Limpiar
                </Button>
              )}
            </div>
            <p className={styles.sectionDescription}>
              Verificar activamente la calidad y disponibilidad de los datos
            </p>

            <div className={styles.optionsGrid}>
              {/* Validate Email Option */}
              <div className={styles.optionItem}>
                <div className={styles.optionHeader}>
                  <Checkbox
                    id="validate-email"
                    checked={validateEmail}
                    onCheckedChange={setValidateEmail}
                    className={styles.optionCheckbox}
                  />
                  <Label htmlFor="validate-email" className={styles.optionLabel}>
                    <Mail className={styles.optionIcon} />
                    Validar emails
                  </Label>
                </div>
                <p className={styles.optionDescription}>
                  Verificar que las direcciones de email sean válidas y estén activas
                </p>
                {validateEmail && (
                  <div className={styles.optionNote}>
                    <CheckCircle className={styles.noteIcon} />
                    <span className={styles.noteText}>Aumentará el tiempo de búsqueda</span>
                  </div>
                )}
              </div>

              {/* Validate Website Option */}
              <div className={styles.optionItem}>
                <div className={styles.optionHeader}>
                  <Checkbox
                    id="validate-website"
                    checked={validateWebsite}
                    onCheckedChange={setValidateWebsite}
                    className={styles.optionCheckbox}
                  />
                  <Label htmlFor="validate-website" className={styles.optionLabel}>
                    <Globe className={styles.optionIcon} />
                    Validar sitios web
                  </Label>
                </div>
                <p className={styles.optionDescription}>
                  Verificar que los sitios web estén activos y accesibles
                </p>
                {validateWebsite && (
                  <div className={styles.optionNote}>
                    <CheckCircle className={styles.noteIcon} />
                    <span className={styles.noteText}>Aumentará el tiempo de búsqueda</span>
                  </div>
                )}
              </div>

              {/* Validate Phone Option */}
              <div className={styles.optionItem}>
                <div className={styles.optionHeader}>
                  <Checkbox
                    id="validate-phone"
                    checked={validatePhone}
                    onCheckedChange={setValidatePhone}
                    className={styles.optionCheckbox}
                  />
                  <Label htmlFor="validate-phone" className={styles.optionLabel}>
                    <Phone className={styles.optionIcon} />
                    Validar teléfonos
                  </Label>
                </div>
                <p className={styles.optionDescription}>
                  Verificar que los números de teléfono sean válidos y estén activos
                </p>
                {validatePhone && (
                  <div className={styles.optionNote}>
                    <CheckCircle className={styles.noteIcon} />
                    <span className={styles.noteText}>Aumentará significativamente el tiempo de búsqueda</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        {hasAnyOption && (
          <div className={styles.validationSummary}>
            <h4 className={styles.summaryTitle}>Resumen de opciones seleccionadas:</h4>
            <div className={styles.summaryContent}>
              {hasAnyFilter && (
                <div className={styles.summarySection}>
                  <h5 className={styles.summarySubtitle}>
                    <Filter className={styles.summarySubIcon} />
                    Filtros:
                  </h5>
                  <ul className={styles.summaryList}>
                    {requireWebsite && (
                      <li className={styles.summaryItem}>
                        <Globe className={styles.summaryIcon} />
                        Solo empresas con sitio web
                      </li>
                    )}
                    {requireEmail && (
                      <li className={styles.summaryItem}>
                        <Mail className={styles.summaryIcon} />
                        Solo empresas con email
                      </li>
                    )}
                    {requirePhone && (
                      <li className={styles.summaryItem}>
                        <Phone className={styles.summaryIcon} />
                        Solo empresas con teléfono
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {hasAnyValidation && (
                <div className={styles.summarySection}>
                  <h5 className={styles.summarySubtitle}>
                    <Zap className={styles.summarySubIcon} />
                    Validaciones:
                  </h5>
                  <ul className={styles.summaryList}>
                    {validateEmail && (
                      <li className={styles.summaryItem}>
                        <Mail className={styles.summaryIcon} />
                        Validación de emails activa
                      </li>
                    )}
                    {validateWebsite && (
                      <li className={styles.summaryItem}>
                        <Globe className={styles.summaryIcon} />
                        Validación de sitios web activa
                      </li>
                    )}
                    {validatePhone && (
                      <li className={styles.summaryItem}>
                        <Phone className={styles.summaryIcon} />
                        Validación de teléfonos activa
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 