# 📧 Test Scripts - RitterFinder Campaign Service

Este directorio contiene scripts de prueba para el servicio de campañas de email usando Mailjet.

## 🚀 Scripts Disponibles

### `test-mailjet-campaign.js`
Script principal para probar el envío de campañas de email usando la API de Mailjet.

**Características:**
- ✅ Envío de emails personalizados
- ✅ Template HTML responsive
- ✅ Variables dinámicas
- ✅ Versión texto plano
- ✅ Logging detallado
- ✅ Manejo de errores

### `run-test.sh`
Script de automatización para instalar dependencias y ejecutar la prueba.

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm
- Credenciales de Mailjet configuradas

## 🔧 Instalación y Ejecución

### Opción 1: Script Automatizado (Recomendado)

```bash
# Navegar al directorio scripts
cd scripts

# Ejecutar script automatizado
./run-test.sh
```

### Opción 2: Manual

```bash
# Navegar al directorio scripts
cd scripts

# Instalar dependencias
npm install

# Ejecutar prueba
node test-mailjet-campaign.js
```

## 📧 Emails de Prueba

El script enviará emails a estos destinatarios:

| Email | Nombre | Empresa | Actividad |
|-------|--------|---------|-----------|
| itsjhonalex@gmail.com | Jhon Alex | Tech Solutions SL | desarrollo de software |
| eberburn@gmail.com | Eber Burn | Green Energy Corp | energías renovables |
| rodrj0184@gmail.com | Rodrigo Jiménez | Industrial Services SA | consultoría industrial |

## 🎨 Template de Email

El script incluye un template profesional con:

- **Header**: Logo y branding de RitterFinder
- **Contenido**: Mensaje personalizado por empresa
- **Estadísticas**: Métricas de ahorro y beneficios
- **CTA**: Botón de llamada a la acción
- **Footer**: Información legal y unsubscribe

### Variables Personalizadas

El template usa estas variables que se reemplazan automáticamente:

- `{{contact_name}}` - Nombre del contacto
- `{{company_name}}` - Nombre de la empresa
- `{{activity}}` - Actividad de la empresa
- `{{category}}` - Categoría del sector
- `{{state}}` - Provincia/Estado
- `{{contact_email}}` - Email del contacto
- `{{service_type}}` - Tipo de servicio energético
- `{{estimated_savings}}` - Ahorro estimado
- `{{roi_period}}` - Período de retorno
- `{{co2_reduction}}` - Reducción de CO₂
- `{{consultant_name}}` - Nombre del consultor
- `{{consultant_title}}` - Cargo del consultor

## 🔍 Logging y Debugging

El script proporciona logs detallados:

```
🚀 Iniciando envío de campaña de prueba...
📧 Enviando a 3 destinatarios:
   - itsjhonalex@gmail.com (Jhon Alex - Tech Solutions SL)
   - eberburn@gmail.com (Eber Burn - Green Energy Corp)
   - rodrj0184@gmail.com (Rodrigo Jiménez - Industrial Services SA)

📤 Enviando a Mailjet API...
✅ Campaña enviada exitosamente!

📊 Resultados:
   - Mensajes enviados: 3
   - itsjhonalex@gmail.com: ✅ Enviado
     ID: 123456789
   - eberburn@gmail.com: ✅ Enviado
     ID: 123456790
   - rodrj0184@gmail.com: ✅ Enviado
     ID: 123456791

🎉 ¡Prueba completada! Revisa las bandejas de entrada.
```

## ⚙️ Configuración

### Credenciales de Mailjet

Las credenciales están configuradas en el script:

```javascript
const MAILJET_CONFIG = {
  apiKey: 'bd27d1f8c3533a3f812cb4faf2b5e9b1',
  apiSecret: 'c1355ff54acd472548d52ac1379cc7b0',
  baseUrl: 'https://api.mailjet.com/v3'
};
```

### Personalización

Puedes modificar:

- **Destinatarios**: Edita el array `TEST_LEADS`
- **Template**: Modifica `CAMPAIGN_DATA`
- **Variables**: Ajusta la función `personalizeContent`

## 🛠️ Troubleshooting

### Error: "fetch is not defined"
```bash
npm install node-fetch@2
```

### Error: "Unauthorized"
- Verifica que las credenciales de Mailjet sean correctas
- Asegúrate de que la cuenta tenga permisos de envío

### Error: "Rate limit exceeded"
- Mailjet tiene límites de envío por minuto
- Espera unos minutos antes de reintentar

## 📊 Monitoreo

### Dashboard de Mailjet
- Accede a [app.mailjet.com](https://app.mailjet.com)
- Ve a "Activity" para ver el estado de los emails
- Revisa "Statistics" para métricas detalladas

### Webhooks (Opcional)
Para recibir notificaciones en tiempo real, configura webhooks:

```javascript
// Endpoint para recibir eventos
app.post('/webhooks/mailjet', (req, res) => {
  const { event, email, campaign_id } = req.body;
  console.log(`Evento: ${event} para ${email}`);
  res.status(200).send('OK');
});
```

## 🔒 Seguridad

- Las credenciales están hardcodeadas solo para pruebas
- En producción, usa variables de entorno
- No compartas las credenciales de API

## 📈 Próximos Pasos

1. **Integración con el módulo**: Conectar con `useEmailComposer`
2. **Templates dinámicos**: Cargar desde base de datos
3. **Métricas avanzadas**: Tracking de apertura y clicks
4. **A/B Testing**: Variantes de campañas
5. **Segmentación**: Filtros por industria/ubicación

---

**Nota**: Este script es solo para pruebas. Para uso en producción, implementa las mejores prácticas de seguridad y manejo de errores. 