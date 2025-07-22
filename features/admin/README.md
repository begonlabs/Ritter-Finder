# 🎯 Admin Feature - RitterFinder

## 📋 Descripción

El módulo de administración de RitterFinder permite gestionar usuarios, roles, plantillas y ahora también la importación de leads. Incluye funcionalidades completas de gestión administrativa con una nueva sección para importar y crear leads directamente desde la plataforma.

## ✨ Características Principales

### 👥 Gestión de Usuarios
- **Crear usuarios**: Formulario completo con validación
- **Gestión de roles**: Asignación y cambio de roles
- **Estados de usuario**: Activo, inactivo, suspendido
- **Búsqueda y filtros**: Filtrado avanzado de usuarios

### 🛡️ Gestión de Roles
- **Roles del sistema**: Roles predefinidos con permisos
- **Asignación masiva**: Cambiar roles de múltiples usuarios
- **Historial de cambios**: Seguimiento de cambios de roles
- **Permisos granulares**: Control detallado de permisos

### 📧 Gestión de Plantillas
- **Plantillas HTML**: Crear y editar plantillas de email
- **Categorías**: Organización por tipo de plantilla
- **Vista previa**: Renderizado en tiempo real
- **Variables dinámicas**: Soporte para personalización

### 🗄️ **NUEVO: Importación de Leads**
- **Creación manual**: Formulario completo para crear leads individuales
- **Importación CSV**: Subir archivos CSV con datos de leads
- **Validación automática**: Verificación de datos en tiempo real
- **Vista previa**: Revisar datos antes de importar
- **Plantilla descargable**: CSV de ejemplo para guiar la importación

## 🏗️ Arquitectura

### Componentes Principales

```
components/
├── AdminDashboard.tsx      # Dashboard principal con tabs
├── UserManagement.tsx      # Gestión de usuarios
├── RoleManagement.tsx      # Gestión de roles
├── TemplateManagement.tsx  # Gestión de plantillas
├── LeadImport.tsx         # 🆕 Importación de leads
└── ConfirmDialog.tsx      # Diálogos de confirmación
```

### Hooks Personalizados

```
hooks/
├── useAdmin.ts            # Utilidades generales de admin
├── useUserManagement.ts   # Lógica de gestión de usuarios
├── useRoleManagement.ts   # Lógica de gestión de roles
├── useLeadImport.ts      # 🆕 Lógica de importación de leads
└── useConfirmDialog.ts   # Gestión de diálogos
```

## 🗄️ Importación de Leads

### Características de la Nueva Funcionalidad

La importación de leads está implementada con las siguientes características:

- **Creación Manual**: Formulario completo para crear leads uno por uno
- **Importación CSV**: Subir archivos CSV con múltiples leads
- **Validación Inteligente**: Verificación automática de datos
- **Vista Previa**: Revisar datos antes de confirmar
- **Plantilla Descargable**: CSV de ejemplo con estructura correcta

### Estructura de Datos

Los leads siguen la estructura de la base de datos:

```typescript
interface LeadData {
  company_name: string          // Obligatorio
  email?: string               // Opcional
  verified_email: boolean      // Estado de verificación
  phone?: string              // Opcional
  verified_phone: boolean     // Estado de verificación
  company_website?: string    // Opcional
  verified_website: boolean   // Estado de verificación
  address?: string           // Opcional
  state?: string            // Opcional
  country?: string          // Opcional
  activity: string         // Obligatorio
  description?: string     // Opcional
  category?: string       // Opcional
  data_quality_score?: number // 1-5
  created_at?: string    // Timestamp
}
```

### Uso del Hook useLeadImport

```typescript
import { useLeadImport } from '../hooks/useLeadImport'

const {
  leads,                    // Lista de leads cargados
  isLoading,               // Estado de carga
  error,                   // Errores de validación
  validationErrors,        // Errores específicos por campo
  importFromCSV,          // Función para importar CSV
  createLead,             // Función para crear lead manual
  downloadTemplate,       // Descargar plantilla CSV
  clearLeads              // Limpiar leads cargados
} = useLeadImport()
```

### Componente LeadImport

```typescript
import { LeadImport } from './LeadImport'

<LeadImport className="my-custom-class" />
```

## 🎯 Implementación de Importación de Leads

### Características Implementadas

1. **Tres Modos de Trabajo**:
   - **Creación Manual**: Formulario completo para leads individuales
   - **Importación CSV**: Subir archivos con múltiples leads
   - **Vista Previa**: Revisar datos antes de confirmar

2. **Validación Automática**:
   - Campos obligatorios (company_name, activity)
   - Validación de email y URL
   - Score de calidad (1-5)
   - Verificación de formato CSV

3. **Experiencia de Usuario**:
   - Drag & drop para archivos CSV
   - Vista previa en tiempo real
   - Mensajes de error claros
   - Plantilla descargable

### Código de Ejemplo

```typescript
// Importar desde CSV
const handleFileUpload = (file: File) => {
  importFromCSV(file)
}

// Crear lead manual
const handleCreateLead = async (leadData: LeadData) => {
  try {
    await createLead(leadData)
    // Mostrar éxito
  } catch (error) {
    // Manejar error
  }
}

// Descargar plantilla
const handleDownloadTemplate = () => {
  downloadTemplate()
}
```

## 🎨 Estilos

### CSS Modules

Los estilos están organizados en módulos CSS:

- `LeadImport.module.css`: Estilos del componente de importación
- `AdminDashboard.module.css`: Estilos actualizados para 4 tabs

### Características de Diseño

- **Responsive**: Adaptado para diferentes tamaños de pantalla
- **Accesibilidad**: Soporte para alto contraste y movimiento reducido
- **Animaciones**: Transiciones suaves y feedback visual
- **Consistencia**: Mantiene el diseño del sistema RitterFinder

## 🚀 Uso

### Importación

```typescript
import { LeadImport, useLeadImport } from '@/features/admin'
```

### Implementación Básica

```typescript
function AdminPage() {
  return (
    <AdminDashboard />
  )
}
```

## 🔧 Configuración

### Dependencias Requeridas

```bash
# Instalar papaparse para parsing de CSV
pnpm add papaparse @types/papaparse
```

### Variables de Entorno

```bash
# Configuración de la base de datos
DATABASE_URL="postgresql://..."
```

## 📈 Mejoras Futuras

- [ ] **API Integration**: Conectar con endpoints reales
- [ ] **Bulk Operations**: Operaciones masivas en leads
- [ ] **Advanced Validation**: Validación más sofisticada
- [ ] **Import History**: Historial de importaciones
- [ ] **Data Mapping**: Mapeo personalizado de campos CSV
- [ ] **Progress Tracking**: Barra de progreso para importaciones grandes

## 🤝 Contribución

Para contribuir a esta feature:

1. Sigue las convenciones de código establecidas
2. Mantén los archivos modulares (máximo 200 líneas)
3. Usa TypeScript para todos los componentes
4. Incluye tests para nuevas funcionalidades
5. Documenta cambios en este README

## 📝 Notas Técnicas

- **CSV Parsing**: Usa papaparse para parsing robusto de CSV
- **Validation**: Validación en tiempo real con feedback inmediato
- **Performance**: Lazy loading y optimización para archivos grandes
- **UX**: Drag & drop, vista previa y mensajes claros
- **Accessibility**: Cumple con estándares WCAG 2.1 