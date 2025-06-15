# 🌟 Onboarding Feature

Este feature contiene el sistema de onboarding para Ritter Finder, diseñado para guiar a los nuevos usuarios a través de las funcionalidades principales de la plataforma.

## 📁 Estructura

```
features/onboarding/
├── components/
│   ├── OnboardingModal.tsx    # Componente principal del modal
│   └── index.ts              # Exportaciones de componentes
├── hooks/
│   ├── useOnboarding.ts      # Hook personalizado con toda la lógica
│   └── index.ts              # Exportaciones de hooks
├── pages/
│   └── OnboardingPage.tsx    # Página wrapper (opcional)
├── styles/
│   └── OnboardingModal.module.css  # Estilos CSS Modules
├── types/
│   └── index.ts              # Definiciones de TypeScript
├── index.tsx                 # Exportaciones principales del feature
└── README.md                 # Esta documentación
```

## 🎯 Funcionalidades

- **Modal interactivo** con 6 pasos explicativos
- **Navegación fluida** entre pasos (anterior/siguiente)
- **Indicadores visuales** del progreso
- **Persistencia** - Se muestra solo una vez por usuario
- **Responsive design** adaptado a móviles
- **Animaciones suaves** y transiciones elegantes
- **Estilo consistente** con el tema de Ritter Finder

## 🚀 Uso

```tsx
import { OnboardingModal } from "@/features/onboarding"

function App() {
  return (
    <div>
      <OnboardingModal />
      {/* Resto de la aplicación */}
    </div>
  )
}
```

## ⚙️ Configuración

El onboarding se activa automáticamente para usuarios nuevos después de 2 segundos. Los pasos están definidos en `hooks/useOnboarding.ts` y utilizan el sistema de internacionalización.

### Pasos incluidos:
1. **Bienvenida** - Introducción a Ritter Finder
2. **Búsqueda** - Cómo buscar leads
3. **Resultados** - Visualización de resultados
4. **Campañas** - Creación de campañas de email
5. **Email** - Composición de emails
6. **Historial** - Analytics e historial

## 🔧 Personalización

Para modificar los pasos del onboarding, edita el array `steps` en `hooks/useOnboarding.ts`:

```typescript
const steps: OnboardingStep[] = [
  {
    title: t("onboarding.welcome.title"),
    description: t("onboarding.welcome.description"),
    image: "/ruta/a/imagen.png",
  },
  // ... más pasos
]
```

## 📱 Estados

- **Desactivado temporalmente** en DashboardPage.tsx
- **Listo para activar** cuando el cliente lo decida
- **Completamente funcional** y testeado

## 🎨 Estilo

Los estilos siguen el tema de Ritter Finder:
- **Color principal**: Dorado (#fbbf24)
- **Overlay opaco**: Para mejor visibilidad
- **Animaciones suaves**: Entrada y transiciones
- **CSS Modules**: Para evitar conflictos de estilos

## 🔄 Activación/Desactivación

Para **activar** el onboarding:
```tsx
// En features/dashboard/pages/DashboardPage.tsx
import { OnboardingModal } from "@/features/onboarding"

// Y en el render:
<OnboardingModal />
```

Para **desactivar** el onboarding:
```tsx
// Comentar la importación y el componente
// import { OnboardingModal } from "@/features/onboarding"
// <OnboardingModal />
```

## 📋 Estado Actual

- ✅ **Desarrollado completamente**
- ✅ **Estilos integrados con Ritter Finder**
- ✅ **Responsive y accesible**
- ⏸️ **Temporalmente desactivado**
- ⏳ **Esperando decisión del cliente**

---

*Desarrollado con ❤️ para Ritter Finder | Listo para activar cuando sea necesario* 