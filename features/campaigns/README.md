# 🚀 Feature: Campaigns

## Descripción

El módulo de campañas permite crear y gestionar campañas de email marketing personalizadas. Incluye un sistema completo de templates, personalización dinámica y seguimiento de envíos.

## ✨ Características Principales

### 📧 Editor de Emails Avanzado
- **Modo Texto y HTML**: Soporte completo para ambos formatos
- **Variables Dinámicas**: Sistema de personalización automática
- **Templates Predefinidos**: Colección de templates profesionales
- **Preview en Tiempo Real**: Vista previa personalizada por lead

### 🎯 Personalización Inteligente
- **Variables Automáticas**: Todas las propiedades del lead disponibles
- **Saludos Personalizados**: Generación automática de saludos
- **Información de Empresa**: Datos completos de la empresa
- **Validación de Datos**: Indicadores de calidad de información

### 📊 Gestión de Campañas
- **Historial Completo**: Seguimiento de todas las campañas
- **Estadísticas Detalladas**: Métricas de envío y apertura
- **Duplicación de Campañas**: Reutilización de templates exitosos
- **Cola de Envío**: Sistema de envío programado

## 🔧 Variables Dinámicas Disponibles

### Información de Contacto
```javascript
{{lead.contact_name}}      // Nombre del contacto
{{lead.contact_email}}     // Email del contacto  
{{lead.contact_phone}}     // Teléfono del contacto
```

### Información de Empresa
```javascript
{{lead.company_name}}      // Nombre de la empresa
{{lead.company_website}}   // Sitio web de la empresa
{{lead.company_description}} // Descripción de la empresa
```

### Ubicación
```javascript
{{lead.address}}           // Dirección completa
{{lead.state}}            // Estado/Provincia
{{lead.country}}          // País
{{lead.location_display}} // Ubicación formateada
```

### Actividad y Categoría
```javascript
{{lead.activity}}          // Actividad principal
{{lead.category}}         // Categoría de la empresa
{{lead.industry}}         // Industria
```

### Saludos Personalizados
```javascript
{{lead.greeting}}         // Saludo formal personalizado
{{lead.formal_greeting}}  // Saludo formal
{{lead.casual_greeting}}  // Saludo casual
```

### Validación de Datos
```javascript
{{lead.email_validated}}  // Email validado (Sí/No)
{{lead.phone_validated}}  // Teléfono validado (Sí/No)
{{lead.website_exists}}   // Sitio web existe (Sí/No)
{{lead.data_quality_score}} // Puntuación de calidad (1-5)
{{lead.data_quality_percentage}} // Porcentaje de calidad
```

### Información del Sistema
```javascript
{{lead.created_at}}       // Fecha de creación
{{lead.updated_at}}       // Fecha de actualización
{{lead.last_contacted_at}} // Último contacto
{{lead.tags}}            // Tags asociados
{{lead.score}}           // Puntuación del lead
{{lead.status}}          // Estado del lead
```

## 📝 Ejemplo de Uso

```html
{{lead.greeting}},

Hemos identificado a {{lead.company_name}} como una empresa dedicada a {{lead.activity}} ubicada en {{lead.location_display}}.

Basándonos en su actividad de {{lead.activity}} y ubicación en {{lead.state}}, creemos que nuestras soluciones pueden ser de gran valor para {{lead.company_name}}.

¿Le interesaría conocer más detalles?

Cordialmente,
Equipo RitterFinder
```

## 🎨 Templates Incluidos

### 1. Propuesta Comercial Premium
- **Categoría**: Sales
- **Variables**: service_name, service_price, implementation_time
- **Uso**: Envío de propuestas comerciales detalladas

### 2. Follow-up Post Reunión
- **Categoría**: Follow-up
- **Variables**: meeting_date, meeting_topic, next_steps
- **Uso**: Seguimiento después de reuniones

### 3. Newsletter Mensual
- **Categoría**: Marketing
- **Variables**: month, year, news_content
- **Uso**: Newsletters regulares

### 4. Bienvenida Nuevo Cliente
- **Categoría**: Welcome
- **Variables**: client_name, account_manager
- **Uso**: Onboarding de nuevos clientes

