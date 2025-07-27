"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage, formatMessage } from "@/lib/language-context"
import { useResponsive } from "@/features/layout/hooks/useResponsive"
import { cn } from "@/lib/utils"
import styles from "../styles/ScrapingSimulation.module.css"

interface ScrapingSimulationProps {
  // No props needed now
}

export function ScrapingSimulation({}: ScrapingSimulationProps = {}) {
  const { t } = useLanguage()
  const { isSmallScreen, isMediumScreen, isLargeScreen, utils } = useResponsive()
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const messages = [
      t("search.step.1"),
      t("search.step.2"),
      t("search.step.3"),
      t("search.step.4"),
      t("search.step.5"),
      t("search.step.6"),
      t("search.step.7"),
      t("search.step.8"),
    ]

    let currentMessageIndex = 0

    const interval = setInterval(() => {
      // Update progress
      setProgress((prev) => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          clearInterval(interval)
        }
        return newProgress > 100 ? 100 : newProgress
      })

      // Update message every ~15% progress
      if (progress % 15 === 0 && currentMessageIndex < messages.length) {
        setMessage(messages[currentMessageIndex])
        currentMessageIndex++
      }
    }, 100)

    return () => clearInterval(interval)
  }, [progress, t])

  return (
    <Card className={cn(
      styles.scrapingSimulation,
      isSmallScreen && styles.scrapingSimulationMobile,
      isMediumScreen && styles.scrapingSimulationTablet,
      isLargeScreen && styles.scrapingSimulationDesktop
    )}>
      <CardContent className={cn(
        styles.content,
        isSmallScreen && styles.contentMobile
      )}>
        <div className={cn(
          styles.header,
          isSmallScreen && styles.headerMobile
        )}>
          <h3 className={cn(
            styles.title,
            isSmallScreen && styles.titleMobile
          )}>
            {t("search.progress")}
          </h3>
          <span className={cn(
            styles.progressPercentage,
            isSmallScreen && styles.progressPercentageMobile
          )}>
            {progress}%
          </span>
        </div>

        <div className={cn(
          styles.progressContainer,
          isSmallScreen && styles.progressContainerMobile
        )}>
          <Progress 
            value={progress} 
            className={cn(
              styles.progressBar,
              isSmallScreen && styles.progressBarMobile
            )} 
          />
        </div>

        <div className={cn(
          styles.messagesContainer,
          isSmallScreen && styles.messagesContainerMobile
        )}>
          {message && (
            <p className={cn(
              styles.stepMessage,
              isSmallScreen && styles.stepMessageMobile
            )}>
              {message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
