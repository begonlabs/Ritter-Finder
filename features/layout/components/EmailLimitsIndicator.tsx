"use client"

import { Mail, Clock, Calendar, AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useEmailLimits } from "@/features/campaigns/hooks/useEmailLimits"
import { useResponsive } from "../hooks/useResponsive"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
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
  
  const { 
    isSmallScreen, 
    isMediumScreen, 
    isLargeScreen,
    utils 
  } = useResponsive()

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

  // Determine responsive properties
  const iconSize = isSmallScreen ? 10 : isMediumScreen ? 12 : 14
  const shouldShowLabels = !isSmallScreen
  const tooltipSide = isSmallScreen ? "bottom" : "bottom"
  
  const getStatusIcon = (status: string) => {
    const iconClass = `h-${iconSize < 12 ? '3' : '4'} w-${iconSize < 12 ? '3' : '4'}`
    switch (status) {
      case 'blocked': return <AlertTriangle className={iconClass} />
      case 'warning': return <AlertTriangle className={iconClass} />
      default: return <Mail className={iconClass} />
    }
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              styles.limitsIndicator, 
              styles.compact, 
              className,
              isSmallScreen && styles.compactMobile,
              isMediumScreen && styles.compactTablet,
              isLargeScreen && styles.compactDesktop
            )}>
              <div className={cn(
                styles.limitItem, 
                styles[hourlyStatus],
                isSmallScreen && styles.limitItemMobile
              )}>
                <span className={cn(styles.limitCount, utils.getTextSize('sm'))}>{limits.hourlyCount}</span>
                <span className={styles.limitSeparator}>/</span>
                <span className={cn(styles.limitMax, utils.getTextSize('sm'))}>{limits.hourlyLimit}</span>
              </div>
              <div className={cn(
                styles.limitItem, 
                styles[dailyStatus],
                isSmallScreen && styles.limitItemMobile
              )}>
                <span className={cn(styles.limitCount, utils.getTextSize('sm'))}>{limits.dailyCount}</span>
                <span className={styles.limitSeparator}>/</span>
                <span className={cn(styles.limitMax, utils.getTextSize('sm'))}>{limits.dailyLimit}</span>
              </div>
              <div className={cn(
                styles.connectionIndicator,
                isSmallScreen && styles.connectionIndicatorMobile
              )}>
                {isConnected ? (
                  <Wifi className={cn(styles.connectionIcon, styles.connected)} size={iconSize} />
                ) : (
                  <WifiOff className={cn(styles.connectionIcon, styles.disconnected)} size={iconSize} />
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} align={isSmallScreen ? "center" : "end"} className={cn(
            styles.tooltip,
            isSmallScreen && styles.tooltipMobile,
            isMediumScreen && styles.tooltipTablet
          )}>
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