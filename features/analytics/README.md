# 📊 Analytics Module - RitterFinder

Este módulo proporciona análisis de métricas del dashboard y actividad para RitterFinder, conectado directamente a Supabase con la vista **dashboard_overview** para datos en tiempo real, y ahora incluye **análisis geográfico completo** con las vistas de `leads-geographic-views.sql` **integrado en la página principal de analytics**.

## 📁 Estructura del Módulo

```
features/analytics/
├── components/               # Componentes de UI
│   ├── DashboardStats.tsx   # Estadísticas principales del dashboard (5 métricas)
│   ├── LeadStats.tsx        # Estadísticas de leads desde vistas BD
│   └── ChartComponents.tsx  # Gráficos interactivos con Chart.js
├── hooks/                   # Hooks personalizados
│   ├── useDashboardStats.ts # Métricas desde dashboard_overview
│   └── useLeadStats.ts      # Estadísticas de leads desde vistas geográficas
├── pages/                   # Páginas completas
│   ├── AnalyticsPage.tsx    # Página principal con análisis geográfico integrado ✨
│   └── AnalyticsChartsPage.tsx # Página especializada con gráficos interactivos
├── styles/                  # Estilos modulares CSS
│   ├── *.module.css         # Estilos por componente
│   └── README.md            # Documentación de estilos
├── types/                   # Tipos TypeScript
│   └── index.ts             # Tipos de dashboard_overview y frontend
├── utils/                   # Utilidades y helpers
│   └── analyticsUtils.ts    # Funciones de cálculo y formateo
├── examples/                # Ejemplos de uso
│   └── ChartsExample.tsx    # Ejemplo de gráficos geográficos
├── index.tsx                # Exportaciones principales
└── README.md                # Esta documentación
```

## 🎯 Características Principales

### ✅ **Conectado a Dashboard Overview**
- **Vista Principal**: `dashboard_overview` del archivo `dashboard.sql`
- **Función Enhanced**: `get_dashboard_summary()` con datos de tendencia
- **Vista Diaria**: `daily_dashboard_stats` como fallback
- **Estrategia de Fallback**: Degradación elegante a datos mock si no hay BD

### 🌍 **Análisis Geográfico Completo Integrado**
- **Página Principal**: `AnalyticsPage.tsx` ahora incluye controles geográficos
- **4 Tipos de Vista**: Categoría, País, Estado/Región, Comunidad Autónoma
- **Controles Interactivos**: Selectores para vista geográfica y tipo de gráfico
- **Gráficos Dinámicos**: Se adaptan automáticamente al tipo de vista seleccionada
- **Datos Enriquecidos**: Métricas de calidad, verificación y contactabilidad
- **Análisis Español**: Vista especializada para comunidades autónomas

### 📊 **Gráficos Interactivos Integrados**
- **Chart.js Integration**: Gráficos de barras, pastel y dona
- **Vistas Geográficas**: Datos desde `leads-geographic-views.sql`
- **Tipos de Gráficos**: Barras, pastel, dona y puntuaciones de calidad
- **Responsive**: Adaptable a todos los dispositivos
- **Exportación**: PDF y CSV con gráficos incluidos

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

#### LeadStats con Análisis Geográfico
```tsx
import { LeadStats } from "@/features/analytics"

<LeadStats 
  showHeader={true}
  compact={false}
  viewType="country"  // 'category' | 'country' | 'state' | 'spain-region'
  maxItems={5}
/>
```

**Características:**
- **4 Tipos de Vista Geográfica**:
  - `category`: Estadísticas por categoría de negocio
  - `country`: Análisis por países con métricas de calidad
  - `state`: Análisis por estados/provincias con contactabilidad
  - `spain-region`: Análisis especializado para comunidades autónomas españolas
- **Métricas Enriquecidas**: Calidad, verificación, contactabilidad
- **Datos desde Vistas SQL**: `leads_by_category`, `leads_by_country`, `leads_by_state`, `leads_spain_by_region`
- **Fallback Inteligente**: Datos mock específicos por tipo de vista

