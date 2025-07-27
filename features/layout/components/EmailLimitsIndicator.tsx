"use client"

import { Mail, Clock, Calendar, AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useEmailLimits } from "@/features/campaigns/hooks/useEmailLimits"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import styles from "../styles/EmailLimitsIndicator.module.css"

interface EmailLimitsIndicatorProps {
  className?: string
  compact?: boolean
}

export function EmailLimitsIndicator({ className = "", compact = false }: EmailLimitsIndicatorProps) {
  const { 
    limits, 
    isNearHourlyLimit, 
    isNearDailyLimit, 
    isHourlyLimitReached, 
    isDailyLimitReached,
    isConnected
  } = useEmailLimits()

  const getHourlyStatus = () => {
    if (isHourlyLimitReached) return 'blocked'
    if (isNearHourlyLimit) return 'warning'
    return 'normal'
  }

  const getDailyStatus = () => {
    if (isDailyLimitReached) return 'blocked'
    if (isNearDailyLimit) return 'warning'
    return 'normal'
  }

  const hourlyStatus = getHourlyStatus()
  const dailyStatus = getDailyStatus()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'blocked': return <AlertTriangle className="h-3 w-3" />
      case 'warning': return <AlertTriangle className="h-3 w-3" />
      default: return <Mail className="h-3 w-3" />
    }
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`${styles.limitsIndicator} ${styles.compact} ${className}`}>
              <div className={`${styles.limitItem} ${styles[hourlyStatus]}`}>
                <span className={styles.limitCount}>{limits.hourlyCount}</span>
                <span className={styles.limitSeparator}>/</span>
                <span className={styles.limitMax}>{limits.hourlyLimit}</span>
              </div>
              <div className={`${styles.limitItem} ${styles[dailyStatus]}`}>
                <span className={styles.limitCount}>{limits.dailyCount}</span>
                <span className={styles.limitSeparator}>/</span>
                <span className={styles.limitMax}>{limits.dailyLimit}</span>
              </div>
              <div className={styles.connectionIndicator}>
                {isConnected ? (
                  <Wifi className={`${styles.connectionIcon} ${styles.connected}`} size={12} />
                ) : (
                  <WifiOff className={`${styles.connectionIcon} ${styles.disconnected}`} size={12} />
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" className={styles.tooltip}>
            <div className={styles.tooltipContent}>
              <div className={styles.tooltipSection}>
                <div className={styles.tooltipHeader}>
                  <Clock className="h-4 w-4" />
                  <span className={styles.tooltipTitle}>Límite por Hora</span>
                </div>
                <div className={styles.tooltipStats}>
                  <span className={styles.tooltipCount}>
                    {limits.hourlyCount} / {limits.hourlyLimit} emails
                  </span>
                  <span className={styles.tooltipRemaining}>
                    {limits.hourlyRemaining} restantes
                  </span>
                </div>
                <div className={styles.tooltipReset}>
                  Reinicia en: {formatDistanceToNow(limits.nextHourlyReset, { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </div>
              </div>
              
              <div className={styles.tooltipDivider} />
              
              <div className={styles.tooltipSection}>
                <div className={styles.tooltipHeader}>
                  <Calendar className="h-4 w-4" />
                  <span className={styles.tooltipTitle}>Límite Diario</span>
                </div>
                <div className={styles.tooltipStats}>
                  <span className={styles.tooltipCount}>
                    {limits.dailyCount} / {limits.dailyLimit} emails
                  </span>
                  <span className={styles.tooltipRemaining}>
                    {limits.dailyRemaining} restantes
                  </span>
                </div>
                <div className={styles.tooltipReset}>
                  Reinicia en: {formatDistanceToNow(limits.nextDailyReset, { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </div>
              </div>
              
              <div className={styles.tooltipDivider} />
              
              <div className={styles.tooltipSection}>
                <div className={styles.tooltipHeader}>
                  {isConnected ? (
                    <Wifi className="h-4 w-4" />
                  ) : (
                    <WifiOff className="h-4 w-4" />
                  )}
                  <span className={styles.tooltipTitle}>
                    {isConnected ? 'Conectado en Tiempo Real' : 'Reconectando...'}
                  </span>
                </div>
                <div className={styles.tooltipStats}>
                  <span className={`${styles.tooltipCount} ${isConnected ? styles.connected : styles.disconnected}`}>
                    {isConnected ? '🟢 Datos actualizados en vivo' : '🟡 Usando datos en caché'}
                  </span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={`${styles.limitsIndicator} ${styles.normal} ${className}`}>
      <div className={styles.limitsHeader}>
        <Mail className={styles.headerIcon} />
        <span className={styles.headerTitle}>Límites de Email</span>
      </div>
      
      <div className={styles.limitsGrid}>
        <div className={`${styles.limitCard} ${styles[hourlyStatus]}`}>
          <div className={styles.limitCardHeader}>
            <Clock className={styles.limitIcon} />
            <span className={styles.limitLabel}>Por Hora</span>
            {hourlyStatus !== 'normal' && getStatusIcon(hourlyStatus)}
          </div>
          <div className={styles.limitCardCount}>
            <span className={styles.limitCurrent}>{limits.hourlyCount}</span>
            <span className={styles.limitSeparator}>/</span>
            <span className={styles.limitTotal}>{limits.hourlyLimit}</span>
          </div>
          <div className={styles.limitCardProgress}>
            <div 
              className={styles.limitProgressBar}
              style={{ 
                width: `${(limits.hourlyCount / limits.hourlyLimit) * 100}%` 
              }}
            />
          </div>
          <div className={styles.limitCardFooter}>
            <span className={styles.limitRemaining}>
              {limits.hourlyRemaining} restantes
            </span>
          </div>
        </div>

        <div className={`${styles.limitCard} ${styles[dailyStatus]}`}>
          <div className={styles.limitCardHeader}>
            <Calendar className={styles.limitIcon} />
            <span className={styles.limitLabel}>Diario</span>
            {dailyStatus !== 'normal' && getStatusIcon(dailyStatus)}
          </div>
          <div className={styles.limitCardCount}>
            <span className={styles.limitCurrent}>{limits.dailyCount}</span>
            <span className={styles.limitSeparator}>/</span>
            <span className={styles.limitTotal}>{limits.dailyLimit}</span>
          </div>
          <div className={styles.limitCardProgress}>
            <div 
              className={styles.limitProgressBar}
              style={{ 
                width: `${(limits.dailyCount / limits.dailyLimit) * 100}%` 
              }}
            />
          </div>
          <div className={styles.limitCardFooter}>
            <span className={styles.limitRemaining}>
              {limits.dailyRemaining} restantes
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 