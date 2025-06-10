"use client"

import type { WelcomeSectionProps, FeatureItem } from "../types"
import styles from "../styles/WelcomeSection.module.css"

const features: FeatureItem[] = [
  {
    id: "search",
    icon: "🔍",
    text: "Búsqueda inteligente de leads"
  },
  {
    id: "email",
    icon: "📧", 
    text: "Campañas de email automatizadas"
  },
  {
    id: "scraping",
    icon: "⚡",
    text: "Scraping en tiempo real"
  },
  {
    id: "analytics",
    icon: "📊",
    text: "Analytics y métricas detalladas"
  }
]

export function WelcomeSection({ className = "" }: WelcomeSectionProps) {
  return (
    <div className={`${styles.welcomeSection} hidden md:flex w-1/2 flex-col justify-center items-center bg-ritter-dark text-white p-12 ${className}`}>
      <div className={`${styles.content} max-w-md`}>
        <h2 className={`${styles.title} text-3xl font-bold mb-4 text-ritter-gold`}>
          Encuentra tus próximos<br />leads de energía
        </h2>
        <p className={`${styles.description} mb-6 text-lg text-gray-300`}>
          Accede a miles de contactos cualificados en el sector de energías renovables y haz crecer tu negocio.
        </p>
        <ul className={`${styles.featuresList} space-y-3 text-base`}>
          {features.map((feature) => (
            <li key={feature.id} className={`${styles.featureItem} flex items-center gap-3`}>
              <div className={`${styles.featureIcon} w-8 h-8 bg-ritter-gold rounded-full flex items-center justify-center`}>
                <span className="text-ritter-dark font-bold">{feature.icon}</span>
              </div>
              <span className={styles.featureText}>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 