#### Gráficos Interactivos Geográficos
```tsx
import { 
  BarChart, 
  PieChart as PieChartComponent, 
  DoughnutChart, 
  QualityScoreChart 
} from "@/features/analytics"

// Gráfico de barras por país
<BarChart
  data={leadStats}
  viewType="country"
  chartType="bar"
  title="Leads por País"
  height={400}
/>

// Gráfico de pastel por estado
<PieChartComponent
  data={leadStats}
  viewType="state"
  chartType="pie"
  title="Distribución por Estado/Región"
  height={400}
/>

// Gráfico de dona para comunidades autónomas
<DoughnutChart
  data={leadStats}
  viewType="spain-region"
  chartType="doughnut"
  title="Leads por Comunidad Autónoma"
  height={400}
/>

// Gráfico de puntuaciones de calidad geográficas
<QualityScoreChart
  data={leadStats}
  viewType="country"
  chartType="bar"
  title="Puntuaciones de Calidad por País"
  height={300}
/>
```

**Características de Gráficos Geográficos:**
- **Chart.js Integration**: Gráficos interactivos y responsivos
- **Múltiples Tipos**: Barras, pastel, dona y calidad
- **Iconos Específicos**: Cada tipo de vista tiene su icono distintivo
- **Colores RitterFinder**: Paleta de colores corporativa
- **Tooltips Interactivos**: Información detallada al hacer hover
- **Exportación**: Los gráficos se incluyen en reportes PDF
- **Responsive**: Se adaptan automáticamente al tamaño de pantalla

## 🎯 **Nueva Página Principal Integrada**

### AnalyticsPage.tsx - Análisis Geográfico Completo
```tsx
import { AnalyticsPage } from "@/features/analytics"

export default function Analytics() {
  return (
    <AnalyticsPage 
      showDetailedView={true}
      period="month"
    />
  )
}
```

**Características de la Página Principal:**
- **Controles Geográficos Integrados**: Selectores para vista y tipo de gráfico
- **Layout Responsive**: Grid adaptativo para diferentes tamaños de pantalla
- **Múltiples Gráficos**: Gráfico principal + puntuaciones de calidad + gráficos adicionales
- **Exportación Integrada**: Botones para exportar CSV y generar PDF
- **Estados de Carga**: Loading states elegantes durante la carga de datos
- **Iconos Específicos**: Cada tipo de vista tiene su icono distintivo
- **Datos Dinámicos**: Los gráficos se actualizan automáticamente al cambiar la vista

### Controles Geográficos Disponibles
- **Vista de Datos**: 
  - Por Categoría (Building2 icon)
  - Por País (Globe icon)
  - Por Estado/Región (MapPin icon)
  - Por Comunidad Autónoma (Flag icon)
- **Tipo de Gráfico**:
  - Gráfico de Barras
  - Gráfico de Pastel
  - Gráfico de Dona

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

### Vistas Geográficas (leads-geographic-views.sql)
```sql
-- Vistas disponibles para análisis geográfico:
-- leads_by_country: Estadísticas por país
-- leads_by_state: Estadísticas por estado/provincia  
-- leads_spain_by_region: Estadísticas españolas por comunidad autónoma
-- geographic_summary: Resumen geográfico simplificado
```

**Datos Disponibles por Vista:**

#### leads_by_country
- **Total Leads**: Número total de leads por país
- **Calidad Promedio**: Puntuación promedio de calidad
- **Leads de Alta Calidad**: Porcentaje de leads con alta calidad
- **Emails Verificados**: Número de emails verificados
- **Teléfonos Verificados**: Número de teléfonos verificados
- **Contactabilidad**: Porcentaje de leads contactables
- **Categorías Principales**: Top 3 categorías por país
- **Tasas de Verificación**: Porcentajes de verificación de email y teléfono

