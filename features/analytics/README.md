# 📊 Analytics Module - RitterFinder

Este módulo proporciona análisis de métricas del dashboard y actividad para RitterFinder, conectado directamente a Supabase con la vista **dashboard_overview** para datos en tiempo real.

## 📁 Estructura del Módulo

```
features/analytics/
├── components/               # Componentes de UI
│   ├── DashboardStats.tsx   # Estadísticas principales del dashboard (5 métricas)
│   └── LeadStats.tsx        # Estadísticas de leads desde vistas BD
├── hooks/                   # Hooks personalizados
│   ├── useDashboardStats.ts # Métricas desde dashboard_overview
│   └── useLeadStats.ts      # Estadísticas de leads desde vistas
├── pages/                   # Páginas completas
│   └── AnalyticsPage.tsx    # Página principal de analytics
├── styles/                  # Estilos modulares CSS
│   ├── *.module.css         # Estilos por componente
│   └── README.md            # Documentación de estilos
├── types/                   # Tipos TypeScript
│   └── index.ts             # Tipos de dashboard_overview y frontend
├── utils/                   # Utilidades y helpers
│   └── analyticsUtils.ts    # Funciones de cálculo y formateo
├── index.tsx                # Exportaciones principales
└── README.md                # Esta documentación
```

## 🎯 Características Principales

### ✅ **Conectado a Dashboard Overview**
- **Vista Principal**: `dashboard_overview` del archivo `dashboard.sql`
- **Función Enhanced**: `get_dashboard_summary()` con datos de tendencia
- **Vista Diaria**: `daily_dashboard_stats` como fallback
- **Estrategia de Fallback**: Degradación elegante a datos mock si no hay BD

### 📊 **Métricas Disponibles**

#### Dashboard Overview (5 Métricas Principales)
1. **Total Leads** - Leads generados totales
2. **Total Campañas** - Campañas creadas totales
3. **Total Búsquedas** - Búsquedas realizadas totales
4. **Usuarios Activos** - Usuarios registrados en el sistema
5. **Calidad de Leads** - Puntuación promedio de calidad de leads

#### DashboardStats
```tsx
import { DashboardStats } from "@/features/analytics"

<DashboardStats 
  showRefreshButton={true} 
  compact={false}  // true = solo 4 métricas, false = todas las 5
/>
```

**Características:**
- 5 métricas completas desde `dashboard_overview`
- Tendencias comparadas con período anterior (cuando disponible)
- Modo compacto para espacios reducidos
- Actualización manual con botón de refresh
- Loading states con skeleton animations

#### LeadStats
```tsx
import { LeadStats } from "@/features/analytics"

<LeadStats 
  showHeader={true}
  compact={false}
  viewType="category"  // 'category' | 'country' | 'state' | 'spain-region'
  maxItems={5}
/>
```

**Características:**
- Estadísticas de leads desde vistas de base de datos
- 4 tipos de vista: categoría, país, estado, región española
- Métricas de calidad y verificación en tiempo real
- Datos desde `leads_by_category`, `leads_by_country`, `leads_by_state`, `leads_spain_by_region`
- Fallback a datos mock si no hay conexión BD

## 🔗 Integración con Base de Datos

### Vista Principal: `dashboard_overview`
```sql
SELECT 
  'overview' as section,
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM campaigns) as total_campaigns,
  (SELECT COUNT(*) FROM search_history) as total_searches,
  (SELECT COUNT(*) FROM auth.users) as total_users,
  COALESCE((SELECT ROUND(AVG(data_quality_score), 2) FROM leads WHERE data_quality_score IS NOT NULL), 0.00) as avg_lead_quality
FROM dashboard_overview;
```

### Función Mejorada: `get_dashboard_summary()`
```sql
SELECT * FROM get_dashboard_summary(
  '2024-01-01'::DATE,  -- fecha inicio
  CURRENT_DATE         -- fecha fin
);
```

**Proporciona:**
- Todas las métricas básicas
- Tasas de crecimiento calculadas automáticamente
- Comparación con período anterior
- Datos optimizados para trends

