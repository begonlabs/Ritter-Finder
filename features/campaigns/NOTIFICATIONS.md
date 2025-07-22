# 🔔 Sistema de Notificaciones con Brevo

## 📋 Descripción

El sistema de notificaciones de RitterFinder utiliza **Brevo** (anteriormente Sendinblue) para enviar emails de notificación a los usuarios sobre el estado de sus campañas y eventos del sistema.

## 🏗️ Arquitectura

### Endpoint de Notificaciones
- **Archivo**: `pages/api/notifications/email.ts`
- **Función**: Envía emails usando el servicio de Brevo
- **Método**: POST
- **Parámetros**: `to`, `subject`, `message`, `htmlContent?`, `name?`

### Hook de Notificaciones
- **Archivo**: `features/campaigns/hooks/useNotifications.ts`
- **Función**: Maneja el estado y envío de notificaciones
- **Métodos disponibles**:
  - `sendNotification()` - Envío genérico
  - `sendSystemNotification()` - Notificaciones del sistema
  - `sendCampaignNotification()` - Notificaciones de campañas
  - `sendWelcomeNotification()` - Emails de bienvenida

### Componente de Notificaciones
- **Archivo**: `features/campaigns/components/CampaignNotifications.tsx`
- **Función**: UI para gestionar notificaciones de campañas
- **Características**: Estado visual, botones de prueba, historial

## 🚀 Uso Básico

### 1. Hook de Notificaciones

```typescript
import { useNotifications } from '@/features/campaigns'

function MyComponent() {
  const { 
    isSending, 
    lastResult, 
    sendNotification, 
    sendCampaignNotification 
  } = useNotifications()

  const handleSendNotification = async () => {
    const result = await sendCampaignNotification(
      'user@example.com',
      'Mi Campaña',
      'Enviada'
    )
    
    if (result.success) {
      console.log('✅ Notificación enviada:', result.messageId)
    }
  }

  return (
    <button onClick={handleSendNotification}>
      Enviar Notificación
    </button>
  )
}
```

### 2. Componente de Notificaciones

```typescript
import { CampaignNotifications } from '@/features/campaigns'

function CampaignPage() {
  return (
    <CampaignNotifications
      campaign={campaignData}
      userEmail="user@example.com"
      userName="Juan Pérez"
      onNotificationSent={(success) => {
        console.log('Notification result:', success)
      }}
    />
  )
}
```

### 3. Integración en Campañas

```typescript
// En CampaignIntegration.tsx
const { sendCampaignNotification } = useNotifications()

const handleSendCampaign = async (campaignData: Campaign) => {
  // ... lógica de envío de campaña
  
  // Enviar notificación
  if (userEmail) {
    await sendCampaignNotification(
      userEmail,
      campaignData.subject,
      'Iniciada'
    )
  }
}
```

## 📧 Tipos de Notificaciones

### 1. Notificaciones de Sistema
```typescript
await sendSystemNotification(
  'user@example.com',
  'Actualización del Sistema',
  'Se ha actualizado la plataforma con nuevas funcionalidades.'
)
```

### 2. Notificaciones de Campaña
```typescript
await sendCampaignNotification(
  'user@example.com',
  'Newsletter Enero 2025',
  'Enviada'
)
```

### 3. Emails de Bienvenida
```typescript
await sendWelcomeNotification(
  'user@example.com',
  'Juan Pérez'
)
```

## 🎨 Plantillas HTML

El sistema incluye plantillas HTML predefinidas para cada tipo de notificación:

### Sistema
- Fondo gris claro
- Logo de RitterFinder
- Información del sistema
- Footer con contacto

### Campañas
- Detalles de la campaña
- Estado y fecha
- Enlaces al dashboard
- Métricas de rendimiento

### Bienvenida
- Gradiente de colores
- Lista de funcionalidades
- Mensaje motivacional
- Información de contacto

## ⚙️ Configuración

### Variables de Entorno
```bash
# Brevo Configuration
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=info@rittermor.energy
BREVO_SENDER_NAME=RitterFinder Team

# Public Configuration
NEXT_PUBLIC_BREVO_SENDER_EMAIL=info@rittermor.energy
NEXT_PUBLIC_BREVO_SENDER_NAME=RitterFinder Team
```

### Validación de Configuración
```typescript
import { brevoService } from '@/lib/brevo-service'

// Validar configuración
const isValid = await brevoService.validateConfiguration()
console.log('Brevo config valid:', isValid)
```

## 🔍 Monitoreo y Logs

### Logs del Endpoint
```typescript
// En pages/api/notifications/email.ts
console.log('📧 Enviando notificación con Brevo:', {
  to,
  subject,
  messageLength: message.length,
  hasHtmlContent: !!htmlContent
})

if (result.success) {
  console.log('✅ Notificación enviada exitosamente:', result.messageId)
} else {
  console.error('❌ Error al enviar notificación:', result.error)
}
```

### Logs del Hook
```typescript
// En useNotifications.ts
console.log('✅ Notificación de campaña enviada:', result.messageId)
console.error('❌ Error al enviar notificación:', result.error)
```

## 🛠️ Desarrollo

### Testing Local
```typescript
// Enviar notificación de prueba
const result = await sendNotification({
  to: 'test@example.com',
  subject: 'Test Notification',
  message: 'This is a test notification'
})
```

### Debugging
```typescript
// Verificar estado del hook
console.log('Notification state:', {
  isSending,
  lastResult
})
```

## 📊 Métricas

### Información de Envío
- **Message ID**: Identificador único del email
- **Timestamp**: Fecha y hora de envío
- **Status**: Éxito o error
- **Error Details**: Descripción del error si falla

### Rate Limits
- **25 emails/hora** por cuenta
- **100 emails/día** por cuenta
- **Pausa automática** entre envíos

## 🔧 Troubleshooting

### Error: API Key no configurada
```bash
# Verificar variables de entorno
echo $BREVO_API_KEY
echo $BREVO_SENDER_EMAIL
```

### Error: Email inválido
```typescript
// Validación de formato
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(to)) {
  return { error: 'Invalid email format' }
}
```

### Error: Rate limit excedido
```typescript
// Pausa entre envíos
await new Promise(resolve => setTimeout(resolve, 100))
```

## 📚 Referencias

- [Brevo API Documentation](https://developers.brevo.com/)
- [Email Templates](https://developers.brevo.com/reference/sendtransacemail)
- [Rate Limits](https://developers.brevo.com/reference/sendtransacemail#rate-limits)

## 🎯 Próximas Mejoras

1. **Plantillas Dinámicas**: Cargar plantillas desde base de datos
2. **Notificaciones Push**: Integrar con servicio de push notifications
3. **Programación**: Enviar notificaciones en horarios específicos
4. **Analytics**: Tracking de apertura y clicks
5. **Personalización**: Variables dinámicas en plantillas 