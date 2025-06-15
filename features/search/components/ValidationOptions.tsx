"use client"

import { Shield, Globe, Mail, CheckCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import styles from "../styles/ValidationOptions.module.css"

interface ValidationOptionsProps {
  requireWebsite: boolean
  validateEmail: boolean
  validateWebsite: boolean
  setRequireWebsite: (require: boolean) => void
  setValidateEmail: (validate: boolean) => void
  setValidateWebsite: (validate: boolean) => void
}

export function ValidationOptions({ 
  requireWebsite, 
  validateEmail, 
  validateWebsite,
  setRequireWebsite,
  setValidateEmail,
  setValidateWebsite
}: ValidationOptionsProps) {
  
  const clearAll = () => {
    setRequireWebsite(false)
    setValidateEmail(false)
    setValidateWebsite(false)
  }

  const hasAnyValidation = requireWebsite || validateEmail || validateWebsite

  return (
    <Card className={styles.validationOptions}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <Shield className={styles.titleIcon} />
          Opciones de Validación
        </CardTitle>
        {hasAnyValidation && (
          <Button variant="ghost" size="sm" onClick={clearAll} className={styles.clearButton}>
            <X className={styles.clearButtonIcon} />
            Limpiar todo
          </Button>
        )}
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.optionsGrid}>
          {/* Require Website Option */}
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
                Solo empresas con sitio web
              </Label>
            </div>
            <p className={styles.optionDescription}>
              Filtrar solo empresas que tengan un sitio web registrado
            </p>
          </div>

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
        </div>

        {/* Summary */}
        {hasAnyValidation && (
          <div className={styles.validationSummary}>
            <h4 className={styles.summaryTitle}>Opciones seleccionadas:</h4>
            <ul className={styles.summaryList}>
              {requireWebsite && (
                <li className={styles.summaryItem}>
                  <Globe className={styles.summaryIcon} />
                  Solo empresas con sitio web
                </li>
              )}
              {validateEmail && (
                <li className={styles.summaryItem}>
                  <Mail className={styles.summaryIcon} />
                  Validación de emails activa
                </li>
              )}
              {validateWebsite && (
                <li className={styles.summaryItem}>
                  <CheckCircle className={styles.summaryIcon} />
                  Validación de sitios web activa
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 