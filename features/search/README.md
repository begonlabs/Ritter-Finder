# Search Module - Supabase Integration

## 🎯 Overview

El módulo de búsqueda de RitterFinder ahora incluye integración completa con Supabase para el historial de búsquedas. Cada búsqueda realizada se guarda automáticamente en la base de datos y se registra en el timeline de actividades.

## 🚀 New Features

### Historial de Búsqueda Automático
- **Guardado automático**: Cada búsqueda se guarda en `search_history` table
- **Registro de actividad**: Se crea un registro en `activity_logs` para el timeline
- **Estados de búsqueda**: `pending`, `running`, `completed`, `failed`, `cancelled`
- **Métricas detalladas**: Tiempo de ejecución, resultados válidos, páginas scrapeadas

### Integración con Supabase
- **Tabla `search_history`**: Almacena todos los parámetros y resultados de búsqueda
- **Vista `search_history_detailed`**: Proporciona información enriquecida con joins
- **Tabla `activity_logs`**: Registra cada acción para el timeline de actividades
- **Vista `comprehensive_activity_history`**: Combina logs con información de usuario

## 📊 Database Schema

### Search History Table
```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  query_name TEXT,
  search_parameters JSONB,
  filters_applied JSONB,
  status search_status,
  total_results INTEGER,
  valid_results INTEGER,
  duplicate_results INTEGER,
  execution_time_ms INTEGER,
  pages_scraped INTEGER,
  websites_searched INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  search_config_id UUID REFERENCES search_configurations(id)
);
```

### Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  activity_type activity_type,
  action VARCHAR(255),
  description TEXT,
  resource_type VARCHAR(100),
  resource_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  before_data JSONB,
  after_data JSONB,
  changes JSONB
);
```

## 🔧 Implementation

### Hook: useSearchHistory
```typescript
const { 
  saveSearchToHistory, 
  getSearchHistory, 
  deleteSearchHistory, 
  updateSearchStatus 
} = useSearchHistory()
```

**Funciones principales:**
- `saveSearchToHistory()`: Guarda una búsqueda en el historial
- `getSearchHistory()`: Obtiene el historial de búsquedas del usuario
- `deleteSearchHistory()`: Elimina una búsqueda del historial
- `updateSearchStatus()`: Actualiza el estado de una búsqueda
- `logSearchActivity()`: Registra actividad en el timeline

### Hook: useSearch (Actualizado)
```typescript
const { 
  state, 
  actions, 
  results, 
  searchResults, 
  canStartSearch,
  isSearching,
  searchComplete,
  currentSearchId 
} = useSearch()
```

**Nuevas propiedades:**
- `searchComplete`: Indica si la búsqueda se completó exitosamente
- `currentSearchId`: ID de la búsqueda actual en el historial

## 🎨 UI Components

### SearchForm (Actualizado)
```typescript
<SearchForm 
  state={state}
  actions={actions}
  canStartSearch={canStartSearch}
  searchComplete={searchComplete}
  currentSearchId={currentSearchId}
/>
```

**Nuevas características:**
- Notificación de éxito cuando se completa una búsqueda
- Muestra el ID de la búsqueda guardada
- Indicadores visuales del estado de guardado

## 📈 Data Flow

### 1. Inicio de Búsqueda
```typescript
// 1. Usuario hace clic en "Buscar"
handleSearch()

// 2. Se crea registro inicial
const searchId = await saveSearchToHistory(config, tempResults, 0, 'running')

// 3. Se registra actividad
await logSearchActivity(userId, searchId, 'running', 0, 0)
```

### 2. Durante la Búsqueda
```typescript
// Progreso simulado con pasos realistas
const steps = [
  "Conectando a fuentes de datos...",
  "Aplicando filtros de búsqueda...",
  "Extrayendo información de contacto...",
  "Verificando emails y sitios web...",
  "Calculando puntuaciones de calidad...",
  "Generando métricas de resultados...",
  "Completando búsqueda...",
]
```

### 3. Finalización de Búsqueda
```typescript
// 1. Se generan resultados
const searchResults = generateSearchResults(config)

// 2. Se actualiza el historial
await saveSearchToHistory(config, searchResults, searchTime, 'completed')

// 3. Se registra actividad de éxito
await logSearchActivity(userId, searchId, 'completed', totalResults, searchTime)
```

## 🔄 Integration with History Module

### Adaptadores de Datos
Los hooks del módulo `history` han sido actualizados para manejar los nuevos formatos de datos:

```typescript
// Nuevos parámetros de búsqueda
const searchParameters = {
  selectedClientTypes: string[],
  selectedLocations: string[],
  requireWebsite: boolean,
  validateEmail: boolean,
  // ... más parámetros
}

// Adaptador actualizado
const adaptSearchRecord = (record: SearchHistoryRecord): SearchHistoryItem => {
  const clientTypes = searchParams.selectedClientTypes || ['general']
  const locations = searchParams.selectedLocations || []
  
  return {
    id: record.id,
    date: record.started_at,
    websites: clientTypes,
    clientType: clientTypes[0] || 'general',
    leadsFound: record.total_results,
    // ... más campos
  }
}
```

## 🎯 Benefits

### Para el Usuario
- **Historial completo**: Todas las búsquedas quedan registradas
- **Reutilización**: Puede reejecutar búsquedas anteriores
- **Análisis**: Ve el rendimiento de sus búsquedas
- **Transparencia**: Sabe exactamente qué parámetros usó

### Para el Sistema
- **Analytics**: Datos para mejorar el algoritmo de búsqueda
- **Debugging**: Trazabilidad completa de errores
- **Performance**: Métricas de tiempo de ejecución
- **Auditoría**: Registro completo de actividades

## 🚀 Usage Example

```typescript
import { useSearch } from '@/features/search/hooks'

function SearchComponent() {
  const { 
    state, 
    actions, 
    canStartSearch,
    searchComplete,
    currentSearchId 
  } = useSearch()

  return (
    <SearchForm 
      state={state}
      actions={actions}
      canStartSearch={canStartSearch}
      searchComplete={searchComplete}
      currentSearchId={currentSearchId}
    />
  )
}
```

## 📊 Monitoring

### Logs de Actividad
Cada búsqueda genera múltiples registros:
1. **search_started**: Cuando se inicia la búsqueda
2. **search_completed**: Cuando se completa exitosamente
3. **search_failed**: Si hay errores durante la búsqueda

### Métricas Capturadas
- Tiempo total de ejecución
- Número de resultados encontrados
- Número de resultados válidos
- Páginas scrapeadas (estimado)
- Sitios web buscados (estimado)
- Parámetros de búsqueda utilizados
- Filtros aplicados

## 🔧 Configuration

### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Permisos de Supabase
```sql
-- Permitir inserción en search_history
GRANT INSERT ON search_history TO authenticated;

-- Permitir inserción en activity_logs  
GRANT INSERT ON activity_logs TO authenticated;

-- Permitir lectura de vistas
GRANT SELECT ON search_history_detailed TO authenticated;
GRANT SELECT ON comprehensive_activity_history TO authenticated;
```

---

**💡 Nota**: Esta implementación proporciona una base sólida para el análisis de uso y la mejora continua del sistema de búsqueda de leads. 