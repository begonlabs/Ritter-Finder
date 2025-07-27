"use client"

import { Shield, Globe, Mail, Phone, CheckCircle, X, Filter, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useResponsive } from "@/features/layout/hooks/useResponsive"

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
  
  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()
  
  const clearAllFilters = () => {
    setRequireWebsite(false)
    setRequireEmail(false)
    setRequirePhone(false)
  }

  const hasAnyFilter = requireWebsite || requireEmail || requirePhone

  return (
    <Card className={cn(
      styles.validationOptions,
      isSmallScreen && styles.validationOptionsMobile,
      isMediumScreen && styles.validationOptionsTablet,
      isLargeScreen && styles.validationOptionsDesktop
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
          <Shield className={cn(
            styles.titleIcon,
            isSmallScreen && styles.titleIconMobile
          )} />
          Filtros de Datos
        </CardTitle>
        {hasAnyFilter && (
          <Button 
            variant="ghost" 
            size={isSmallScreen ? "sm" : "sm"} 
            onClick={clearAllFilters} 
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
        )}
      </CardHeader>
      <CardContent className={cn(
        styles.content,
        isSmallScreen && styles.contentMobile
      )}>
          <div className={cn(
            styles.section,
            isSmallScreen && styles.sectionMobile
          )}>
            <div className={cn(
              styles.sectionHeader,
              isSmallScreen && styles.sectionHeaderMobile
            )}>
              <h3 className={cn(
                styles.sectionTitle,
                isSmallScreen && styles.sectionTitleMobile
              )}>
                <Filter className={cn(
                  styles.sectionIcon,
                  isSmallScreen && styles.sectionIconMobile
                )} />
                Filtros de Datos
              </h3>
              {hasAnyFilter && (
                <Button 
                  variant="ghost" 
                  size={isSmallScreen ? "sm" : "sm"} 
                  onClick={clearAllFilters} 
                  className={cn(
                    styles.sectionClearButton,
                    isSmallScreen && styles.sectionClearButtonMobile
                  )}
                >
                  <X className={cn(
                    styles.clearButtonIcon,
                    isSmallScreen && styles.clearButtonIconMobile
                  )} />
                  {!isSmallScreen && "Limpiar"}
                </Button>
              )}
            </div>
            <p className={cn(
              styles.sectionDescription,
              isSmallScreen && styles.sectionDescriptionMobile
            )}>
              Mostrar solo empresas que tengan estos tipos de información
            </p>
            
            <div className={cn(
              styles.optionsGrid,
              isSmallScreen && styles.optionsGridMobile,
              isMediumScreen && styles.optionsGridTablet
            )}>
              {/* Require Website Filter */}
              <div className={cn(
                styles.optionItem,
                isSmallScreen && styles.optionItemMobile
              )}>
                <div className={cn(
                  styles.optionHeader,
                  isSmallScreen && styles.optionHeaderMobile
                )}>
                  <Checkbox
                    id="require-website"
                    checked={requireWebsite}
                    onCheckedChange={setRequireWebsite}
                    className={cn(
                      styles.optionCheckbox,
                      isSmallScreen && styles.optionCheckboxMobile
                    )}
                  />
                  <Label 
                    htmlFor="require-website" 
                    className={cn(
                      styles.optionLabel,
                      isSmallScreen && styles.optionLabelMobile
                    )}
                  >
                    <Globe className={cn(
                      styles.optionIcon,
                      isSmallScreen && styles.optionIconMobile
                    )} />
                    Solo con sitio web
                  </Label>
                </div>
                <p className={cn(
                  styles.optionDescription,
                  isSmallScreen && styles.optionDescriptionMobile
                )}>
                  ✅ Filtrar solo empresas que tengan un sitio web registrado
                </p>
              </div>

              {/* Require Email Filter */}
              <div className={cn(
                styles.optionItem,
                isSmallScreen && styles.optionItemMobile
              )}>
                <div className={cn(
                  styles.optionHeader,
                  isSmallScreen && styles.optionHeaderMobile
                )}>
                  <Checkbox
                    id="require-email"
                    checked={requireEmail}
                    onCheckedChange={setRequireEmail}
                    className={cn(
                      styles.optionCheckbox,
                      isSmallScreen && styles.optionCheckboxMobile
                    )}
                  />
                  <Label 
                    htmlFor="require-email" 
                    className={cn(
                      styles.optionLabel,
                      isSmallScreen && styles.optionLabelMobile
                    )}
                  >
                    <Mail className={cn(
                      styles.optionIcon,
                      isSmallScreen && styles.optionIconMobile
                    )} />
                    Solo con email
                  </Label>
                </div>
                <p className={cn(
                  styles.optionDescription,
                  isSmallScreen && styles.optionDescriptionMobile
                )}>
                  ✅ Filtrar solo empresas que tengan una dirección de email registrada
                </p>
              </div>

              {/* Require Phone Filter */}
              <div className={cn(
                styles.optionItem,
                isSmallScreen && styles.optionItemMobile
              )}>
                <div className={cn(
                  styles.optionHeader,
                  isSmallScreen && styles.optionHeaderMobile
                )}>
                  <Checkbox
                    id="require-phone"
                    checked={requirePhone}
                    onCheckedChange={setRequirePhone}
                    className={cn(
                      styles.optionCheckbox,
                      isSmallScreen && styles.optionCheckboxMobile
                    )}
                  />
                  <Label 
                    htmlFor="require-phone" 
                    className={cn(
                      styles.optionLabel,
                      isSmallScreen && styles.optionLabelMobile
                    )}
                  >
                    <Phone className={cn(
                      styles.optionIcon,
                      isSmallScreen && styles.optionIconMobile
                    )} />
                    Solo con teléfono
                  </Label>
                </div>
                <p className={cn(
                  styles.optionDescription,
                  isSmallScreen && styles.optionDescriptionMobile
                )}>
                  ✅ Filtrar solo empresas que tengan un número de teléfono registrado
                </p>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        {hasAnyFilter && (
          <div className={cn(
            styles.validationSummary,
            isSmallScreen && styles.validationSummaryMobile
          )}>
            <h4 className={cn(
              styles.summaryTitle,
              isSmallScreen && styles.summaryTitleMobile
            )}>
              Resumen de filtros seleccionados:
            </h4>
            <div className={cn(
              styles.summaryContent,
              isSmallScreen && styles.summaryContentMobile
            )}>
                <div className={cn(
                  styles.summarySection,
                  isSmallScreen && styles.summarySectionMobile
                )}>
                  <h5 className={cn(
                    styles.summarySubtitle,
                    isSmallScreen && styles.summarySubtitleMobile
                  )}>
                    <Filter className={cn(
                      styles.summarySubIcon,
                      isSmallScreen && styles.summarySubIconMobile
                    )} />
                    Filtros:
                  </h5>
                  <ul className={cn(
                    styles.summaryList,
                    isSmallScreen && styles.summaryListMobile
                  )}>
                    {requireWebsite && (
                      <li className={cn(
                        styles.summaryItem,
                        isSmallScreen && styles.summaryItemMobile
                      )}>
                        <Globe className={cn(
                          styles.summaryIcon,
                          isSmallScreen && styles.summaryIconMobile
                        )} />
                        Solo empresas con sitio web
                      </li>
                    )}
                    {requireEmail && (
                      <li className={cn(
                        styles.summaryItem,
                        isSmallScreen && styles.summaryItemMobile
                      )}>
                        <Mail className={cn(
                          styles.summaryIcon,
                          isSmallScreen && styles.summaryIconMobile
                        )} />
                        Solo empresas con email
                      </li>
                    )}
                    {requirePhone && (
                      <li className={cn(
                        styles.summaryItem,
                        isSmallScreen && styles.summaryItemMobile
                      )}>
                        <Phone className={cn(
                          styles.summaryIcon,
                          isSmallScreen && styles.summaryIconMobile
                        )} />
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