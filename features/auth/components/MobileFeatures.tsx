"use client"

import type { FeatureItem } from "../types"
import styles from "../styles/MobileFeatures.module.css"

const mobileFeatures: FeatureItem[] = [
  {
    id: "search-mobile",
    icon: "🔍",
    text: "Buscar leads"
  },
  {
    id: "email-mobile", 
    icon: "📧",
    text: "Email marketing"
  },
  {
    id: "scraping-mobile",
    icon: "⚡",
    text: "Scraping automático"
  },
  {
    id: "analytics-mobile",
    icon: "📊", 
    text: "Ver analytics"
  }
]

export function MobileFeatures({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.mobileFeatures} md:hidden bg-ritter-dark text-white p-6 ${className}`}>
      <div className={`${styles.content} max-w-md mx-auto`}>
        <h3 className={`${styles.title} text-lg font-bold text-ritter-gold mb-3 text-center`}>
          ¿Qué puedes hacer?
        </h3>
        <div className={`${styles.featuresGrid} grid grid-cols-2 gap-3 text-sm`}>
          {mobileFeatures.map((feature) => (
            <div key={feature.id} className={`${styles.featureItem} flex items-center gap-2`}>
              <div className={`${styles.featureIcon} w-6 h-6 bg-ritter-gold rounded-full flex items-center justify-center`}>
                <span className="text-ritter-dark text-xs font-bold">{feature.icon}</span>
              </div>
              <span className={styles.featureText}>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 