### Estrategia de Conexión Dashboard
1. **Primero**: Función `get_dashboard_summary()` con trends
2. **Fallback 1**: Vista `dashboard_overview` básica
3. **Fallback 2**: Vista `daily_dashboard_stats` materializada
4. **Fallback 3**: Datos mock para desarrollo

### Estrategia de Conexión LeadStats
1. **Primero**: Vistas de leads (`leads_by_category`, `leads_by_country`, etc.)
2. **Fallback**: Datos mock específicos por tipo de vista
3. **Error handling**: Estados de error elegantes con mensajes descriptivos

## 🛠 Hooks y Utilities

### useDashboardStats
```tsx
const {
  stats,               // DashboardStats completas
  isLoading,           // Estado de carga
  error,               // Errores de conexión
  lastUpdated,         // Timestamp última actualización
  refreshStats,        // Función para refrescar
  
  // Acceso directo a métricas individuales
  totalLeads,
  totalCampaigns,
  totalSearches,
  totalUsers,          // ✨ Nueva métrica
  averageLeadQuality,  // ✨ Nueva métrica
  trends               // Datos de tendencias
} = useDashboardStats()
```

### Nuevas Utilidades Dashboard
```tsx
import {
  // Dashboard metrics
  calculateLeadGenEfficiency,
  calculateCampaignEffectiveness,
  getLeadQualityCategory,
  calculateUserEngagement,
  
  // Validation
  validateDashboardOverviewData,
  normalizeDashboardOverviewData
} from "@/features/analytics"

// Eficiencia de generación de leads
const efficiency = calculateLeadGenEfficiency(totalLeads, totalSearches)

// Categoría de calidad de leads
const { category, color, description } = getLeadQualityCategory(87.2)

// Engagement de usuarios
const { level, score, averageActivityPerUser } = calculateUserEngagement(
  totalUsers, totalSearches, totalCampaigns
)
```

### Hook LeadStats
```tsx
import { useLeadStats } from "@/features/analytics"

const { data, isLoading, error, refreshStats } = useLeadStats('category')

// Tipos de vista disponibles:
// - 'category': leads_by_category
// - 'country': leads_by_country  
// - 'state': leads_by_state
// - 'spain-region': leads_spain_by_region
```

### Exportación de Reportes
```tsx
import { exportAnalyticsAsPDF, exportAnalyticsAsCSV } from "@/features/analytics"

// Exportar como PDF
await exportAnalyticsAsPDF(
  dashboardStats,
  leadStats,
  [], // Sin actividad reciente
  'category'
)

// Exportar como CSV
exportAnalyticsAsCSV(
  dashboardStats,
  leadStats,
  [], // Sin actividad reciente
  'category'
)
```

## 🎨 Sistema de Design

### Colores por Métrica
- **Leads**: `#F2B705` (ritter-gold) - Métrica principal
- **Campañas**: `#F2B705` (ritter-gold) - Coherencia visual
- **Búsquedas**: `#F2B705` (ritter-gold) - Estilo unificado
- **Usuarios**: `#F2B705` (ritter-gold) - Tema consistente
- **Calidad Leads**: `#059669` (green-600) - Quality indicator

### Indicadores de Calidad
```tsx
// Colores automáticos por puntuación
const qualityColors = {
  90+: '#059669',  // Verde - Excelente
  80+: '#0891b2',  // Cyan - Muy Buena
  70+: '#F2B705',  // Gold - Buena
  60+: '#ea580c',  // Orange - Regular
  <60: '#dc2626'   // Red - Baja
}
```

## 📱 Responsive Design

### Grid Adaptativo
- **Móvil**: 1 columna, métricas apiladas
- **Tablet**: 2-3 columnas, layout optimizado
- **Desktop**: 3-5 columnas, grid completo
- **Modo Compacto**: 4 métricas principales solamente

### Breakpoints Específicos
- `< 640px`: Layout vertical, botones grandes
- `640px - 1024px`: Grid 2x2, compacto
- `> 1024px`: Grid 4 columnas, completo
- `> 1280px`: Espaciado óptimo

## 🚀 Performance

### Optimizaciones Implementadas
- **Cliente Supabase Estable**: Una sola instancia reutilizable
- **Memoización Inteligente**: useCallback y useMemo optimizados
- **Fallback Jerárquico**: 4 niveles de degradación elegante
- **Loading States**: Skeletons para mejor UX

