# Dashboard Module - CSS Styles Documentation

Este directorio contiene todos los estilos CSS modulares para el módulo de dashboard de RitterFinder. Cada componente tiene su archivo CSS específico que implementa el design system de RitterMor.

## Archivos de Estilo

### 📊 DashboardPage.module.css
Estilos generales para la página principal del dashboard:
- **Layout Principal**: Estructura general de la página dashboard
- **Header y Título**: Estilos para encabezados del dashboard
- **Form Elements**: Estilos para formularios y campos de entrada
- **Loading States**: Estados de carga y spinners
- **Responsive**: Diseño adaptativo para móviles

### 🎯 DashboardOverview.module.css
Estilos para el componente de overview del dashboard:
- **Quick Actions**: Botones de acciones rápidas con efectos especiales
- **Stats Section**: Área de estadísticas con animaciones
- **Charts Grid**: Grid para gráficos con entrada escalonada
- **Hover Effects**: Efectos de hover con transformaciones doradas
- **Shine Animation**: Efecto de brillo en botones principales

### 🔍 SearchTab.module.css
Estilos para la pestaña de búsqueda:
- **Search Container**: Contenedor principal con animaciones
- **Form Wrapper**: Envoltorio del formulario de búsqueda
- **Loading States**: Estados de carga específicos
- **Error Handling**: Estilos para estados de error

### 📋 ResultsTab.module.css
Estilos para la pestaña de resultados:
- **Results Container**: Contenedor de resultados con animaciones
- **Table Wrapper**: Envoltorio de tabla responsive
- **Stats Display**: Mostrar estadísticas de resultados
- **Empty States**: Estados vacíos con iconos y acciones

### 📧 CampaignTab.module.css
Estilos para la pestaña de campañas:
- **Campaign Container**: Contenedor principal de campañas
- **Campaign Wrapper**: Envoltorio del compositor de emails
- **Integration Styles**: Estilos para integración con el módulo campaigns

### 📈 HistoryTab.module.css
Estilos para la pestaña de historial:
- **History Container**: Contenedor del historial
- **Animation Entry**: Animaciones de entrada simples



### 📊 AnalyticsTab.module.css
Estilos para la pestaña de analytics:
- **Analytics Container**: Contenedor principal de analytics
- **Chart Integration**: Integración con componentes de gráficos

## Paleta de Colores RitterMor

```css
:root {
  --ritter-gold: #F2B705;     /* Color principal dorado */
  --ritter-dark: #1A1E25;     /* Color oscuro principal */
  --ritter-light: #FFFFFF;    /* Color claro/blanco */
  --ritter-gray: #F5F5F5;     /* Color gris claro */
}
```

## Patrones de Animación Dashboard

### Animaciones de Entrada
```css
/* Entrada principal del dashboard */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Entrada escalonada para elementos múltiples */
.element:nth-child(1) { animation-delay: 0.1s; }
.element:nth-child(2) { animation-delay: 0.2s; }
.element:nth-child(3) { animation-delay: 0.3s; }
```

### Efectos Especiales

#### Shine Effect en Botones
```css
.actionButton::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.actionButton:hover::before {
  left: 100%;
}
```

#### Hover con Elevación
```css
.actionButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(242, 183, 5, 0.3);
}
```

## Arquitectura de Componentes

### Tab System
- **Animación Universal**: Todas las tabs usan `slideInUp`
- **Container Pattern**: Cada tab tiene su contenedor específico
- **Consistent Spacing**: Gap de 1.5rem entre elementos
- **Loading States**: Estados de carga unificados

### Integration Pattern
```tsx
// Patrón estándar de integración
import styles from "../styles/ComponentName.module.css"

export function Component() {
  return (
    <div className={styles.componentName}>
      <div className={styles.componentContainer}>
        {/* Contenido del componente */}
      </div>
    </div>
  )
}
```

### Analytics Integration
- Los tabs de Analytics integran componentes del módulo analytics
- Mantienen estilos consistentes con el dashboard
- Usan contenedores específicos para coherencia visual

## Estados y Interacciones

### Loading States
- **Spinner dorado**: `border-top: 3px solid #F2B705`
- **Texto descriptivo**: Color #64748b
- **Centrado vertical**: Flex con justify-center

### Empty States
- **Iconos grandes**: 4rem x 4rem, color #d1d5db
- **Acciones CTA**: Botones dorados con hover effects
- **Texto explicativo**: Máximo 400px de ancho

### Error States
- **Color de error**: #dc2626
- **Botones de retry**: Estilo dorado estándar
- **Animación suave**: fadeIn 0.4s

## Responsive Design

### Breakpoints Dashboard
```css
/* Mobile */
@media (max-width: 640px) {
  .actionsGrid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .chartsGrid {
    grid-template-columns: 1fr;
  }
}
```

### Mobile Optimizations
- **Grids colapsan** a columna única
- **Padding reducido** en contenedores
- **Botones full-width** en móvil
- **Texto responsive** con tamaños ajustados

## Performance

### Optimizaciones CSS
- **CSS Modules**: Tree-shaking automático
- **Animaciones GPU**: Uso exclusivo de `transform` y `opacity`
- **Will-change**: Preparación para animaciones pesadas
- **Lazy loading**: Solo cargar estilos cuando se usan

### Lazy Tab Loading
```css
/* Solo animar cuando el tab está activo */
.tabContent[data-state="active"] .component {
  animation: slideInUp 0.6s ease-out;
}
```

## Integración con Otros Módulos



### Campaigns Integration
- CampaignTab integra completamente el EmailComposer
- Mantiene animaciones y estilos del dashboard
- Wrapper específico para integración seamless

### Search Integration
- SearchTab envuelve el SearchForm del módulo search
- Aplica estilos de contenedor dashboard
- Mantiene consistencia visual

## Accesibilidad

### High Contrast Support
```css
@media (prefers-contrast: high) {
  .quickActionsCard {
    border: 2px solid #d1d5db;
  }
  
  .actionButton {
    font-weight: 700;
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .dashboardOverview,
  .statsSection,
  .chartsGrid {
    animation: none;
  }
  
  .actionButton:hover {
    transform: none;
  }
}
```

## Testing

### Visual Testing Checklist
- ✅ Animaciones suaves en todos los tabs
- ✅ Hover effects funcionando en botones
- ✅ Responsive en todos los breakpoints
- ✅ Loading states visibles y claros
- ✅ Integración seamless entre módulos

### Performance Testing
- ✅ Tiempos de animación apropiados (0.6s máximo)
- ✅ No bloqueo del hilo principal
- ✅ CSS modules cargando solo cuando necesario
- ✅ Transiciones suaves sin jank

---

Este sistema de estilos está diseñado para ser modular, mantenible y performante, siguiendo las mejores prácticas de CSS moderno y el design system de RitterMor. Cada componente es independiente pero mantiene consistencia visual y funcional con el resto del dashboard. 