#### leads_by_state
- **Total Leads**: Número total de leads por estado/provincia
- **Calidad Promedio**: Puntuación promedio de calidad
- **Leads de Alta Calidad**: Porcentaje de leads con alta calidad
- **Contactabilidad**: Porcentaje de leads contactables
- **Actividades Principales**: Top 5 actividades por estado
- **Leads Último Mes**: Actividad reciente (últimos 30 días)
- **Métricas de Contacto**: Emails, teléfonos y websites disponibles

#### leads_spain_by_region
- **Total Leads**: Número total de leads por comunidad autónoma
- **Calidad Promedio**: Puntuación promedio de calidad
- **Leads de Alta Calidad**: Número de leads de alta calidad
- **Contactabilidad**: Porcentaje de leads contactables
- **Categoría Principal**: Categoría más frecuente por región
- **Métricas de Verificación**: Teléfonos y emails verificados
- **Presencia Web**: Número de leads con website

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

### Hook LeadStats con Análisis Geográfico
```tsx
import { useLeadStats } from "@/features/analytics"

const { data, isLoading, error, refreshStats } = useLeadStats('country')

// Tipos de vista geográfica disponibles:
// - 'category': leads_by_category (análisis por categoría de negocio)
// - 'country': leads_by_country (análisis por países)
// - 'state': leads_by_state (análisis por estados/provincias)
// - 'spain-region': leads_spain_by_region (análisis español por CCAA)
```

### Página Principal con Análisis Geográfico Integrado
```tsx
import { AnalyticsPage } from "@/features/analytics"

export default function Analytics() {
  return (
    <AnalyticsPage 
      showDetailedView={true}
      period="month"
    />
  )
}
```

**Características de la Página Principal:**
- **Controles Interactivos**: Selectores para vista geográfica y tipo de gráfico
- **Layout Responsive**: Grid adaptativo para diferentes tamaños de pantalla
- **Múltiples Gráficos**: Gráfico principal + puntuaciones de calidad + gráficos adicionales
- **Exportación Integrada**: Botones para exportar CSV y generar PDF
- **Estados de Carga**: Loading states elegantes durante la carga de datos
- **Iconos Específicos**: Cada tipo de vista tiene su icono distintivo
- **Datos Dinámicos**: Los gráficos se actualizan automáticamente al cambiar la vista

### Exportación de Reportes con Datos Geográficos Completos
```tsx
import { exportAnalyticsAsPDF, exportAnalyticsAsCSV } from "@/features/analytics"

// Exportar como PDF con TODOS los datos disponibles
await exportAnalyticsAsPDF(
  dashboardStats,
  leadStats,  // Todos los datos, no solo los renderizados
  'country'   // Vista geográfica
)

// Exportar como CSV con TODOS los datos disponibles
exportAnalyticsAsCSV(
  dashboardStats,
  leadStats,  // Todos los datos, no solo los renderizados
  'spain-region'  // Vista de comunidades autónomas
)
```

**Características de Exportación Mejoradas:**
- **Datos Completos**: Incluye TODOS los registros disponibles, no solo los primeros 10
- **Sección de Resumen**: Estadísticas agregadas con totales y promedios
- **Datos Detallados**: Tabla completa con todas las métricas disponibles
- **Múltiples Secciones**: Dashboard Overview + Lead Statistics Summary + Complete Data
- **Números de Página**: PDFs con paginación automática
- **Manejo de Datos Faltantes**: Valores por defecto para campos undefined
- **Logging Detallado**: Información sobre número de registros exportados

**Estructura de Reportes:**
1. **Dashboard Overview**: Métricas principales del sistema
2. **Lead Statistics Summary**: Resumen con totales y promedios
3. **Complete Lead Statistics**: Todos los datos disponibles en tabla completa

**Campos Incluidos por Vista:**

#### Categoría (Category)
- Category, Total Leads, Verified Emails, Verified Phones, Verified Websites, Avg Quality Score, Latest Lead Date

