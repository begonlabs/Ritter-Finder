"use client"

import { useState, useEffect, useCallback } from 'react'
import type { Lead, Campaign, EmailQueueItem, QueueStatus } from '../types'

interface EmailQueueConfig {
  hourlyLimit: number
  dailyLimit: number
  notificationEmail: string
}

interface QueueProgress {
  total: number
  sent: number
  failed: number
  pending: number
  currentBatch: number
  estimatedCompletion: Date
  isRunning: boolean
  isPaused: boolean
  isCompleted: boolean
}

interface UseEmailQueueReturn {
  // State
  queue: EmailQueueItem[]
  progress: QueueProgress
  status: QueueStatus
  
  // Actions
  addToQueue: (campaign: Campaign, leads: Lead[]) => Promise<void>
  startQueue: () => Promise<void>
  pauseQueue: () => void
  resumeQueue: () => Promise<void>
  clearQueue: () => void
  
  // Utils
  calculateEstimatedTime: (totalEmails: number) => { hours: number; days: number }
  getQueueStats: () => { total: number; sent: number; failed: number; pending: number }
}

const DEFAULT_CONFIG: EmailQueueConfig = {
  hourlyLimit: 25,
  dailyLimit: 100,
  notificationEmail: process.env.NEXT_PUBLIC_EMAIL_NOTIFICATIONS || 'itsjhon@gmail.com'
}

