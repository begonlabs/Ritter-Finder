"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart as PieChartIcon, TrendingUp, MapPin, Globe, Building2, Flag } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { 
  LeadCategoryStats, 
  LeadCountryStats, 
  LeadStateStats, 
  LeadSpainRegionStats 
} from "../types"
import styles from "../styles/ChartComponents.module.css"

// Dynamic import for Chart.js to avoid SSR issues
let Chart: any = null
let registerables: any = null

if (typeof window !== 'undefined') {
  import('chart.js/auto').then((module) => {
    Chart = module.default
    registerables = module.registerables
  })
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

interface ChartComponentsProps {
  data: any[]
  viewType: 'category' | 'country' | 'state' | 'spain-region'
  chartType: 'bar' | 'pie' | 'doughnut'
  title?: string
  height?: number
}

const getViewIcon = (viewType: string) => {
  switch (viewType) {
    case 'category':
      return <Building2 className="h-5 w-5 text-ritter-gold" />
    case 'country':
      return <Globe className="h-5 w-5 text-ritter-gold" />
    case 'state':
      return <MapPin className="h-5 w-5 text-ritter-gold" />
    case 'spain-region':
      return <Flag className="h-5 w-5 text-ritter-gold" />
    default:
      return <BarChart3 className="h-5 w-5 text-ritter-gold" />
  }
}

const getViewTitle = (viewType: string) => {
  switch (viewType) {
    case 'category':
      return 'Leads por Categoría'
    case 'country':
      return 'Leads por País'
    case 'state':
      return 'Leads por Estado/Región'
    case 'spain-region':
      return 'Leads por Comunidad Autónoma'
    default:
      return 'Leads por Categoría'
  }
}

export function BarChart({ data, viewType, title, height = 300 }: ChartComponentsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const { t } = useLanguage()

  const getChartData = (): ChartData => {
    const labels = data.slice(0, 10).map(item => {
      switch (viewType) {
        case 'category':
          return item.category
        case 'country':
          return item.country
        case 'state':
          return `${item.state}, ${item.country}`
        case 'spain-region':
          return item.comunidad_autonoma
        default:
          return item.category
      }
    })

    const values = data.slice(0, 10).map(item => {
      switch (viewType) {
        case 'category':
          return item.total_leads
        case 'country':
          return item.total_leads
        case 'state':
          return item.total_leads
        case 'spain-region':
          return item.total_leads
        default:
          return item.total_leads
      }
    })

    const colors = [
      '#F2B705', '#059669', '#2563eb', '#9333ea', '#dc2626',
      '#ea580c', '#0891b2', '#7c3aed', '#16a34a', '#f59e0b'
    ]

    return {
      labels,
      datasets: [{
        label: t("analytics.charts.leads") || "Leads",
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 1
      }]
    }
  }

  useEffect(() => {
    if (!Chart || !canvasRef.current || !data.length) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const chartData = getChartData()

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return value.toLocaleString()
              }
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0
            }
          }
        }
      }
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, viewType, title])

  if (!data.length) {
    return (
      <Card className={styles.chartCard}>
        <CardHeader className={styles.chartHeader}>
          <CardTitle className={styles.chartTitle}>
            {getViewIcon(viewType)}
            {title || getViewTitle(viewType)}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.chartContent}>
          <div className={styles.emptyState}>
            <BarChart3 className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {t("analytics.charts.noData") || "No hay datos disponibles"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={styles.chartCard}>
      <CardHeader className={styles.chartHeader}>
        <CardTitle className={styles.chartTitle}>
          {getViewIcon(viewType)}
          {title || getViewTitle(viewType)}
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.chartContent}>
        <div style={{ height: `${height}px`, position: 'relative' }}>
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}