### Caching Strategy
- Datos en memoria durante la sesión activa
- Refresh manual para control del usuario
- No auto-polling para reducir carga del servidor
- Error boundaries para manejo robusto

## 📄 Exportación de Reportes

### Funcionalidades Disponibles
- **PDF Reports**: Reportes completos con tablas formateadas
- **CSV Export**: Datos estructurados para análisis externo
- **Dashboard Overview**: Métricas principales con tendencias
- **Lead Statistics**: Estadísticas detalladas por categoría/región

### Características de Exportación
- **Branding RitterFinder**: Colores y logos corporativos
- **Tablas Formateadas**: AutoTable para presentación profesional
- **Múltiples Secciones**: Dashboard y Leads
- **Timestamps**: Fechas de generación automáticas
- **Nombres de Archivo**: Con fecha para organización

### Uso en Componentes
```tsx
// En AnalyticsPage.tsx
const handleExportData = async (format: 'csv' | 'pdf') => {
  if (format === 'pdf') {
    await exportAnalyticsAsPDF(dashboardStats, leadStats, [], 'category')
  } else {
    exportAnalyticsAsCSV(dashboardStats, leadStats, [], 'category')
  }
}
```

## 🔧 Configuración y Setup

### Base de Datos Setup
```sql
-- 1. Verificar que existe la vista dashboard_overview
SELECT * FROM dashboard_overview LIMIT 1;

-- 2. Probar función de resumen con trends
SELECT * FROM get_dashboard_summary(
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE
);

-- 3. Verificar vista materializada diaria
SELECT * FROM daily_dashboard_stats 
ORDER BY stats_date DESC LIMIT 5;

-- 4. Verificar vistas de leads para LeadStats
SELECT * FROM leads_by_category LIMIT 5;
SELECT * FROM leads_by_country LIMIT 5;
SELECT * FROM leads_by_state LIMIT 5;
SELECT * FROM leads_spain_by_region LIMIT 5;
```

### Variables de Entorno
```env
# Heredadas del proyecto principal
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Uso en Aplicación
```tsx
// Página completa de analytics
import { AnalyticsPage } from "@/features/analytics"

export default function Analytics() {
  return (
    <AnalyticsPage 
      showDetailedView={true}
      period="month" 
    />
  )
}

// Solo estadísticas en dashboard
import { DashboardStats } from "@/features/analytics"

export default function Dashboard() {
  return (
    <div>
      <DashboardStats 
        showRefreshButton={true}
        compact={false}  // Mostrar todas las 5 métricas
      />
    </div>
  )
}
```

## 🧪 Testing & Validation

### Checklist de Verificación
- [ ] **Conexión DB**: Vista `dashboard_overview` accesible
- [ ] **Fallbacks**: Todos los niveles funcionan correctamente
- [ ] **Métricas**: Las 5 métricas se cargan y muestran
- [ ] **Trends**: Datos de crecimiento cuando disponibles
- [ ] **Responsive**: Todos los breakpoints funcionales
- [ ] **Loading**: Estados de carga suaves
- [ ] **Errors**: Manejo elegante de errores

### Debug Console
```javascript
// En browser console para debug
console.log('Dashboard Overview Test:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  client: window.supabase
})
```

## 🔄 Actualizaciones Futuras

### Roadmap Técnico
- [ ] **WebSocket subscriptions**: Updates en tiempo real
- [ ] **Filtros de fecha**: Rangos personalizables
- [ ] **Comparaciones**: Múltiples períodos
- [ ] **Alertas**: Notificaciones de anomalías
- [ ] **Exportación**: PDF/Excel de métricas
- [ ] **ML Predictions**: Tendencias predictivas

### Métricas Adicionales Planeadas
- [ ] **Conversion Rate**: Leads → Customers
- [ ] **Revenue Metrics**: Ingresos por lead
- [ ] **Time to Conversion**: Tiempo promedio
- [ ] **User Cohort Analysis**: Retención de usuarios
- [ ] **Geographic Distribution**: Métricas por región

¡El módulo de analytics está completamente integrado con la vista `dashboard_overview` y proporciona insights valiosos sobre el rendimiento de RitterFinder! 🚀 