#### País (Country)
- Country, Total Leads, High Quality Leads, High Quality %, Verified Emails, Verified Phones, Email Verification Rate %, Phone Verification Rate %, Top Categories, Avg Quality Score, First Lead Date, Latest Lead Date

#### Estado/Región (State)
- State, Country, Total Leads, High Quality Leads, High Quality %, Verified Emails, Verified Phones, Leads with Phone, Leads with Email, Contactable %, Top Activities, Leads Last 30 Days, Avg Quality Score

#### Comunidad Autónoma (Spain Region)
- Comunidad Autónoma, Total Leads, Leads Alta Calidad, Calidad Promedio, Teléfonos Verificados, Emails Verificados, Con Website, Contactabilidad %, Categoría Principal, Primer Lead, Último Lead

## 🎨 Sistema de Design

### Colores por Métrica
- **Leads**: `#F2B705` (ritter-gold) - Métrica principal
- **Campañas**: `#F2B705` (ritter-gold) - Coherencia visual
- **Búsquedas**: `#F2B705` (ritter-gold) - Estilo unificado
- **Usuarios**: `#F2B705` (ritter-gold) - Tema consistente
- **Calidad Leads**: `#059669` (green-600) - Quality indicator

### Iconos por Tipo de Vista Geográfica
- **Categoría**: `Building2` - Análisis por categoría de negocio
- **País**: `Globe` - Análisis global por países
- **Estado/Región**: `MapPin` - Análisis regional detallado
- **Comunidad Autónoma**: `Flag` - Análisis español especializado

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