export function useEmailQueue(): UseEmailQueueReturn {
  const [queue, setQueue] = useState<EmailQueueItem[]>([])
  const [progress, setProgress] = useState<QueueProgress>({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
    currentBatch: 0,
    estimatedCompletion: new Date(),
    isRunning: false,
    isPaused: false,
    isCompleted: false
  })
  const [status, setStatus] = useState<QueueStatus>('idle')

  // Calcular tiempo estimado
  const calculateEstimatedTime = useCallback((totalEmails: number) => {
    const { hourlyLimit, dailyLimit } = DEFAULT_CONFIG
    
    const hoursPerDay = 24
    const emailsPerDay = Math.min(hourlyLimit * hoursPerDay, dailyLimit)
    const daysNeeded = Math.ceil(totalEmails / emailsPerDay)
    const hoursNeeded = Math.ceil(totalEmails / hourlyLimit)
    
    return {
      hours: hoursNeeded,
      days: daysNeeded
    }
  }, [])

  // Obtener estadísticas de la cola
  const getQueueStats = useCallback(() => {
    const total = queue.length
    const sent = queue.filter(item => item.status === 'sent').length
    const failed = queue.filter(item => item.status === 'failed').length
    const pending = queue.filter(item => item.status === 'pending').length
    
    return { total, sent, failed, pending }
  }, [queue])

  // Enviar notificación por email
  const sendNotification = useCallback(async (subject: string, message: string) => {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: DEFAULT_CONFIG.notificationEmail,
          subject,
          message
        })
      })
      
      if (!response.ok) {
        console.error('Error sending notification:', response.statusText)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }, [])

  // Procesar batch de emails
  const processBatch = useCallback(async (batch: EmailQueueItem[]) => {
    const { hourlyLimit } = DEFAULT_CONFIG
    
    for (const item of batch) {
      try {
        // Simular envío de email (aquí iría la lógica real)
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1 segundo por email
        
        // Actualizar estado del item
        setQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: 'sent', sentAt: new Date() } : q
        ))
        
        // Actualizar progreso
        setProgress(prev => ({
          ...prev,
          sent: prev.sent + 1,
          pending: prev.pending - 1
        }))
        
      } catch (error) {
        console.error('Error sending email:', error)
        
        // Marcar como fallido
        setQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: 'failed', error: String(error) } : q
        ))
        
        setProgress(prev => ({
          ...prev,
          failed: prev.failed + 1,
          pending: prev.pending - 1
        }))
      }
    }
  }, [])

  // Ejecutar cola
  const executeQueue = useCallback(async () => {
    if (progress.isPaused || progress.isCompleted) return
    
    setStatus('running')
    setProgress(prev => ({ ...prev, isRunning: true }))
    
    const { hourlyLimit, dailyLimit } = DEFAULT_CONFIG
    let emailsSentToday = 0
    let lastResetDate = new Date().toDateString()
    
    while (queue.length > 0 && !progress.isPaused) {
      const now = new Date()
      const today = now.toDateString()
      
      // Resetear contador diario si es un nuevo día
      if (today !== lastResetDate) {
        emailsSentToday = 0
        lastResetDate = today
      }
      
      // Verificar límite diario
      if (emailsSentToday >= dailyLimit) {
        // Esperar hasta el siguiente día
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        
        const waitTime = tomorrow.getTime() - now.getTime()
        await new Promise(resolve => setTimeout(resolve, waitTime))
        emailsSentToday = 0
        continue
      }
      
      // Obtener batch de emails para procesar
      const pendingEmails = queue.filter(item => item.status === 'pending')
      const batchSize = Math.min(hourlyLimit, dailyLimit - emailsSentToday, pendingEmails.length)
      const batch = pendingEmails.slice(0, batchSize)
      
      if (batch.length === 0) {
        // No hay emails pendientes
        break
      }
      
      // Procesar batch
      await processBatch(batch)
      emailsSentToday += batch.length
      
      // Notificar progreso cada 25 emails
      if (progress.sent % 25 === 0 && progress.sent > 0) {
        await sendNotification(
          'Progreso de Campaña',
          `Se han enviado ${progress.sent}/${progress.total} emails de la campaña.`
        )
      }
      
      // Esperar 1 hora antes del siguiente batch (rate limit)
      if (batchSize === hourlyLimit) {
        await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000)) // 1 hora
      }
    }
    
    // Marcar como completado
    setProgress(prev => ({ ...prev, isCompleted: true, isRunning: false }))
    setStatus('completed')
    
    // Notificar finalización
    await sendNotification(
      'Campaña Completada',
      `La campaña ha sido completada. ${progress.sent} emails enviados, ${progress.failed} fallidos.`
    )
  }, [queue, progress, sendNotification, processBatch])

  // Agregar a la cola
  const addToQueue = useCallback(async (campaign: Campaign, leads: Lead[]) => {
    const queueItems: EmailQueueItem[] = leads.map((lead, index) => ({
      id: `${campaign.id}-${lead.id}-${Date.now()}-${index}`,
      campaignId: campaign.id,
      campaignName: campaign.subject || 'Campaña sin nombre',
      leadId: lead.id,
      email: lead.email || '',
      name: lead.name || lead.company_name,
      status: 'pending',
      createdAt: new Date(),
      priority: 1
    }))
    
    setQueue(prev => [...prev, ...queueItems])
    
    const { days } = calculateEstimatedTime(leads.length)
    const estimatedCompletion = new Date()
    estimatedCompletion.setDate(estimatedCompletion.getDate() + days)
    
    setProgress(prev => ({
      ...prev,
      total: prev.total + leads.length,
      pending: prev.pending + leads.length,
      estimatedCompletion
    }))
    
    // Notificar inicio de campaña
    await sendNotification(
      'Campaña Iniciada',
      `Se ha iniciado una nueva campaña con ${leads.length} emails. Tiempo estimado: ${days} días.`
    )
  }, [calculateEstimatedTime, sendNotification])

  // Iniciar cola
  const startQueue = useCallback(async () => {
    if (progress.isRunning) return
    
    setStatus('starting')
    await executeQueue()
  }, [progress.isRunning, executeQueue])

  // Pausar cola
  const pauseQueue = useCallback(() => {
    setProgress(prev => ({ ...prev, isPaused: true, isRunning: false }))
    setStatus('paused')
  }, [])

  // Reanudar cola
  const resumeQueue = useCallback(async () => {
    setProgress(prev => ({ ...prev, isPaused: false }))
    setStatus('resuming')
    await executeQueue()
  }, [executeQueue])

  // Limpiar cola
  const clearQueue = useCallback(() => {
    setQueue([])
    setProgress({
      total: 0,
      sent: 0,
      failed: 0,
      pending: 0,
      currentBatch: 0,
      estimatedCompletion: new Date(),
      isRunning: false,
      isPaused: false,
      isCompleted: false
    })
    setStatus('idle')
  }, [])

  // Efecto para ejecutar cola automáticamente
  useEffect(() => {
    if (queue.length > 0 && !progress.isRunning && !progress.isPaused && !progress.isCompleted) {
      executeQueue()
    }
  }, [queue, progress.isRunning, progress.isPaused, progress.isCompleted, executeQueue])

  return {
    queue,
    progress,
    status,
    addToQueue,
    startQueue,
    pauseQueue,
    resumeQueue,
    clearQueue,
    calculateEstimatedTime,
    getQueueStats
  }
} 