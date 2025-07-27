 "use client"

import { useState, useEffect, useCallback } from 'react'

interface EmailLimitsData {
  hourlyCount: number
  dailyCount: number
  hourlyLimit: number
  dailyLimit: number
  hourlyRemaining: number
  dailyRemaining: number
  nextHourlyReset: Date
  nextDailyReset: Date
}

interface UseEmailLimitsReturn {
  limits: EmailLimitsData
  isNearHourlyLimit: boolean
  isNearDailyLimit: boolean
  isHourlyLimitReached: boolean
  isDailyLimitReached: boolean
  refreshLimits: () => void
}

const HOURLY_LIMIT = 25
const DAILY_LIMIT = 100
const WARNING_THRESHOLD = 0.8 // 80% of limit

// Simulate getting data from localStorage or API
const getStoredEmailCounts = (): { hourlyCount: number; dailyCount: number; lastHourlyReset: Date; lastDailyReset: Date } => {
  try {
    const stored = localStorage.getItem('ritterfinder-email-limits')
    if (stored) {
      const data = JSON.parse(stored)
      return {
        hourlyCount: data.hourlyCount || 0,
        dailyCount: data.dailyCount || 0,
        lastHourlyReset: new Date(data.lastHourlyReset || Date.now()),
        lastDailyReset: new Date(data.lastDailyReset || Date.now())
      }
    }
  } catch (error) {
    console.warn('Error reading email limits from storage:', error)
  }
  
  // Default values
  const now = new Date()
  return {
    hourlyCount: 0,
    dailyCount: 0,
    lastHourlyReset: now,
    lastDailyReset: new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
}

const saveEmailCounts = (hourlyCount: number, dailyCount: number, lastHourlyReset: Date, lastDailyReset: Date) => {
  try {
    const data = {
      hourlyCount,
      dailyCount,
      lastHourlyReset: lastHourlyReset.toISOString(),
      lastDailyReset: lastDailyReset.toISOString(),
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('ritterfinder-email-limits', JSON.stringify(data))
  } catch (error) {
    console.warn('Error saving email limits to storage:', error)
  }
}

const calculateNextReset = (lastReset: Date, type: 'hourly' | 'daily'): Date => {
  const next = new Date(lastReset)
  
  if (type === 'hourly') {
    next.setHours(next.getHours() + 1, 0, 0, 0)
  } else {
    next.setDate(next.getDate() + 1)
    next.setHours(0, 0, 0, 0)
  }
  
  return next
}

const shouldResetCounts = (lastReset: Date, type: 'hourly' | 'daily'): boolean => {
  const now = new Date()
  const nextReset = calculateNextReset(lastReset, type)
  return now >= nextReset
}

export const useEmailLimits = (): UseEmailLimitsReturn => {
  const [limits, setLimits] = useState<EmailLimitsData>(() => {
    const stored = getStoredEmailCounts()
    const now = new Date()
    
    // Check if we need to reset counters
    let { hourlyCount, dailyCount, lastHourlyReset, lastDailyReset } = stored
    
    if (shouldResetCounts(lastHourlyReset, 'hourly')) {
      hourlyCount = 0
      lastHourlyReset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
    }
    
    if (shouldResetCounts(lastDailyReset, 'daily')) {
      dailyCount = 0
      lastDailyReset = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }
    
    // Save reset counts if any were reset
    if (hourlyCount !== stored.hourlyCount || dailyCount !== stored.dailyCount) {
      saveEmailCounts(hourlyCount, dailyCount, lastHourlyReset, lastDailyReset)
    }
    
    return {
      hourlyCount,
      dailyCount,
      hourlyLimit: HOURLY_LIMIT,
      dailyLimit: DAILY_LIMIT,
      hourlyRemaining: Math.max(0, HOURLY_LIMIT - hourlyCount),
      dailyRemaining: Math.max(0, DAILY_LIMIT - dailyCount),
      nextHourlyReset: calculateNextReset(lastHourlyReset, 'hourly'),
      nextDailyReset: calculateNextReset(lastDailyReset, 'daily')
    }
  })

  // Auto-refresh every minute to check for resets
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = getStoredEmailCounts()
      const now = new Date()
      let { hourlyCount, dailyCount, lastHourlyReset, lastDailyReset } = stored
      let shouldUpdate = false
      
      if (shouldResetCounts(lastHourlyReset, 'hourly')) {
        hourlyCount = 0
        lastHourlyReset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
        shouldUpdate = true
      }
      
      if (shouldResetCounts(lastDailyReset, 'daily')) {
        dailyCount = 0
        lastDailyReset = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        shouldUpdate = true
      }
      
      if (shouldUpdate) {
        saveEmailCounts(hourlyCount, dailyCount, lastHourlyReset, lastDailyReset)
        setLimits(prev => ({
          ...prev,
          hourlyCount,
          dailyCount,
          hourlyRemaining: Math.max(0, HOURLY_LIMIT - hourlyCount),
          dailyRemaining: Math.max(0, DAILY_LIMIT - dailyCount),
          nextHourlyReset: calculateNextReset(lastHourlyReset, 'hourly'),
          nextDailyReset: calculateNextReset(lastDailyReset, 'daily')
        }))
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const refreshLimits = useCallback(() => {
    const stored = getStoredEmailCounts()
    setLimits(prev => ({
      ...prev,
      hourlyCount: stored.hourlyCount,
      dailyCount: stored.dailyCount,
      hourlyRemaining: Math.max(0, HOURLY_LIMIT - stored.hourlyCount),
      dailyRemaining: Math.max(0, DAILY_LIMIT - stored.dailyCount)
    }))
  }, [])

  // Calculate warning states
  const isNearHourlyLimit = limits.hourlyCount >= (HOURLY_LIMIT * WARNING_THRESHOLD)
  const isNearDailyLimit = limits.dailyCount >= (DAILY_LIMIT * WARNING_THRESHOLD)
  const isHourlyLimitReached = limits.hourlyCount >= HOURLY_LIMIT
  const isDailyLimitReached = limits.dailyCount >= DAILY_LIMIT

  return {
    limits,
    isNearHourlyLimit,
    isNearDailyLimit,
    isHourlyLimitReached,
    isDailyLimitReached,
    refreshLimits
  }
}

// Utility function to increment email count (to be called when emails are sent)
export const incrementEmailCount = () => {
  const stored = getStoredEmailCounts()
  const now = new Date()
  let { hourlyCount, dailyCount, lastHourlyReset, lastDailyReset } = stored
  
  // Check if we need to reset before incrementing
  if (shouldResetCounts(lastHourlyReset, 'hourly')) {
    hourlyCount = 0
    lastHourlyReset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
  }
  
  if (shouldResetCounts(lastDailyReset, 'daily')) {
    dailyCount = 0
    lastDailyReset = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  
  // Increment counts
  hourlyCount += 1
  dailyCount += 1
  
  // Save updated counts
  saveEmailCounts(hourlyCount, dailyCount, lastHourlyReset, lastDailyReset)
  
  return {
    hourlyCount,
    dailyCount,
    hourlyRemaining: Math.max(0, HOURLY_LIMIT - hourlyCount),
    dailyRemaining: Math.max(0, DAILY_LIMIT - dailyCount)
  }
}