### 5. Energías Renovables - Consultoría
- **Categoría**: Sales
- **Variables**: service_type, estimated_savings, roi_period
- **Uso**: Especializado en sector energético

### 6. Template Personalizado Simple
- **Categoría**: Custom
- **Variables**: Completamente personalizable
- **Uso**: Cualquier propósito

### 7. Template con Variables Dinámicas
- **Categoría**: Sales
- **Variables**: Todas las variables lead.* automáticas
- **Uso**: Demostración de personalización completa

## 🔄 Flujo de Trabajo

### 1. Selección de Leads
- Selecciona los leads desde la página de resultados
- Valida la información de contacto
- Revisa la calidad de datos

### 2. Creación de Campaña
- Elige un template o crea uno nuevo
- Personaliza el contenido con variables dinámicas
- Configura el asunto y remitente

### 3. Preview y Validación
- Revisa la vista previa personalizada
- Valida que las variables se reemplacen correctamente
- Ajusta el contenido según sea necesario

### 4. Envío y Seguimiento
- Envía la campaña
- Monitorea el progreso en tiempo real
- Revisa las estadísticas de envío

## 📊 Componentes Principales

### ComposeTab
- Editor principal de emails
- Sistema de variables dinámicas
- Preview en tiempo real
- Validación de contenido

### PreviewTab
- Vista previa personalizada por lead
- Selector avanzado de leads con información detallada
- Información completa del lead seleccionado
- Estadísticas de la campaña
- Indicadores de validación de datos
- Preview en modo HTML y texto
- Información de variables utilizadas

### RecipientsTab
- Lista de destinatarios
- Información detallada de cada lead
- Indicadores de calidad de datos
- Validación de contactos

### EmailHistory
- Historial completo de campañas
- Estadísticas de envío
- Duplicación de campañas
- Filtros y búsqueda

### CampaignNotifications
- Notificaciones de estado
- Alertas de envío
- Confirmaciones de entrega
- Manejo de errores

## 🎯 Hooks Principales

### useEmailComposer
- Gestión del estado del editor
- Personalización de contenido
- Validación de formularios
- Envío de campañas

### useEmailTemplates
- Gestión de templates
- Filtros y búsqueda
- Creación y edición
- Estadísticas de uso

### useEmailQueue
- Cola de envío
- Control de velocidad
- Manejo de errores
- Estimaciones de tiempo

### useLeadAdapter
- Adaptación de datos de leads
- Validación de contactos
- Normalización de información
- Compatibilidad con campañas

## 🚀 Mejoras Recientes

### Variables Dinámicas Avanzadas
- ✅ Soporte completo para todas las propiedades del lead
- ✅ Variables computadas automáticamente
- ✅ Saludos personalizados inteligentes
- ✅ Indicadores de calidad de datos

### Interfaz Mejorada
- ✅ Componente de variables disponibles
- ✅ Copia al portapapeles con un clic
- ✅ Tooltips informativos
- ✅ Categorización visual de variables

### Templates Profesionales
- ✅ Templates específicos por industria
- ✅ Variables automáticas en todos los templates
- ✅ Ejemplos de uso real
- ✅ Documentación completa

## 🔮 Próximas Mejoras

- [ ] A/B Testing de campañas
- [ ] Segmentación avanzada
- [ ] Automatización de campañas
- [ ] Integración con CRM
- [ ] Analytics avanzados
- [ ] Templates por industria específica

## 📚 Recursos Adicionales

- [Guía de Variables Dinámicas](./VARIABLES.md)
- [Templates Profesionales](./TEMPLATES.md)
- [Mejores Prácticas](./BEST_PRACTICES.md)
- [API de Campañas](./API.md) 

## 🎨 **ComposeTab - Composición de Emails**

### **Funcionalidades Principales**

#### **1. Modo de Contenido**
- **Texto Plano**: Para emails simples sin formato
- **HTML**: Para emails con diseño profesional
- **Toggle Switch**: Cambio fácil entre modos

#### **2. Selector de Plantillas HTML** ✨
- **Solo visible en modo HTML**
- **Plantilla disponible**:
  - 📧 **Contacto Inicial**: Template básico para primer contacto con leads

