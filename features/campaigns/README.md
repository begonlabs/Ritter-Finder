# 🎯 Campaigns Feature - RitterFinder

## 📋 Descripción

El módulo de campañas de RitterFinder permite crear y gestionar campañas de email marketing de manera eficiente. Incluye funcionalidades de composición, vista previa, gestión de destinatarios y seguimiento de campañas.

## ✨ Características Principales

### 📧 Composición de Emails
- **Modo Texto y HTML**: Soporte para contenido en texto plano y HTML
- **Plantillas**: Sistema de plantillas reutilizables
- **Personalización**: Variables dinámicas para personalizar contenido
- **Validación**: Validación en tiempo real del contenido

### 👥 Gestión de Destinatarios
- **Paginación**: 25 elementos por página para mejor rendimiento
- **Validación**: Verificación de calidad de datos de leads
- **Filtros**: Filtrado por empresa, industria, calidad de datos
- **Estadísticas**: Resumen de destinatarios y empresas

### 👀 Vista Previa
- **Personalización**: Vista previa personalizada por destinatario
- **Modo HTML**: Renderizado de contenido HTML
- **Validación**: Advertencias sobre contenido faltante

### 📊 Historial de Campañas
- **Seguimiento**: Métricas de apertura y clics
- **Búsqueda**: Filtrado de campañas por término
- **Acciones**: Duplicar y ver detalles de campañas

## 🏗️ Arquitectura

### Componentes Principales

```
components/
├── CampaignIntegration.tsx    # Integración principal
├── EmailComposer.tsx         # Composer principal con tabs
├── ComposeTab.tsx           # Tab de composición
├── PreviewTab.tsx           # Tab de vista previa
├── RecipientsTab.tsx        # Tab de destinatarios (con paginación)
├── CampaignSuccess.tsx      # Pantalla de éxito
├── EmailHistory.tsx         # Historial de campañas
└── Pagination.tsx          # Componente de paginación
```

### Hooks Personalizados

```
hooks/
├── useEmailComposer.ts      # Lógica del composer
├── useEmailTemplates.ts     # Gestión de plantillas
├── useLeadAdapter.ts        # Adaptación de leads
├── useCampaignHistory.ts    # Historial de campañas
└── usePagination.ts        # Lógica de paginación
```

## 🎨 Paginación

### Características de la Paginación

La paginación está implementada con las siguientes características:

- **25 elementos por página**: Optimizado para rendimiento
- **Navegación inteligente**: Botones de primera/última página
- **Información contextual**: Muestra "1-25 de 100" por ejemplo
- **Responsive**: Adaptado para móviles y tablets
- **Accesibilidad**: Soporte para lectores de pantalla

### Uso del Hook usePagination

```typescript
import { usePagination } from '../hooks/usePagination'

const {
  currentItems,      // Elementos de la página actual
  currentPage,       // Página actual
  totalPages,        // Total de páginas
  goToPage,          // Función para ir a una página
  pageInfo           // Info como "1-25 de 100"
} = usePagination({
  items: selectedLeads,
  itemsPerPage: 25
})
```

### Componente Pagination

```typescript
import { Pagination } from './Pagination'

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={goToPage}
  pageInfo={pageInfo}
/>
```

## 🎯 Implementación de Paginación en RecipientsTab

### Características Implementadas

1. **Paginación Automática**: Se activa cuando hay más de 25 destinatarios
2. **Numeración Correcta**: Los números de destinatario consideran la paginación
3. **Estadísticas Globales**: El resumen muestra estadísticas de todos los leads
4. **Navegación Intuitiva**: Botones de navegación claros y accesibles

### Código de Ejemplo

```typescript
const ITEMS_PER_PAGE = 25

const {
  currentItems: paginatedLeads,
  currentPage,
  totalPages,
  goToPage,
  pageInfo
} = usePagination({
  items: selectedLeads,
  itemsPerPage: ITEMS_PER_PAGE
})

// Renderizar solo los leads de la página actual
{paginatedLeads.map((lead, index) => {
  const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index
  return <RecipientItem key={lead.id} lead={lead} index={actualIndex} />
})}

// Mostrar paginación solo si es necesaria
{selectedLeads.length > ITEMS_PER_PAGE && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={goToPage}
    pageInfo={pageInfo}
  />
)}
```

## 🎨 Estilos

### CSS Modules

Los estilos están organizados en módulos CSS para evitar conflictos:

- `Pagination.module.css`: Estilos del componente de paginación
- `RecipientsTab.module.css`: Estilos actualizados con paginación

### Características de Diseño

- **Responsive**: Adaptado para diferentes tamaños de pantalla
- **Accesibilidad**: Soporte para alto contraste y movimiento reducido
- **Animaciones**: Transiciones suaves y feedback visual
- **Consistencia**: Mantiene el diseño del sistema RitterFinder

## 🚀 Uso

### Importación

```typescript
import { RecipientsTab, Pagination, usePagination } from '@/features/campaigns'
```

### Implementación Básica

```typescript
function MyComponent() {
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])
  
  return (
    <RecipientsTab selectedLeads={selectedLeads} />
  )
}
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Configuración de Brevo (anteriormente Sendinblue)
NEXT_PUBLIC_BREVO_SENDER_NAME="RitterFinder Team"
NEXT_PUBLIC_BREVO_SENDER_EMAIL="info@rittermor.energy"
```

## 📈 Mejoras Futuras

- [ ] **Filtros Avanzados**: Filtros por calidad de datos, industria, etc.
- [ ] **Búsqueda en Destinatarios**: Búsqueda dentro de la lista paginada
- [ ] **Exportación**: Exportar lista de destinatarios
- [ ] **Estadísticas Detalladas**: Métricas por página y totales
- [ ] **Personalización de Página**: Permitir cambiar elementos por página

## 🤝 Contribución

Para contribuir a esta feature:

1. Sigue las convenciones de código establecidas
2. Mantén los archivos modulares (máximo 200 líneas)
3. Usa TypeScript para todos los componentes
4. Incluye tests para nuevas funcionalidades
5. Documenta cambios en este README

## 📝 Notas Técnicas

- **Performance**: La paginación mejora significativamente el rendimiento con listas grandes
- **Memoria**: Solo renderiza los elementos visibles, reduciendo el uso de memoria
- **UX**: Mantiene la numeración correcta para mejor experiencia de usuario
- **Accesibilidad**: Cumple con estándares WCAG 2.1 