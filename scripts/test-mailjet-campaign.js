const fetch = require('node-fetch');

// Configuración de Mailjet
const MAILJET_CONFIG = {
  apiKey: 'bd27d1f8c3533a3f812cb4faf2b5e9b1',
  apiSecret: 'c1355ff54acd472548d52ac1379cc7b0',
  baseUrl: 'https://api.mailjet.com/v3.1' // Cambiado a v3.1
};

// Emails de prueba
const TEST_EMAILS = [
  'itsjhonalex@gmail.com',
  'eberburn@gmail.com', 
  'rodrj0184@gmail.com'
];

// Datos de la campaña de prueba
const CAMPAIGN_DATA = {
  senderName: 'RitterFinder',
  senderEmail: 'no-reply@ritterfinder.com',
  subject: '🚀 Prueba de Campaña - RitterFinder Energías Renovables',
  htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Prueba de Campaña - RitterFinder</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
        }
        .header { 
            background: linear-gradient(135deg, #F2B705 0%, #d97706 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold; 
        }
        .header p { 
            margin: 10px 0 0 0; 
            font-size: 16px; 
            opacity: 0.9; 
        }
        .content { 
            padding: 30px 20px; 
        }
        .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
        }
        .main-content { 
            font-size: 16px; 
            line-height: 1.7; 
            margin-bottom: 25px; 
        }
        .highlight-box { 
            background: #fef3c7; 
            border-left: 4px solid #F2B705; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 8px; 
        }
        .cta-button { 
            display: inline-block; 
            background: #10b981; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            margin: 20px 0; 
        }
        .footer { 
            background: #f3f4f6; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
        }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 15px; 
            margin: 25px 0; 
        }
        .stat-item { 
            text-align: center; 
            padding: 15px; 
            background: #f8fafc; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0; 
        }
        .stat-number { 
            font-size: 24px; 
            font-weight: bold; 
            color: #F2B705; 
        }
        .stat-label { 
            font-size: 12px; 
            color: #6b7280; 
            margin-top: 5px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌱 RitterFinder</h1>
            <p>Especialistas en Energías Renovables</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                <strong>Estimado/a {{contact_name}},</strong>
            </div>
            
            <div class="main-content">
                <p>Es un placer contactarle desde <strong>RitterFinder</strong>. Hemos identificado a <strong>{{company_name}}</strong> como una empresa dedicada a {{activity}} ubicada en {{state}}.</p>
                
                <p>Creemos que nuestras soluciones en energías renovables pueden ser de gran valor para su organización, especialmente considerando su actividad en el sector de {{category}}.</p>
                
                <div class="highlight-box">
                    <h3>🔋 {{service_type}} para su empresa</h3>
                    <p><strong>Ahorro estimado:</strong> {{estimated_savings}}</p>
                    <p><strong>Retorno de inversión:</strong> {{roi_period}}</p>
                    <p><strong>Reducción de CO₂:</strong> {{co2_reduction}}</p>
                </div>
                
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number">70%</div>
                        <div class="stat-label">Reducción de costes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">5-7 años</div>
                        <div class="stat-label">Retorno inversión</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">3-5 ton</div>
                        <div class="stat-label">CO₂ reducido/año</div>
                    </div>
                </div>
                
                <p>Conociendo las necesidades específicas de su empresa, podemos ofrecerle una consultoría personalizada <strong>sin compromiso</strong>.</p>
                
                <p>¿Le interesaría conocer más detalles sobre cómo las energías renovables pueden transformar el consumo energético de {{company_name}}?</p>
            </div>
            
            <a href="https://ritterfinder.com/contacto" class="cta-button">
                📞 Solicitar Consultoría Gratuita
            </a>
            
            <p>Cordialmente,<br>
            <strong>{{consultant_name}}</strong><br>
            {{consultant_title}}<br>
            RitterFinder - Consultoría Energética</p>
        </div>
        
        <div class="footer">
            <p>🌍 © 2025 RitterFinder. Especialistas en transición energética.</p>
            <p>Este email fue enviado a {{contact_email}}</p>
            <p>Si no desea recibir más emails, puede <a href="#">darse de baja aquí</a></p>
        </div>
    </div>
</body>
</html>`,
  textContent: `
🌱 RITTERFINDER - CONSULTORÍA EN ENERGÍAS RENOVABLES

Estimado/a {{contact_name}},

Hemos identificado a {{company_name}} como una empresa dedicada a {{activity}} ubicada en {{state}}. Creemos que nuestras soluciones en energías renovables pueden ser de gran valor para su organización.

🔋 {{service_type}} para su empresa:
- Ahorro estimado: {{estimated_savings}}
- Retorno de inversión: {{roi_period}}  
- Reducción de CO₂: {{co2_reduction}}

BENEFICIOS ESPECÍFICOS PARA {{category}}:
✅ Reducción de costes energéticos hasta un 70%
✅ Independencia energética y sostenibilidad
✅ Cumplimiento de normativas medioambientales
✅ Mejora de la imagen corporativa
✅ Subvenciones y incentivos fiscales disponibles

Conociendo las necesidades específicas de su empresa, podemos ofrecerle una consultoría personalizada sin compromiso.

¿Le interesaría conocer más detalles sobre cómo las energías renovables pueden transformar el consumo energético de {{company_name}}?

Cordialmente,
{{consultant_name}}
{{consultant_title}}
RitterFinder - Consultoría Energética

🌍 © 2025 RitterFinder. Especialistas en transición energética.
Este email fue enviado a {{contact_email}}
  `
};

// Datos de prueba para personalización
const TEST_LEADS = [
  {
    email: 'itsjhonalex@gmail.com',
    name: 'Jhon Alex',
    company_name: 'Tech Solutions SL',
    activity: 'desarrollo de software',
    category: 'tecnología',
    state: 'Madrid'
  },
  {
    email: 'eberburn@gmail.com', 
    name: 'Eber Burn',
    company_name: 'Green Energy Corp',
    activity: 'energías renovables',
    category: 'energía',
    state: 'Barcelona'
  },
  {
    email: 'rodrj0184@gmail.com',
    name: 'Rodrigo Jiménez',
    company_name: 'Industrial Services SA',
    activity: 'consultoría industrial',
    category: 'servicios',
    state: 'Valencia'
  }
];

// Función para personalizar contenido
function personalizeContent(content, lead) {
  return content
    .replace(/\{\{contact_name\}\}/g, lead.name || 'Responsable')
    .replace(/\{\{company_name\}\}/g, lead.company_name)
    .replace(/\{\{activity\}\}/g, lead.activity)
    .replace(/\{\{category\}\}/g, lead.category)
    .replace(/\{\{state\}\}/g, lead.state)
    .replace(/\{\{contact_email\}\}/g, lead.email)
    .replace(/\{\{service_type\}\}/g, 'Instalación Solar Fotovoltaica')
    .replace(/\{\{estimated_savings\}\}/g, '40-60%')
    .replace(/\{\{roi_period\}\}/g, '5-7 años')
    .replace(/\{\{co2_reduction\}\}/g, '3-5 toneladas/año')
    .replace(/\{\{consultant_name\}\}/g, 'Carlos Rodríguez')
    .replace(/\{\{consultant_title\}\}/g, 'Especialista en Energías Renovables');
}

// Función para enviar campaña
async function sendCampaign() {
  try {
    console.log('🚀 Iniciando envío de campaña de prueba...');
    console.log(`📧 Enviando a ${TEST_LEADS.length} destinatarios:`);
    TEST_LEADS.forEach(lead => {
      console.log(`   - ${lead.email} (${lead.name} - ${lead.company_name})`);
    });
    
    // Crear mensajes personalizados para cada lead
    const messages = TEST_LEADS.map(lead => ({
      From: {
        Email: CAMPAIGN_DATA.senderEmail,
        Name: CAMPAIGN_DATA.senderName
      },
      To: [
        {
          Email: lead.email,
          Name: lead.name
        }
      ],
      Subject: personalizeContent(CAMPAIGN_DATA.subject, lead),
      HTMLPart: personalizeContent(CAMPAIGN_DATA.htmlContent, lead),
      TextPart: personalizeContent(CAMPAIGN_DATA.textContent, lead)
    }));

    // Preparar payload para Mailjet
    const payload = {
      Messages: messages
    };

    console.log('\n📤 Enviando a Mailjet API...');
    console.log(`   - URL: ${MAILJET_CONFIG.baseUrl}/send`);
    console.log(`   - Método: POST`);
    console.log(`   - Mensajes: ${messages.length}`);
    
    const authHeader = `Basic ${Buffer.from(`${MAILJET_CONFIG.apiKey}:${MAILJET_CONFIG.apiSecret}`).toString('base64')}`;
    console.log(`   - Auth: ${authHeader.substring(0, 20)}...`);
    
    const response = await fetch(`${MAILJET_CONFIG.baseUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    console.log(`   - Status: ${response.status} ${response.statusText}`);
    console.log(`   - Headers:`, Object.fromEntries(response.headers.entries()));

    // Intentar leer el body como texto primero
    const responseText = await response.text();
    console.log(`   - Response Text:`, responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Error parsing JSON response:', parseError.message);
      console.error('Response text:', responseText);
      return;
    }

    if (response.ok) {
      console.log('✅ Campaña enviada exitosamente!');
      console.log('\n📊 Resultados:');
      console.log(`   - Mensajes enviados: ${result.Messages?.length || 0}`);
      
      if (result.Messages) {
        result.Messages.forEach((msg, index) => {
          const lead = TEST_LEADS[index];
          console.log(`   - ${lead.email}: ${msg.Status === 'success' ? '✅ Enviado' : '❌ Error'}`);
          if (msg.To) {
            console.log(`     ID: ${msg.To[0]?.MessageID || 'N/A'}`);
          }
          if (msg.Errors) {
            console.log(`     Errores:`, msg.Errors);
          }
        });
      }
      
      console.log('\n🎉 ¡Prueba completada! Revisa las bandejas de entrada.');
      
    } else {
      console.error('❌ Error al enviar campaña:');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Response:', result);
      
      if (result.ErrorMessage) {
        console.error('Error Message:', result.ErrorMessage);
      }
      
      if (result.ErrorInfo) {
        console.error('Error Info:', result.ErrorInfo);
      }
    }

  } catch (error) {
    console.error('❌ Error en el envío:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Función para verificar configuración
function checkConfig() {
  console.log('🔧 Verificando configuración...');
  console.log(`   - API Key: ${MAILJET_CONFIG.apiKey ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`   - API Secret: ${MAILJET_CONFIG.apiSecret ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`   - Base URL: ${MAILJET_CONFIG.baseUrl}`);
  console.log(`   - Destinatarios: ${TEST_LEADS.length}`);
  console.log('');
}

// Ejecutar script
async function main() {
  console.log('📧 Test Script - Mailjet Campaign Service');
  console.log('==========================================\n');
  
  checkConfig();
  
  // Preguntar confirmación antes de enviar
  console.log('⚠️  ¿Estás seguro de que quieres enviar la campaña de prueba?');
  console.log('   Presiona Ctrl+C para cancelar o ejecuta el script para continuar...');
  
  // Pequeña pausa para dar tiempo a cancelar
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await sendCampaign();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  sendCampaign,
  TEST_LEADS,
  CAMPAIGN_DATA
}; 