### Paleta de Colores para Gráficos
```tsx
const chartColors = [
  '#F2B705', // ritter-gold
  '#059669', // green-600
  '#2563eb', // blue-600
  '#9333ea', // purple-600
  '#dc2626', // red-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
  '#7c3aed', // violet-600
  '#16a34a', // emerald-600
  '#f59e0b'  // amber-600
]
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

### Layout de Gráficos
- **Desktop**: Grid 2x2 con gráfico principal ocupando 2 columnas
- **Tablet**: Grid 1x3 con gráficos apilados
- **Móvil**: Layout vertical con gráficos a pantalla completa

## 🚀 Performance

### Optimizaciones Implementadas
- **Cliente Supabase Estable**: Una sola instancia reutilizable
- **Memoización Inteligente**: useCallback y useMemo optimizados
- **Fallback Jerárquico**: 4 niveles de degradación elegante
- **Loading States**: Skeletons para mejor UX
- **Chart.js Lazy Loading**: Carga dinámica para evitar SSR issues

### Caching Strategy
- Datos en memoria durante la sesión activa
- Refresh manual para control del usuario
- No auto-polling para reducir carga del servidor
- Error boundaries para manejo robusto

### Optimizaciones de Gráficos
- **Dynamic Imports**: Chart.js se carga solo en el cliente
- **Canvas Optimization**: Gráficos optimizados para performance
- **Responsive Charts**: Se redimensionan automáticamente
- **Memory Management**: Destrucción correcta de instancias de Chart.js

## 📄 Exportación de Reportes

### Funcionalidades Disponibles
- **PDF Reports**: Reportes completos con tablas formateadas
- **CSV Export**: Datos estructurados para análisis externo
- **Dashboard Overview**: Métricas principales con tendencias
- **Lead Statistics**: Estadísticas detalladas por categoría/región
- **Chart Images**: Gráficos incluidos en reportes PDF
- **Datos Geográficos**: Exportación con análisis geográfico completo

### Características de Exportación
- **Branding RitterFinder**: Colores y logos corporativos
- **Tablas Formateadas**: AutoTable para presentación profesional
- **Múltiples Secciones**: Dashboard y Leads
- **Timestamps**: Fechas de generación automáticas
- **Nombres de Archivo**: Con fecha para organización
- **Datos Geográficos**: Incluye análisis por país, estado y región

### Uso en Componentes
```tsx
// En AnalyticsPage.tsx
const handleExportData = async (format: 'csv' | 'pdf') => {
  if (format === 'pdf') {
    await exportAnalyticsAsPDF(dashboardStats, leadStats, selectedView)
  } else {
    exportAnalyticsAsCSV(dashboardStats, leadStats, selectedView)
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

-- 5. Verificar vistas geográficas para gráficos
SELECT * FROM leads_by_country LIMIT 5;
SELECT * FROM leads_by_state LIMIT 5;
SELECT * FROM leads_spain_by_region LIMIT 5;

-- 6. Verificar resumen geográfico
SELECT * FROM geographic_summary;
```

### Variables de Entorno
```env
# Heredadas del proyecto principal
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Dependencias Requeridas
```bash
# Chart.js para gráficos interactivos
pnpm add chart.js

# Dependencias existentes
pnpm add @tanstack/react-query
pnpm add lucide-react
```

### Uso en Aplicación
```tsx
// Página principal de analytics con análisis geográfico integrado
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

// Gráficos geográficos individuales
import { BarChart, PieChart } from "@/features/analytics"

export default function CustomAnalytics() {
  return (
    <div>
      <BarChart
        data={leadStats}
        viewType="country"
        chartType="bar"
        title="Leads por País"
        height={400}
      />
      <PieChart
        data={leadStats}
        viewType="spain-region"
        chartType="pie"
        title="Distribución por Comunidad Autónoma"
        height={400}
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
- [ ] **Gráficos**: Chart.js se carga correctamente
- [ ] **Interactividad**: Tooltips y controles funcionan
- [ ] **Exportación**: PDF y CSV incluyen gráficos
- [ ] **Vistas Geográficas**: Todas las vistas funcionan correctamente
- [ ] **Iconos Específicos**: Cada tipo de vista tiene su icono
- [ ] **Datos Enriquecidos**: Métricas de calidad y verificación
- [ ] **Controles Geográficos**: Selectores funcionan correctamente
- [ ] **Gráficos Dinámicos**: Se actualizan al cambiar vista

### Debug Console
```javascript
// En browser console para debug
console.log('Dashboard Overview Test:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  client: window.supabase
})

// Verificar Chart.js
console.log('Chart.js Test:', {
  Chart: window.Chart,
  chartInstance: document.querySelector('canvas')?.chart
})

// Verificar vistas geográficas
console.log('Geographic Views Test:', {
  category: await supabase.from('leads_by_category').select('*').limit(1),
  country: await supabase.from('leads_by_country').select('*').limit(1),
  state: await supabase.from('leads_by_state').select('*').limit(1),
  spainRegion: await supabase.from('leads_spain_by_region').select('*').limit(1)
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
- [ ] **Más Tipos de Gráficos**: Líneas, áreas, radar
- [ ] **Animaciones Avanzadas**: Transiciones suaves
- [ ] **Zoom y Pan**: Interacción avanzada con gráficos
- [ ] **Mapas Interactivos**: Visualización geográfica en mapas
- [ ] **Análisis de Tendencias Geográficas**: Evolución temporal por región

### Métricas Adicionales Planeadas
- [ ] **Conversion Rate**: Leads → Customers
- [ ] **Revenue Metrics**: Ingresos por lead
- [ ] **Time to Conversion**: Tiempo promedio
- [ ] **User Cohort Analysis**: Retención de usuarios
- [ ] **Geographic Distribution**: Métricas por región
- [ ] **Real-time Charts**: Actualizaciones en vivo
- [ ] **Custom Dashboards**: Dashboards personalizables
- [ ] **Análisis de Densidad Geográfica**: Concentración de leads por área
- [ ] **Métricas de Movilidad**: Análisis de leads entre regiones

¡El módulo de analytics está completamente integrado con análisis geográfico en la página principal y proporciona insights valiosos sobre el rendimiento de RitterFinder a nivel global y regional! 🚀 