"use client"

import { AnalyticsChartsPage } from "../pages/AnalyticsChartsPage"

export function ChartsExample() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ejemplo de Analytics con Gráficos Geográficos</h1>
      <p className="text-gray-600 mb-6">
        Este ejemplo muestra las capacidades completas de analytics con análisis geográfico, 
        incluyendo vistas por país, estado/región y comunidades autónomas españolas.
      </p>
      <AnalyticsChartsPage 
        showDetailedView={true}
        period="month"
      />
    </div>
  )
} 