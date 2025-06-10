# Layout Module Styles - RitterFinder

Este módulo contiene todos los estilos CSS modulares para el sistema de layout de RitterFinder, implementando el diseño RitterMor de manera consistente y escalable.

## 📁 Arquitectura de Archivos

### CSS Modules Disponibles

- **`LayoutPage.module.css`** - Estilos generales para páginas y contenedores
- **`Sidebar.module.css`** - Navegación lateral con estados colapsado/expandido
- **`DashboardNavigation.module.css`** - Navegación principal con tabs y badges
- **`DashboardLayout.module.css`** - Layout principal del dashboard
- **`DashboardHeader.module.css`** - Header con notificaciones y perfil

## 🎨 Sistema de Colores RitterMor

```css
/* Paleta Principal */
--ritter-gold: #F2B705    /* Dorado principal */
--ritter-dark: #1A1E25    /* Azul oscuro/negro */
--ritter-light: #FFFFFF   /* Blanco */
--ritter-gray: #F5F5F5    /* Gris claro */

/* Colores Complementarios */
--gray-50: #f8fafc
--gray-100: #f1f5f9
--gray-200: #e2e8f0
--gray-300: #cbd5e1
--gray-400: #94a3b8
--gray-500: #64748b
--gray-600: #475569
--gray-700: #334155
--gray-800: #1e293b
--gray-900: #0f172a
```

## 🚀 Patrones de Animación

### 1. Entrada de Componentes
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 2. Animaciones Escalonadas
- **Delay progresivo**: 0.1s, 0.15s, 0.2s, 0.25s...
- **Para listas y grids**: Entrada suave elemento por elemento

### 3. Microinteracciones
- **Hover transforms**: `scale(1.05)`, `translateY(-1px)`
- **Color transitions**: 0.2s ease
- **Focus states**: Outline dorado consistente

## 📱 Diseño Responsivo

### Breakpoints Estándar
```css
/* Mobile First Approach */
@media (max-width: 640px)  { /* Mobile */ }
@media (max-width: 768px)  { /* Tablet */ }
@media (max-width: 1024px) { /* Desktop Small */ }
@media (max-width: 1280px) { /* Desktop Large */ }
```

### Estrategias por Componente

#### Sidebar
- **Desktop**: Ancho fijo (16rem expanded, 4rem collapsed)
- **Mobile**: Full overlay con backdrop
- **Transitions**: Smooth width/transform changes

#### Navigation
- **Desktop**: Horizontal con centro/izquierda
- **Mobile**: Scroll horizontal + progress indicators

#### Layout
- **Grid responsive**: 3 cols → 2 cols → 1 col
- **Spacing adaptativo**: 1.5rem → 1rem → 0.75rem

## 🔧 Clases de Utilidad

### Estados Comunes
```css
.active     /* Estado activo con dorado */
.inactive   /* Estado inactivo */
.disabled   /* Estado deshabilitado */
.compact    /* Versión compacta */
.expanded   /* Versión expandida */
.loading    /* Estado de carga */
```

### Variantes de Tamaño
```css
.normal     /* Tamaño estándar */
.compact    /* Tamaño reducido */
.large      /* Tamaño aumentado */
```

### Estados Visuales
```css
.elevated   /* Sombra aumentada */
.floating   /* Estilo flotante */
.bordered   /* Con bordes */
.noPadding  /* Sin padding interno */
```

## ♿ Accesibilidad

### Focus Management
```css
.navigationItem:focus,
.actionButton:focus {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}
```

### High Contrast Support
```css
@media (prefers-contrast: high) {
  .sidebar {
    border-right-color: #000;
  }
  
  .navigationItem.active {
    border: 2px solid #000;
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .navigationItem {
    animation: none;
    transition: none;
  }
  
  .navigationItem:hover {
    transform: none;
  }
}
```

## 🎯 Componentes Específicos

### LayoutPage.module.css
**Propósito**: Layout base para todas las páginas
```css
.layoutPage          /* Container principal */
.layoutContainer     /* Wrapper con max-width */
.layoutContent       /* Área de contenido */
.sectionCard         /* Cards de sección */
.pageContainer       /* Grid responsive */
```

### Sidebar.module.css
**Propósito**: Navegación lateral inteligente
```css
.sidebar             /* Container principal */
.collapsed           /* Estado colapsado */
.expanded            /* Estado expandido */
.navigationItem      /* Items de navegación */
.childrenContainer   /* Subitems */
```

### DashboardNavigation.module.css
**Propósito**: Navegación principal del dashboard
```css
.navigationContainer /* Wrapper principal */
.navigationItem      /* Botones de navegación */
.navigationBadge     /* Badges con contadores */
.activeIndicator     /* Indicador de tab activo */
```

### DashboardLayout.module.css
**Propósito**: Layout completo del dashboard
```css
.dashboardLayout     /* Layout principal */
.mainContent         /* Área de contenido */
.contentArea         /* Container de páginas */
.cardWrapper         /* Wrapper para cards */
```

### DashboardHeader.module.css
**Propósito**: Header con notificaciones y perfil
```css
.header              /* Header principal */
.logoSection         /* Área del logo */
.actionButton        /* Botones de acción */
.notificationList    /* Lista de notificaciones */
```

## 🔄 Integración con Componentes

### Patrón de Uso
```tsx
import styles from "../styles/ComponentName.module.css"

export function Component() {
  const classes = cn(
    styles.baseClass,
    condition && styles.conditionalClass,
    variant === 'compact' && styles.compact
  )
  
  return <div className={classes}>...</div>
}
```

### Combinación con cn()
```tsx
const itemClasses = cn(
  styles.navigationItem,
  isActive && styles.active,
  disabled && styles.disabled,
  compact && styles.compact
)
```

## 📐 Convenciones de Naming

### Estructura de Clases
```css
.componentName        /* Clase base */
.componentNameHeader  /* Subcomponente */
.componentNameItem    /* Item individual */
.componentNameIcon    /* Iconos */
.componentNameLabel   /* Textos */
```

### Estados y Modificadores
```css
.active, .inactive    /* Estados */
.compact, .expanded   /* Tamaños */
.disabled, .loading   /* Comportamiento */
.mobile, .desktop     /* Responsive */
```

## 🚀 Performance

### Optimizaciones CSS
- **Animations**: Solo `transform` y `opacity` para mejor rendimiento
- **GPU acceleration**: `transform3d` cuando necesario
- **Transitions**: Cubic-bezier suaves
- **Selectores**: Específicos y no anidados

### Lazy Loading Ready
- Todas las animaciones son independientes
- Estados de loading integrados
- Progressive enhancement

## 🔮 Futuras Mejoras

### Planned Features
- [ ] Dark mode support
- [ ] Custom color themes
- [ ] Animation preferences
- [ ] RTL language support
- [ ] Print-specific styles

### Maintenance Notes
- Mantener consistencia con design system
- Revisar accesibilidad regularmente  
- Optimizar performance de animaciones
- Documentar nuevos componentes

---

> 💡 **Tip**: Usa las clases CSS modules en lugar de Tailwind para componentes de layout para mejor mantenabilidad y consistencia visual.