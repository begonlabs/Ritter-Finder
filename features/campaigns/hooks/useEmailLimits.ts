 "use client"

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

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
  refreshLimits: () => Promise<void>
}

const HOURLY_LIMIT = 25
const DAILY_LIMIT = 100
const WARNING_THRESHOLD = 0.8 // 80% of limit

// Get email limits from Supabase database
const getEmailLimitsFromDB = async (): Promise<{ hourlyCount: number; dailyCount: number; lastHourlyReset: Date; lastDailyReset: Date; hourlyLimit: number; dailyLimit: number }> => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('email_limits')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching email limits:', error)
      // Return default values if database is not available
      const now = new Date()
      return {
        hourlyCount: 0,
        dailyCount: 0,
        lastHourlyReset: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()),
        lastDailyReset: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        hourlyLimit: HOURLY_LIMIT,
        dailyLimit: DAILY_LIMIT
      }
    }

    return {
      hourlyCount: data.hourly_count || 0,
      dailyCount: data.daily_count || 0,
      lastHourlyReset: new Date(data.last_hourly_reset),
      lastDailyReset: new Date(data.last_daily_reset),
      hourlyLimit: data.hourly_limit || HOURLY_LIMIT,
      dailyLimit: data.daily_limit || DAILY_LIMIT
    }
  } catch (error) {
    console.error('Error in getEmailLimitsFromDB:', error)
    // Fallback to default values
    const now = new Date()
    return {
      hourlyCount: 0,
      dailyCount: 0,
      lastHourlyReset: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()),
      lastDailyReset: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      hourlyLimit: HOURLY_LIMIT,
      dailyLimit: DAILY_LIMIT
    }
  }
}

// Update email limits in Supabase database
const updateEmailLimitsInDB = async (hourlyCount: number, dailyCount: number, lastHourlyReset: Date, lastDailyReset: Date): Promise<boolean> => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('email_limits')
      .update({
        hourly_count: hourlyCount,
        daily_count: dailyCount,
        last_hourly_reset: lastHourlyReset.toISOString(),
        last_daily_reset: lastDailyReset.toISOString()
      })
      .eq('id', 1) // Assuming there's only one record with id=1

    if (error) {
      console.error('Error updating email limits:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateEmailLimitsInDB:', error)
    return false
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
  const [limits, setLimits] = useState<EmailLimitsData>({
    hourlyCount: 0,
    dailyCount: 0,
    hourlyLimit: HOURLY_LIMIT,
    dailyLimit: DAILY_LIMIT,
    hourlyRemaining: HOURLY_LIMIT,
    dailyRemaining: DAILY_LIMIT,
    nextHourlyReset: new Date(),
    nextDailyReset: new Date()
  })

  // Load initial data from database
  useEffect(() => {
    const loadLimits = async () => {
      try {
        const data = await getEmailLimitsFromDB()
        const now = new Date()
        
        // Check if we need to reset counters
        let { hourlyCount, dailyCount, lastHourlyReset, lastDailyReset, hourlyLimit, dailyLimit } = data
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
        
        // Update database if reset was needed
        if (shouldUpdate) {
          await updateEmailLimitsInDB(hourlyCount, dailyCount, lastHourlyReset, lastDailyReset)
        }
        
        setLimits({
          hourlyCount,
          dailyCount,
          hourlyLimit,
          dailyLimit,
          hourlyRemaining: Math.max(0, hourlyLimit - hourlyCount),
          dailyRemaining: Math.max(0, dailyLimit - dailyCount),
          nextHourlyReset: calculateNextReset(lastHourlyReset, 'hourly'),
          nextDailyReset: calculateNextReset(lastDailyReset, 'daily')
        })
      } catch (error) {
        console.error('Error loading email limits:', error)
      }
    }
    
    loadLimits()
  }, [])

  // Auto-refresh every minute to check for resets
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getEmailLimitsFromDB()
        const now = new Date()
        let { hourlyCount, dailyCount, lastHourlyReset, lastDailyReset, hourlyLimit, dailyLimit } = data
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
          await updateEmailLimitsInDB(hourlyCount, dailyCount, lastHourlyReset, lastDailyReset)
        }
        
        setLimits({
          hourlyCount,
          dailyCount,
          hourlyLimit,
          dailyLimit,
          hourlyRemaining: Math.max(0, hourlyLimit - hourlyCount),
          dailyRemaining: Math.max(0, dailyLimit - dailyCount),
          nextHourlyReset: calculateNextReset(lastHourlyReset, 'hourly'),
          nextDailyReset: calculateNextReset(lastDailyReset, 'daily')
        })
      } catch (error) {
        console.error('Error refreshing email limits:', error)
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const refreshLimits = useCallback(async () => {
    try {
      const data = await getEmailLimitsFromDB()
      setLimits(prev => ({
        ...prev,
        hourlyCount: data.hourlyCount,
        dailyCount: data.dailyCount,
        hourlyRemaining: Math.max(0, data.hourlyLimit - data.hourlyCount),
        dailyRemaining: Math.max(0, data.dailyLimit - data.dailyCount)
      }))
    } catch (error) {
      console.error('Error refreshing limits:', error)
    }
  }, [])

  // Calculate warning states
  const isNearHourlyLimit = limits.hourlyCount >= (limits.hourlyLimit * WARNING_THRESHOLD)
  const isNearDailyLimit = limits.dailyCount >= (limits.dailyLimit * WARNING_THRESHOLD)
  const isHourlyLimitReached = limits.hourlyCount >= limits.hourlyLimit
  const isDailyLimitReached = limits.dailyCount >= limits.dailyLimit

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
export const incrementEmailCount = async (count: number = 1): Promise<{
  hourlyCount: number
  dailyCount: number
  hourlyRemaining: number
  dailyRemaining: number
}> => {
  try {
    const data = await getEmailLimitsFromDB()
    const now = new Date()
    let { hourlyCount, dailyCount, lastHourlyReset, lastDailyReset, hourlyLimit, dailyLimit } = data
    
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
    hourlyCount += count
    dailyCount += count
    
    // Save updated counts to database
    await updateEmailLimitsInDB(hourlyCount, dailyCount, lastHourlyReset, lastDailyReset)
    
    return {
      hourlyCount,
      dailyCount,
      hourlyRemaining: Math.max(0, hourlyLimit - hourlyCount),
      dailyRemaining: Math.max(0, dailyLimit - dailyCount)
    }
  } catch (error) {
    console.error('Error incrementing email count:', error)
    // Return fallback values
    return {
      hourlyCount: 0,
      dailyCount: 0,
      hourlyRemaining: HOURLY_LIMIT,
      dailyRemaining: DAILY_LIMIT
    }
  }
}