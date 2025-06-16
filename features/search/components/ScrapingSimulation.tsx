"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage, formatMessage } from "@/lib/language-context"
import styles from "../styles/ScrapingSimulation.module.css"

interface ScrapingSimulationProps {
  // No props needed now
}

export function ScrapingSimulation({}: ScrapingSimulationProps = {}) {
  const { t } = useLanguage()
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
    <Card className={styles.scrapingSimulation}>
      <CardContent className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{t("search.progress")}</h3>
          <span className={styles.progressPercentage}>{progress}%</span>
        </div>

        <div className={styles.progressContainer}>
          <Progress value={progress} className={styles.progressBar} />
        </div>

        <div className={styles.messagesContainer}>
          {message && <p className={styles.stepMessage}>{message}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
