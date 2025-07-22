"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { QueueProgress, QueueStatus } from "../types"
import styles from "../styles/EmailQueueProgress.module.css"

interface EmailQueueProgressProps {
  progress: QueueProgress
  status: QueueStatus
  onStart?: () => void
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  className?: string
}

export function EmailQueueProgress({
  progress,
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  className
}: EmailQueueProgressProps) {
  const percentage = progress.total > 0 ? (progress.sent / progress.total) * 100 : 0
  const remainingEmails = progress.total - progress.sent - progress.failed
  
  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'completed': return 'text-blue-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'idle': return 'En espera'
      case 'starting': return 'Iniciando...'
      case 'running': return 'Enviando emails...'
      case 'paused': return 'Pausado'
      case 'resuming': return 'Reanudando...'
      case 'completed': return 'Completado'
      case 'error': return 'Error'
      default: return 'Desconocido'
    }
  }

  const formatEstimatedTime = () => {
    if (progress.estimatedCompletion) {
      return format(progress.estimatedCompletion, "dd 'de' MMMM 'a las' HH:mm", { locale: es })
    }
    return 'Calculando...'
  }

  return (
    <Card className={`${styles.emailQueueProgress} ${className || ''}`}>
      <CardHeader className={styles.header}>
        <div className={styles.headerContent}>
          <CardTitle className={styles.title}>
            <Mail className={styles.titleIcon} />
            Progreso de la Campaña
          </CardTitle>
          <div className={styles.statusContainer}>
            <Badge 
              variant={status === 'completed' ? 'default' : 'secondary'}
              className={`${styles.statusBadge} ${getStatusColor()}`}
            >
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className={styles.content}>
        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progreso General</span>
            <span className={styles.progressPercentage}>{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} className={styles.progressBar} />
          <div className={styles.progressStats}>
            <span className={styles.progressText}>
              {progress.sent} de {progress.total} emails enviados
            </span>
            {progress.failed > 0 && (
              <span className={styles.failedText}>
                {progress.failed} fallidos
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Mail className="h-5 w-5" />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{progress.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconSuccess}`}>
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{progress.sent}</span>
              <span className={styles.statLabel}>Enviados</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconPending}`}>
              <Clock className="h-5 w-5" />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{remainingEmails}</span>
              <span className={styles.statLabel}>Pendientes</span>
            </div>
          </div>

          {progress.failed > 0 && (
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.statIconFailed}`}>
                <XCircle className="h-5 w-5" />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{progress.failed}</span>
                <span className={styles.statLabel}>Fallidos</span>
              </div>
            </div>
          )}
        </div>

        {/* Estimated Completion */}
        {progress.estimatedCompletion && (
          <div className={styles.estimatedSection}>
            <div className={styles.estimatedHeader}>
              <Clock className={styles.estimatedIcon} />
              <span className={styles.estimatedLabel}>Tiempo Estimado</span>
            </div>
            <div className={styles.estimatedTime}>
              {formatEstimatedTime()}
            </div>
          </div>
        )}

        {/* Rate Limits Info */}
        <div className={styles.limitsSection}>
          <div className={styles.limitsHeader}>
            <AlertCircle className={styles.limitsIcon} />
            <span className={styles.limitsLabel}>Límites de Envío</span>
          </div>
          <div className={styles.limitsGrid}>
            <div className={styles.limitItem}>
              <span className={styles.limitValue}>25</span>
              <span className={styles.limitLabel}>por hora</span>
            </div>
            <div className={styles.limitItem}>
              <span className={styles.limitValue}>100</span>
              <span className={styles.limitLabel}>por día</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {status === 'idle' && onStart && (
            <Button onClick={onStart} className={styles.actionButton}>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Cola
            </Button>
          )}

          {status === 'running' && onPause && (
            <Button onClick={onPause} variant="outline" className={styles.actionButton}>
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
          )}

          {status === 'paused' && onResume && (
            <Button onClick={onResume} className={styles.actionButton}>
              <Play className="h-4 w-4 mr-2" />
              Reanudar
            </Button>
          )}

          {(status === 'running' || status === 'paused') && onStop && (
            <Button onClick={onStop} variant="destructive" className={styles.actionButton}>
              <Square className="h-4 w-4 mr-2" />
              Detener
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 