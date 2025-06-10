# Search Feature Styles - CSS Modules

## 🎨 RitterMor Design System Integration

Esta feature implementa un sistema modular completo de CSS para la funcionalidad de búsqueda de leads con los colores de RitterMor:

- **ritter-gold**: `#f59e0b` (primary accent)
- **ritter-dark**: `#92400e` (text on gold backgrounds)
- **ritter-gray**: `#1f2937` (primary text)
- **ritter-light**: `#ffffff` (backgrounds)

## 📁 Estructura de Archivos

```
features/search/styles/
├── SearchPage.module.css          # Page layout styles
├── SearchForm.module.css          # Main form container
├── WebsiteSelector.module.css     # Website selection component
├── ClientTypeSelector.module.css  # Client type dropdown
├── ScrapingSimulation.module.css  # Progress animation component
└── README.md                      # This documentation
```

## 🧩 CSS Modules Overview

### 1. SearchForm.module.css

Estilos principales del formulario de búsqueda.

**Clases principales:**
```css
.searchForm         /* Main container */
.formHeader         /* Title and description area */
.formTitle          /* Main heading */
.formDescription    /* Subtitle text */
.configGrid         /* 2-column responsive grid */
.alert              /* Validation messages */
.searchButton       /* Primary CTA button */
.loadingSpinner     /* Loading animation */
```

**Características:**
- Layout responsivo con grid 2→1 columnas
- Animaciones de entrada escalonadas (0.2s-0.6s)
- Botón principal con efectos hover y shimmer
- Estados de loading y error
- Soporte para reduced motion

### 2. WebsiteSelector.module.css

Selector múltiple de sitios web con dropdown y badges.

**Clases principales:**
```css
.websiteSelector     /* Main card container */
.title              /* Section title with icon */
.dropdownTrigger    /* Combobox button */
.popoverContent     /* Dropdown content */
.commandItem        /* Individual website option */
.badge              /* Selected website badges */
.badgeRemoveButton  /* Remove badge action */
```

**Características:**
- Dropdown con animación slide-down
- Checkboxes personalizados con RitterMor colors
- Badges removibles con animación fade-in-scale
- Hover effects y transiciones suaves
- Responsive design para móviles

### 3. ClientTypeSelector.module.css

Selector único de tipo de cliente.

**Clases principales:**
```css
.clientTypeSelector  /* Main card container */
.dropdownTrigger    /* Single selection button */
.commandItem        /* Client type options */
.commandItemCheckbox /* Visual selection indicator */
.commandItemLabel   /* Option text */
```

**Características:**
- Single selection dropdown
- Visual feedback para selección
- Animación de entrada con delay (0.1s)
- Iconos de estado y hover effects
- Accesibilidad con focus states

### 4. ScrapingSimulation.module.css

Simulación de progreso de scraping con animaciones.

**Clases principales:**
```css
.scrapingSimulation  /* Main container */
.header             /* Progress title and percentage */
.progressBar        /* Progress bar container */
.progressBarFill    /* Animated progress fill */
.currentWebsite     /* Currently analyzing website */
.stepMessage        /* Process step descriptions */
.activityIndicator  /* Real-time activity dots */
```

**Características:**
- Barra de progreso con gradiente dorado
- Animación shimmer en la barra de progreso
- Mensajes dinámicos con fade-in animations
- Dots de actividad con bounce animation
- Tipografía monospace para URLs

### 5. SearchPage.module.css

Layout de la página completa (legacy - siendo reemplazado por componentes modulares).

## 🎯 Implementación en Componentes

### Ejemplo de uso básico:

```tsx
import { SearchForm } from '@/features/search'
import styles from '@/features/search/styles/SearchForm.module.css'

<SearchForm 
  state={searchState}
  actions={searchActions}
  canStartSearch={canStart}
/>
```

### Integración con componentes existentes:

```tsx
// WebsiteSelector usage
<WebsiteSelector
  selectedWebsites={selectedSites}
  setSelectedWebsites={setSites}
/>

// ClientTypeSelector usage  
<ClientTypeSelector
  selectedClientType={clientType}
  setSelectedClientType={setClientType}
/>

// ScrapingSimulation usage
{isSearching && (
  <ScrapingSimulation websites={selectedWebsites} />
)}
```

## 🎨 Sistema de Animaciones

### Entrada de Componentes
- **fadeInUp**: Componentes principales (0.3s-0.6s)
- **slideInDown**: Alertas y notificaciones (0.3s)
- **fadeInScale**: Estados de éxito/error (0.4s)

### Interacciones
- **hover**: Transform scale/translate + box-shadow
- **focus**: Outline con colores RitterMor
- **active**: Pressed state feedback

### Progreso y Loading
- **shimmer**: Efecto en barra de progreso (2s infinite)
- **spin**: Loading spinners (1s linear infinite)
- **bounce**: Activity indicators (1.5s infinite)
- **pulse**: Loading text (1.5s infinite)

## 📱 Responsive Design

### Breakpoints:
- **Mobile**: < 640px
- **Tablet**: < 768px  
- **Desktop**: > 768px

### Adaptaciones móviles:
- Grid 2→1 columnas en `configGrid`
- Botones full-width en móvil
- Reducción de padding y font-sizes
- Touch-optimized tap targets (min 44px)

## ♿ Accesibilidad

### Soporte implementado:
- **High contrast mode**: Media query support
- **Reduced motion**: Animations disabled when requested
- **Focus visible**: Enhanced focus indicators
- **ARIA labels**: Semantic markup
- **Color independence**: No information conveyed by color alone

### Ejemplos:
```css
@media (prefers-contrast: high) {
  .searchButton {
    border: 2px solid #000;
  }
}

@media (prefers-reduced-motion: reduce) {
  .searchForm { animation: none; }
}
```

## 🚀 Performance Optimizations

### CSS Optimizations:
- **GPU acceleration**: `transform` and `opacity` only
- **Efficient selectors**: Specific class targeting
- **Reduced reflows**: Transform instead of layout changes
- **Tree-shaking**: Modular CSS approach

### Animation Performance:
- **will-change**: Hint browser for optimization
- **Hardware acceleration**: 3D transforms when beneficial
- **Debounced interactions**: Prevent excessive re-renders

## 🎯 Características Especiales

### RitterMor Brand Integration:
- Colores consistentes en toda la feature
- Gradientes dorados en elementos de progreso
- Tipografía acorde al design system
- Iconografía coherente con la marca

### Smart Interactions:
- Shimmer effect en botón principal
- Progressive disclosure en formularios
- Contextual feedback messages
- Real-time progress simulation

### Modern CSS Features:
- CSS Custom Properties para theming
- CSS Grid para layouts
- Flexbox para componentes
- CSS Animations con performance

## 📊 Testing y Quality Assurance

### Cross-browser testing:
- Chrome/Safari/Firefox compatibility
- Mobile Safari optimizations
- Progressive enhancement

### Performance monitoring:
- Animation performance metrics
- CSS bundle size optimization
- Render time measurements

---

**💡 Nota**: Este sistema CSS está diseñado para máxima modularidad y reutilización, manteniendo la consistencia visual con RitterMor mientras ofrece flexibilidad para futuras extensiones de la feature de search. 

**💡 Sistema CSS modular con RitterMor design system integrado.** 