export function PieChart({ data, viewType, title, height = 300 }: ChartComponentsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const { t } = useLanguage()

  const getChartData = (): ChartData => {
    const labels = data.slice(0, 8).map(item => {
      switch (viewType) {
        case 'category':
          return item.category
        case 'country':
          return item.country
        case 'state':
          return `${item.state}, ${item.country}`
        case 'spain-region':
          return item.comunidad_autonoma
        default:
          return item.category
      }
    })

    const values = data.slice(0, 8).map(item => {
      switch (viewType) {
        case 'category':
          return item.total_leads
        case 'country':
          return item.total_leads
        case 'state':
          return item.total_leads
        case 'spain-region':
          return item.total_leads
        default:
          return item.total_leads
      }
    })

    const colors = [
      '#F2B705', '#059669', '#2563eb', '#9333ea', '#dc2626',
      '#ea580c', '#0891b2', '#7c3aed'
    ]

    return {
      labels,
      datasets: [{
        label: t("analytics.charts.leads") || "Leads",
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 2
      }]
    }
  }

  useEffect(() => {
    if (!Chart || !canvasRef.current || !data.length) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const chartData = getChartData()

    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || ''
                const value = context.parsed
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value.toLocaleString()} (${percentage}%)`
              }
            }
          }
        }
      }
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, viewType, title])

  if (!data.length) {
    return (
      <Card className={styles.chartCard}>
        <CardHeader className={styles.chartHeader}>
          <CardTitle className={styles.chartTitle}>
            {getViewIcon(viewType)}
            {title || "Distribución"}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.chartContent}>
          <div className={styles.emptyState}>
            <PieChartIcon className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {t("analytics.charts.noData") || "No hay datos disponibles"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={styles.chartCard}>
      <CardHeader className={styles.chartHeader}>
        <CardTitle className={styles.chartTitle}>
          {getViewIcon(viewType)}
          {title || "Distribución"}
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.chartContent}>
        <div style={{ height: `${height}px`, position: 'relative' }}>
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}

export function DoughnutChart({ data, viewType, title, height = 300 }: ChartComponentsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const { t } = useLanguage()

  const getChartData = (): ChartData => {
    const labels = data.slice(0, 6).map(item => {
      switch (viewType) {
        case 'category':
          return item.category
        case 'country':
          return item.country
        case 'state':
          return `${item.state}, ${item.country}`
        case 'spain-region':
          return item.comunidad_autonoma
        default:
          return item.category
      }
    })

    const values = data.slice(0, 6).map(item => {
      switch (viewType) {
        case 'category':
          return item.total_leads
        case 'country':
          return item.total_leads
        case 'state':
          return item.total_leads
        case 'spain-region':
          return item.total_leads
        default:
          return item.total_leads
      }
    })

    const colors = [
      '#F2B705', '#059669', '#2563eb', '#9333ea', '#dc2626', '#ea580c'
    ]

    return {
      labels,
      datasets: [{
        label: t("analytics.charts.leads") || "Leads",
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 3
      }]
    }
  }

  useEffect(() => {
    if (!Chart || !canvasRef.current || !data.length) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const chartData = getChartData()

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || ''
                const value = context.parsed
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value.toLocaleString()} (${percentage}%)`
              }
            }
          }
        }
      }
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, viewType, title])

  if (!data.length) {
    return (
      <Card className={styles.chartCard}>
        <CardHeader className={styles.chartHeader}>
          <CardTitle className={styles.chartTitle}>
            {getViewIcon(viewType)}
            {title || "Distribución"}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.chartContent}>
          <div className={styles.emptyState}>
            <PieChartIcon className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {t("analytics.charts.noData") || "No hay datos disponibles"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={styles.chartCard}>
      <CardHeader className={styles.chartHeader}>
        <CardTitle className={styles.chartTitle}>
          {getViewIcon(viewType)}
          {title || "Distribución"}
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.chartContent}>
        <div style={{ height: `${height}px`, position: 'relative' }}>
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}

// Quality Score Chart
export function QualityScoreChart({ data, viewType, title, height = 300 }: ChartComponentsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const { t } = useLanguage()

  const getChartData = (): ChartData => {
    const labels = data.slice(0, 8).map(item => {
      switch (viewType) {
        case 'category':
          return item.category
        case 'country':
          return item.country
        case 'state':
          return `${item.state}, ${item.country}`
        case 'spain-region':
          return item.comunidad_autonoma
        default:
          return item.category
      }
    })

    const values = data.slice(0, 8).map(item => {
      switch (viewType) {
        case 'category':
          return item.avg_quality_score
        case 'country':
          return item.avg_quality_score
        case 'state':
          return item.avg_quality_score
        case 'spain-region':
          return item.calidad_promedio
        default:
          return item.avg_quality_score
      }
    })

    const colors = values.map(score => {
      if (score >= 4.5) return '#059669' // Green
      if (score >= 4.0) return '#0891b2' // Cyan
      if (score >= 3.5) return '#F2B705' // Gold
      if (score >= 3.0) return '#ea580c' // Orange
      return '#dc2626' // Red
    })

    return {
      labels,
      datasets: [{
        label: t("analytics.charts.qualityScore") || "Puntuación de Calidad",
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    }
  }

  useEffect(() => {
    if (!Chart || !canvasRef.current || !data.length) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const chartData = getChartData()

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0
            }
          }
        }
      }
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, viewType, title])

  if (!data.length) {
    return (
      <Card className={styles.chartCard}>
        <CardHeader className={styles.chartHeader}>
          <CardTitle className={styles.chartTitle}>
            <TrendingUp className={styles.chartIcon} />
            {title || t("analytics.charts.qualityScores") || "Puntuaciones de Calidad"}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.chartContent}>
          <div className={styles.emptyState}>
            <TrendingUp className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {t("analytics.charts.noData") || "No hay datos disponibles"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={styles.chartCard}>
      <CardHeader className={styles.chartHeader}>
        <CardTitle className={styles.chartTitle}>
          <TrendingUp className={styles.chartIcon} />
          {title || t("analytics.charts.qualityScores") || "Puntuaciones de Calidad"}
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.chartContent}>
        <div style={{ height: `${height}px`, position: 'relative' }}>
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
} 