"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, Users, Award, TrendingUp, Globe, Building2, Flag, Map } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useLeadStats } from "../hooks/useLeadStats"
import type { LeadStatsProps } from "../types"
import styles from "../styles/LeadStats.module.css"

export function LeadStats({ 
  showHeader = true, 
  compact = false,
  viewType = 'category',
  maxItems = 5
}: LeadStatsProps) {
  const { t } = useLanguage()
  const { data, isLoading, error } = useLeadStats(viewType)

  const getViewTitle = () => {
    switch (viewType) {
      case 'category':
        return 'Leads por Categoría'
      case 'country':
        return 'Leads por País'
      case 'state':
        return 'Leads por Estado/Región'
      case 'spain-region':
        return 'Leads por Comunidad Autónoma'
      default:
        return 'Estadísticas de Leads'
    }
  }

  const getViewDescription = () => {
    switch (viewType) {
      case 'category':
        return 'Distribución de leads por categoría de negocio'
      case 'country':
        return 'Leads distribuidos por países'
      case 'state':
        return 'Leads por estados y provincias'
      case 'spain-region':
        return 'Leads españoles por comunidad autónoma'
      default:
        return 'Análisis detallado de leads'
    }
  }

  const getViewIcon = () => {
    switch (viewType) {
      case 'category':
        return <Building2 className="h-5 w-5 text-ritter-gold" />
      case 'country':
        return <Globe className="h-5 w-5 text-ritter-gold" />
      case 'state':
        return <MapPin className="h-5 w-5 text-ritter-gold" />
      case 'spain-region':
        return <Flag className="h-5 w-5 text-ritter-gold" />
      default:
        return <Users className="h-5 w-5 text-ritter-gold" />
    }
  }

  const renderStats = () => {
    const displayData = data.slice(0, maxItems)
    
    switch (viewType) {
      case 'category':
        return displayData.map((item, index) => (
          <div key={`category-${item.category || index}`} className={`${styles.statItem} flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-ritter-gold/30 transition-all`}>
            <div className={styles.statLeft}>
              <h4 className={`${styles.statTitle} font-semibold text-gray-900`}>
                {item.category}
              </h4>
              <div className={`${styles.statMetrics} flex gap-4 mt-2 text-sm`}>
                <span className={`${styles.statMetric} text-blue-600`}>
                  {item.total_leads} leads
                </span>
                <span className={`${styles.statMetric} text-green-600`}>
                  {item.verified_emails} emails
                </span>
                <span className={`${styles.statMetric} text-purple-600`}>
                  {item.verified_phones} teléfonos
                </span>
              </div>
            </div>
            <div className={styles.statRight}>
              <div className={`${styles.qualityScore} flex items-center gap-2`}>
                <Award className="h-4 w-4 text-ritter-gold" />
                <span className="font-semibold text-gray-900">
                  {item.avg_quality_score}
                </span>
              </div>
              <div className={`${styles.verificationRate} text-xs text-gray-500 mt-1`}>
                {Math.round((item.verified_emails / item.total_leads) * 100)}% verificado
              </div>
            </div>
          </div>
        ))
      case 'country':
        return displayData.map((item, index) => (
          <div key={`country-${item.country || index}`} className={`${styles.statItem} flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-ritter-gold/30 transition-all`}>
            <div className={styles.statLeft}>
              <h4 className={`${styles.statTitle} font-semibold text-gray-900`}>
                {item.country}
              </h4>
              <div className={`${styles.statMetrics} flex gap-4 mt-2 text-sm`}>
                <span className={`${styles.statMetric} text-blue-600`}>
                  {item.total_leads} leads
                </span>
                <span className={`${styles.statMetric} text-green-600`}>
                  {item.high_quality_percentage}% alta calidad
                </span>
                <span className={`${styles.statMetric} text-purple-600`}>
                  {item.verified_emails} emails
                </span>
              </div>
              {item.top_categories && (
                <div className="text-xs text-gray-500 mt-1">
                  <strong>Categorías principales:</strong> {item.top_categories}
                </div>
              )}
            </div>
            <div className={styles.statRight}>
              <div className={`${styles.qualityScore} flex items-center gap-2`}>
                <Award className="h-4 w-4 text-ritter-gold" />
                <span className="font-semibold text-gray-900">
                  {item.avg_quality_score}
                </span>
              </div>
              <div className={`${styles.verificationRate} text-xs text-gray-500 mt-1`}>
                {item.email_verification_rate}% emails verif.
              </div>
            </div>
          </div>
        ))
      case 'state':
        return displayData.map((item, index) => (
          <div key={`state-${item.country}-${item.state || index}`} className={`${styles.statItem} flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-ritter-gold/30 transition-all`}>
            <div className={styles.statLeft}>
              <h4 className={`${styles.statTitle} font-semibold text-gray-900`}>
                {item.state}, {item.country}
              </h4>
              <div className={`${styles.statMetrics} flex gap-4 mt-2 text-sm`}>
                <span className={`${styles.statMetric} text-blue-600`}>
                  {item.total_leads} leads
                </span>
                <span className={`${styles.statMetric} text-green-600`}>
                  {item.contactable_percentage}% contactable
                </span>
                <span className={`${styles.statMetric} text-purple-600`}>
                  {item.leads_last_30_days} este mes
                </span>
              </div>
              {item.top_activities && (
                <div className="text-xs text-gray-500 mt-1">
                  <strong>Actividades principales:</strong> {item.top_activities}
                </div>
              )}
            </div>
            <div className={styles.statRight}>
              <div className={`${styles.qualityScore} flex items-center gap-2`}>
                <Award className="h-4 w-4 text-ritter-gold" />
                <span className="font-semibold text-gray-900">
                  {item.avg_quality_score}
                </span>
              </div>
              <div className={`${styles.verificationRate} text-xs text-gray-500 mt-1`}>
                {item.high_quality_percentage}% alta calidad
              </div>
            </div>
          </div>
        ))
      case 'spain-region':
        return displayData.map((item, index) => (
          <div key={`spain-region-${item.comunidad_autonoma || index}`} className={`${styles.statItem} flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-ritter-gold/30 transition-all`}>
            <div className={styles.statLeft}>
              <h4 className={`${styles.statTitle} font-semibold text-gray-900`}>
                {item.comunidad_autonoma}
              </h4>
              <div className={`${styles.statMetrics} flex gap-4 mt-2 text-sm`}>
                <span className={`${styles.statMetric} text-blue-600`}>
                  {item.total_leads} leads
                </span>
                <span className={`${styles.statMetric} text-green-600`}>
                  {item.contactabilidad_porcentaje}% contactable
                </span>
                <span className={`${styles.statMetric} text-purple-600`}>
                  {item.categoria_principal}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <strong>Leads alta calidad:</strong> {item.leads_alta_calidad} | <strong>Website:</strong> {item.con_website}
              </div>
            </div>
            <div className={styles.statRight}>
              <div className={`${styles.qualityScore} flex items-center gap-2`}>
                <Award className="h-4 w-4 text-ritter-gold" />
                <span className="font-semibold text-gray-900">
                  {item.calidad_promedio}
                </span>
              </div>
              <div className={`${styles.verificationRate} text-xs text-gray-500 mt-1`}>
                {item.leads_alta_calidad} alta calidad
              </div>
            </div>
          </div>
        ))
      default:
        return displayData.map((item, index) => (
          <div key={`default-${item.category || index}`} className={`${styles.statItem} flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-ritter-gold/30 transition-all`}>
            <div className={styles.statLeft}>
              <h4 className={`${styles.statTitle} font-semibold text-gray-900`}>
                {item.category}
              </h4>
              <div className={`${styles.statMetrics} flex gap-4 mt-2 text-sm`}>
                <span className={`${styles.statMetric} text-blue-600`}>
                  {item.total_leads} leads
                </span>
                <span className={`${styles.statMetric} text-green-600`}>
                  {item.verified_emails} emails
                </span>
                <span className={`${styles.statMetric} text-purple-600`}>
                  {item.verified_phones} teléfonos
                </span>
              </div>
            </div>
            <div className={styles.statRight}>
              <div className={`${styles.qualityScore} flex items-center gap-2`}>
                <Award className="h-4 w-4 text-ritter-gold" />
                <span className="font-semibold text-gray-900">
                  {item.avg_quality_score}
                </span>
              </div>
              <div className={`${styles.verificationRate} text-xs text-gray-500 mt-1`}>
                {Math.round((item.verified_emails / item.total_leads) * 100)}% verificado
              </div>
            </div>
          </div>
        ))
    }
  }

  if (isLoading) {
    return (
      <Card className={`${styles.leadStats} border-0 shadow-sm`}>
        {showHeader && (
          <CardHeader className={styles.statsHeader}>
            <div className={styles.headerContent}>
              {getViewIcon()}
              <CardTitle className={styles.statsTitle}>
                {getViewTitle()}
              </CardTitle>
            </div>
            <CardDescription className={styles.statsDescription}>
              {getViewDescription()}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={styles.statsContent}>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-48" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${styles.leadStats} border-0 shadow-sm`}>
        <CardContent className={`${styles.statsContent} p-6`}>
          <div className={styles.errorState}>
            <TrendingUp className={styles.errorIcon} />
            <p className={`${styles.errorText} text-red-500 text-center`}>
              Error al cargar estadísticas: {error}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${styles.leadStats} border-0 shadow-sm hover:shadow-md transition-shadow`}>
      {showHeader && (
        <CardHeader className={styles.statsHeader}>
          <div className={styles.headerContent}>
            {getViewIcon()}
            <CardTitle className={styles.statsTitle}>
              {getViewTitle()}
            </CardTitle>
          </div>
          <CardDescription className={styles.statsDescription}>
            {getViewDescription()}
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className={styles.statsContent}>
        <div className="space-y-4">
          {data.length > 0 ? (
            renderStats()
          ) : (
            <div className={styles.emptyState}>
              <Users className={styles.emptyIcon} />
              <p className={`${styles.emptyText} text-muted-foreground text-center`}>
                No hay datos disponibles para esta vista
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 