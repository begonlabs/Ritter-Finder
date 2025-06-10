# Campaigns Module - CSS Styles Documentation

Este directorio contiene todos los estilos CSS modulares para el módulo de campaigns de RitterFinder. Cada componente tiene su archivo CSS específico que implementa el design system de RitterMor.

## Archivos de Estilo

### 📧 EmailComposer.module.css
Estilos principales para el compositor de emails:
- **Animaciones**: `slideInUp` con entrada progresiva
- **Estados**: Estados de carga, error y éxito
- **Tabs**: Sistema de pestañas con indicadores visuales
- **Empty State**: Estado vacío con animaciones

### ✏️ ComposeTab.module.css
Estilos para la pestaña de composición:
- **Formularios**: Grid responsive con validación visual
- **Campos**: Estados focus con colores RitterMor
- **Template Buttons**: Botones para plantillas predefinidas
- **Helper Text**: Texto de ayuda con estilos sutiles

### 👥 RecipientsTab.module.css
Estilos para la gestión de destinatarios:
- **Lista de Recipients**: Animaciones escalonadas
- **Recipient Items**: Numeración con acentos dorados
- **Stats Summary**: Resumen con métricas destacadas
- **Hover Effects**: Efectos de hover con transformaciones

### 👁️ PreviewTab.module.css
Estilos para la vista previa del email:
- **Lead Selector**: Selector con estados focus
- **Email Preview**: Vista previa estilizada
- **Validation Warnings**: Alertas de validación
- **Meta Display**: Información del email organizada

### 📊 EmailHistory.module.css
Estilos para el historial de campañas:
- **Tabla Completa**: Tabla responsive con sorting visual
- **Progress Bars**: Barras de progreso con gradientes temáticos
- **Dropdown Actions**: Menús de acciones con animaciones
- **Search**: Búsqueda con iconos y estados

### 🎉 CampaignSuccess.module.css
Estilos para el estado de éxito:
- **Celebration**: Animaciones de celebración con checkmark
- **Wave Animation**: Efectos de onda para feedback positivo
- **Stats Grid**: Grid de estadísticas con animaciones escalonadas
- **Action Buttons**: Botones de acción con efectos hover

### 📄 CampaignPage.module.css
Estilos para la página principal del módulo:
- **Layout General**: Estructura de página responsive
- **Header Section**: Encabezado con títulos y descripciones
- **Content Organization**: Organización del contenido principal

## Paleta de Colores RitterMor

```css
:root {
  --ritter-gold: #F2B705;     /* Color principal dorado */
  --ritter-dark: #1A1E25;     /* Color oscuro principal */
  --ritter-light: #FFFFFF;    /* Color claro/blanco */
  --ritter-gray: #F5F5F5;     /* Color gris claro */
}
```

## Convenciones de Animación

### Entrada de Elementos
- **slideInUp**: Elementos que entran desde abajo
- **fadeIn**: Elementos que aparecen gradualmente
- **slideInDown**: Elementos que bajan desde arriba
- **slideInLeft/Right**: Elementos laterales

### Delays Escalonados
```css
.element:nth-child(1) { animation-delay: 0.1s; }
.element:nth-child(2) { animation-delay: 0.2s; }
.element:nth-child(3) { animation-delay: 0.3s; }
```

### Hover Effects
- **translateY(-2px)**: Elevación sutil
- **Sombras doradas**: `rgba(242, 183, 5, 0.3)`
- **Escalado**: `scale(1.02)` para énfasis

## Responsividad

### Breakpoints
- **Mobile**: `max-width: 640px`
- **Tablet**: `max-width: 768px`
- **Desktop**: `min-width: 1024px`

### Estrategias Mobile-First
- Grid layouts que colapsan a columna única
- Padding y margins reducidos
- Tamaños de fuente ajustados
- Elementos ocultos en mobile cuando es necesario

## Accesibilidad

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .element {
    border: 2px solid #d1d5db;
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: none;
    transition: none;
  }
}
```

## Integración con Componentes

### Uso en Componentes
```tsx
import styles from '../styles/ComponentName.module.css'

export function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Título</h1>
    </div>
  )
}
```

### Combinación con Tailwind
```tsx
<div className={`${styles.customClass} bg-white p-4`}>
  {/* Combina CSS modules con Tailwind */}
</div>
```

## Performance

### Optimizaciones
- **CSS Modules**: Tree-shaking automático
- **Animaciones GPU**: Uso de `transform` y `opacity`
- **Will-change**: Preparación para animaciones pesadas
- **Contenido lazy**: Animaciones solo cuando son visibles

### Tamaños de Archivo
- Cada archivo CSS es específico y pequeño
- No hay duplicación de estilos
- Clases reutilizables cuando es apropiado

## Mantenimiento

### Nomenclatura
- **Componente**: `.componentName`
- **Elementos**: `.componentElement`
- **Modificadores**: `.componentElement--modifier`
- **Estados**: `.componentIsActive`, `.componentIsLoading`

### Estructura Consistente
1. **Contenedor principal**
2. **Animaciones @keyframes**
3. **Elementos internos**
4. **Estados y modificadores**
5. **Responsive breakpoints**
6. **Accesibilidad**

## Testing

### Verificación Visual
- Estados hover en todos los elementos interactivos
- Animaciones suaves sin jank
- Responsive en todos los breakpoints
- Contraste adecuado en modo high contrast

### Performance Testing
- Tiempos de animación apropiados
- No bloqueo del hilo principal
- Carga rápida de estilos

## Futuras Mejoras

### Posibles Adiciones
- **Dark mode**: Esquema de colores oscuro
- **Themes**: Múltiples temas de color
- **Animation presets**: Presets de animación configurables
- **Component variants**: Variantes de componentes

### Optimizaciones
- **CSS Custom Properties**: Más variables CSS
- **Container Queries**: Queries basadas en contenedor
- **CSS Grid subgrid**: Layouts más complejos
- **View Transitions API**: Transiciones entre páginas

---

Esta implementación sigue las mejores prácticas de CSS modular y está optimizada para mantenibilidad, performance y accesibilidad. Cada componente es independiente pero mantiene consistencia visual con el design system de RitterMor. 