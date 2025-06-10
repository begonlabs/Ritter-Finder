"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage, formatMessage } from "@/lib/language-context"

interface ScrapingSimulationProps {
  websites: string[]
}

export function ScrapingSimulation({ websites }: ScrapingSimulationProps) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [currentWebsite, setCurrentWebsite] = useState("")
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
    let currentWebsiteIndex = 0

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

      // Cycle through websites
      if (progress % 25 === 0 && websites.length > 0) {
        setCurrentWebsite(websites[currentWebsiteIndex % websites.length])
        currentWebsiteIndex++
      }
    }, 100)

    return () => clearInterval(interval)
  }, [websites, progress, t])

  return (
    <Card className="mt-6 border-0 shadow-sm bg-white">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-ritter-dark">{t("search.progress")}</h3>
            <span className="text-sm font-medium text-ritter-gold">{progress}%</span>
          </div>

          <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-ritter-gold" />

          <div className="space-y-2">
            {currentWebsite && (
              <p className="text-sm text-gray-700">
                {formatMessage(t("search.analyzing"), { website: currentWebsite })}
              </p>
            )}

            {message && <p className="text-sm text-gray-700">{message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