- **Información de la plantilla**:
  - Nombre y descripción
  - Diseño limpio y profesional
  - Compatible con variables dinámicas

- **Carga automática**:
  - Al seleccionar plantilla → se carga en el editor
  - Si no hay asunto → se carga el asunto de la plantilla
  - Listo para editar y personalizar

#### **3. Variables Dinámicas**
- **Botón "Mostrar Variables"**: Toggle para mostrar/ocultar
- **Categorías organizadas**:
  - 📧 Información de Contacto
  - 🏢 Información de Empresa  
  - 📍 Ubicación
  - 🏭 Actividad y Categoría
  - 👋 Saludos Personalizados
  - ✅ Validación de Datos

- **Funcionalidades**:
  - **Clic para copiar**: Copia variable al portapapeles
  - **Inserción automática**: Se inserta en el cursor
  - **Tooltips informativos**: Descripción de cada variable
  - **Iconos visuales**: Fácil identificación por categoría

#### **4. Editor de Contenido**
- **Textarea responsivo**: Se adapta al contenido
- **Modo HTML**: Soporte para etiquetas HTML y CSS inline
- **Placeholder dinámico**: Cambia según el modo
- **Validación en tiempo real**: Advertencias sobre longitud

#### **5. Validación y Feedback**
- **Validación de asunto**: Advertencia si es muy largo (>78 caracteres)
- **Validación de contenido**: Verifica que no esté vacío
- **Modo HTML**: Información sobre uso de HTML
- **Variables**: Sugerencias de uso

#### **6. Información de Envío**
- **Contador de destinatarios**: Muestra total de leads
- **Tiempo estimado**: "Envío inmediato"
- **Modo actual**: Texto o HTML
- **Botón de envío**: Con estado de carga

### **Flujo de Trabajo Recomendado**

1. **Seleccionar modo HTML** si quieres diseño profesional
2. **Elegir una plantilla** del selector (solo en modo HTML)
3. **Personalizar el contenido** con variables dinámicas
4. **Revisar en la pestaña Vista Previa**
5. **Enviar la campaña**

### **Ejemplo de Uso**

```typescript
// El usuario cambia a modo HTML
updateField('contentMode', 'html')

// Aparece el selector de plantillas
// Usuario selecciona "Template con Variables Dinámicas"

// Se carga automáticamente:
updateField('content', template.htmlContent)
updateField('subject', template.subject)

// Usuario puede editar y personalizar
// Usar variables como {{lead.company_name}}
``` 

## 📧 **Sistema de Unsubscribe**

### **Base de Datos - Tabla unsubscribe**

```sql
-- Crear tabla unsubscribe en Supabase
CREATE TABLE public.unsubscribe (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    unsubscribe_reason VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX idx_unsubscribe_email ON public.unsubscribe(email);
CREATE INDEX idx_unsubscribe_created_at ON public.unsubscribe(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.unsubscribe ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones públicas
CREATE POLICY "Allow public inserts" ON public.unsubscribe
    FOR INSERT WITH CHECK (true);

-- Política para permitir consultas públicas (solo para verificar si existe)
CREATE POLICY "Allow public select" ON public.unsubscribe
    FOR SELECT USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_unsubscribe_updated_at 
    BEFORE UPDATE ON public.unsubscribe 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Vista Pública - Página de Unsubscribe**

La vista pública se encuentra en: `/unsubscribe?email=correo@ejemplo.com`

#### **Características:**
- **Confirmación visual**: Pregunta de confirmación clara
- **Información del email**: Muestra qué email se va a dar de baja
- **Botones de acción**: Confirmar o Cancelar
- **Feedback visual**: Mensaje de éxito después de confirmar
- **Redirección**: Opción de volver al sitio principal

#### **Flujo de Trabajo:**
1. Usuario hace clic en enlace de unsubscribe
2. Se abre página con confirmación
3. Usuario confirma la baja
4. Se guarda en tabla `unsubscribe`
5. Se muestra mensaje de éxito
6. Opción de volver al sitio principal

### **Variables de Entorno Requeridas**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
``` 