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
}

export function ValidationOptions({ 
  // Filtros
  requireWebsite, 
  requireEmail,
  requirePhone,
  setRequireWebsite,
  setRequireEmail,
  setRequirePhone
}: ValidationOptionsProps) {
  
  const clearAllFilters = () => {
    setRequireWebsite(false)
    setRequireEmail(false)
    setRequirePhone(false)
  }

  const hasAnyFilter = requireWebsite || requireEmail || requirePhone

  return (
    <Card className={styles.validationOptions}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <Shield className={styles.titleIcon} />
          Filtros de Datos
        </CardTitle>
        {hasAnyFilter && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className={styles.clearButton}>
            <X className={styles.clearButtonIcon} />
            Limpiar todo
          </Button>
        )}
      </CardHeader>
      <CardContent className={styles.content}>
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
                  ✅ Filtrar solo empresas que tengan un sitio web registrado
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
                  ✅ Filtrar solo empresas que tengan una dirección de email registrada
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
                  ✅ Filtrar solo empresas que tengan un número de teléfono registrado
                </p>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        {hasAnyFilter && (
          <div className={styles.validationSummary}>
            <h4 className={styles.summaryTitle}>Resumen de filtros seleccionados:</h4>
            <div className={styles.summaryContent}>
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 