const nodemailer = require('nodemailer');

// Configuración principal de Resend con puerto 465 (SSL)
const RESEND_CONFIG = {
  host: 'smtp.resend.com',
  port: 465,
  secure: true, // SSL para puerto 465
  auth: {
    user: 'resend', // Usuario por defecto de Resend
    pass: 're_8JmekCyx_8YsPqb2aGbTBcS8nwYbhxenn' // Tu API key de Resend
  }
};

// Configuración alternativa para puerto 587 (TLS) - solo como respaldo
const RESEND_CONFIG_587 = {
  host: 'smtp.resend.com',
  port: 587,
  secure: false, // TLS para puerto 587
  auth: {
    user: 'resend',
    pass: 're_8JmekCyx_8YsPqb2aGbTBcS8nwYbhxenn' // Tu API key de Resend
  }
};

// Datos de prueba
const TEST_EMAILS = [
  {
    to: 'itsjhonalex@gmail.com',
    name: 'Jhon Alex',
    subject: 'Prueba Resend SMTP - Puerto 465'
  },
  {
    to: 'eberburn@gmail.com',
    name: 'Eber Burn', 
    subject: 'Prueba Resend SMTP - Puerto 465'
  }
];

// Template HTML actualizado
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Prueba Resend SMTP - Puerto 465</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
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
        .content { 
            padding: 30px 20px; 
        }
        .success { 
            background: #d1fae5; 
            border: 1px solid #10b981; 
            color: #065f46; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .info { 
            background: #dbeafe; 
            border: 1px solid #3b82f6; 
            color: #1e40af; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .footer { 
            background: #f3f4f6; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Prueba Resend SMTP</h1>
        </div>
        
        <div class="content">
            <h2>¡Hola {{name}}!</h2>
            
            <div class="success">
                <strong>🎉 ¡Éxito!</strong> Este email fue enviado usando Resend SMTP en puerto 465 (SSL).
            </div>
            
            <div class="info">
                <strong>📧 Detalles de la prueba:</strong>
                <ul>
                    <li>Servidor SMTP: smtp.resend.com</li>
                    <li>Puerto: 465 (SSL)</li>
                    <li>Usuario: resend</li>
                    <li>Dominio: onboarding@resend.dev</li>
                    <li>Fecha: {{date}}</li>
                </ul>
            </div>
            
            <p>Esta es una prueba para verificar que la configuración SMTP de Resend funciona correctamente en puerto 465.</p>
            
            <p>Si recibes este email, significa que:</p>
            <ul>
                <li>✅ La conexión SMTP es exitosa</li>
                <li>✅ Las credenciales son válidas</li>
                <li>✅ El puerto 465 está funcionando</li>
                <li>✅ Los emails se pueden enviar correctamente</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>🌍 RitterFinder - Prueba de configuración SMTP</p>
            <p>Enviado el {{date}} desde Resend (Puerto 465)</p>
        </div>
    </div>
</body>
</html>`;

// Template de texto plano actualizado
const TEXT_TEMPLATE = `
✅ PRUEBA RESEND SMTP - PUERTO 465

¡Hola {{name}}!

🎉 ¡Éxito! Este email fue enviado usando Resend SMTP en puerto 465 (SSL).

📧 Detalles de la prueba:
- Servidor SMTP: smtp.resend.com
- Puerto: 465 (SSL)
- Usuario: resend
- Dominio: onboarding@resend.dev
- Fecha: {{date}}

Esta es una prueba para verificar que la configuración SMTP de Resend funciona correctamente en puerto 465.

Si recibes este email, significa que:
✅ La conexión SMTP es exitosa
✅ Las credenciales son válidas
✅ El puerto 465 está funcionando
✅ Los emails se pueden enviar correctamente

🌍 RitterFinder - Prueba de configuración SMTP
Enviado el {{date}} desde Resend (Puerto 465)`;

// Función para personalizar contenido
function personalizeContent(content, data) {
  return content
    .replace(/\{\{name\}\}/g, data.name)
    .replace(/\{\{date\}\}/g, new Date().toLocaleString('es-ES'));
}

// Función para probar conexión SMTP
async function testSMTPConnection(config, portName) {
  console.log(`\n🔍 Probando conexión SMTP en puerto ${config.port} (${portName})...`);
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    // Verificar conexión
    await transporter.verify();
    console.log(`✅ Conexión SMTP exitosa en puerto ${config.port}`);
    return transporter;
  } catch (error) {
    console.log(`❌ Error de conexión SMTP en puerto ${config.port}:`);
    console.log(`   ${error.message}`);
    return null;
  }
}

// Función para enviar email de prueba
async function sendTestEmail(transporter, emailData) {
  console.log(`\n📧 Enviando email de prueba a ${emailData.to}...`);
  
  try {
    const htmlContent = personalizeContent(HTML_TEMPLATE, emailData);
    const textContent = personalizeContent(TEXT_TEMPLATE, emailData);
    
    const mailOptions = {
      from: 'RitterFinder <onboarding@resend.dev>', // Dominio por defecto de Resend
      to: emailData.to,
      subject: emailData.subject,
      html: htmlContent,
      text: textContent
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado exitosamente a ${emailData.to}`);
    console.log(`   Message ID: ${result.messageId}`);
    return result;
  } catch (error) {
    console.log(`❌ Error enviando email a ${emailData.to}:`);
    console.log(`   ${error.message}`);
    return null;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando prueba de Resend SMTP en puerto 465...');
  console.log('=' .repeat(60));
  
  // Verificar configuración
  if (!RESEND_CONFIG.auth.pass || RESEND_CONFIG.auth.pass === 're_1234567890abcdef') {
    console.log('⚠️  ADVERTENCIA: Usa tu API key real de Resend en la configuración');
    console.log('   Reemplaza "re_1234567890abcdef" con tu API key real');
    return;
  }
  
  console.log('📋 Configuración de Resend:');
  console.log(`   Host: ${RESEND_CONFIG.host}`);
  console.log(`   Puerto: ${RESEND_CONFIG.port} (SSL)`);
  console.log(`   Usuario: ${RESEND_CONFIG.auth.user}`);
  console.log(`   Dominio: onboarding@resend.dev`);
  
  // Probar conexión en puerto 465 (SSL) - configuración principal
  let transporter = await testSMTPConnection(RESEND_CONFIG, 'SSL');
  
  // Si falla el puerto 465, probar puerto 587 (TLS) como respaldo
  if (!transporter) {
    console.log('\n🔄 Intentando puerto alternativo 587 (TLS)...');
    transporter = await testSMTPConnection(RESEND_CONFIG_587, 'TLS');
  }
  
  if (!transporter) {
    console.log('\n❌ No se pudo establecer conexión SMTP en ningún puerto');
    console.log('   Verifica tu API key y configuración de red');
    return;
  }
  
  // Enviar emails de prueba
  console.log('\n📤 Enviando emails de prueba...');
  let successCount = 0;
  let errorCount = 0;
  
  for (const emailData of TEST_EMAILS) {
    const result = await sendTestEmail(transporter, emailData);
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  // Resumen final
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESUMEN DE LA PRUEBA:');
  console.log(`   ✅ Emails enviados exitosamente: ${successCount}`);
  console.log(`   ❌ Emails con error: ${errorCount}`);
  console.log(`   📧 Total de emails: ${TEST_EMAILS.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 ¡Prueba exitosa! Resend SMTP está funcionando correctamente');
    console.log('   Configuración para Supabase:');
    console.log('   - Host: smtp.resend.com');
    console.log('   - Puerto: 465');
    console.log('   - Usuario: resend');
    console.log('   - Contraseña: re_8JmekCyx_8YsPqb2aGbTBcS8nwYbhxenn');
    console.log('   - Dominio: onboarding@resend.dev');
  } else {
    console.log('\n❌ La prueba falló. Verifica:');
    console.log('   - Tu API key de Resend');
    console.log('   - Configuración de red/firewall');
    console.log('   - Límites de tu cuenta de Resend');
  }
  
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Verifica que recibiste los emails de prueba');
  console.log('   2. Revisa la carpeta de spam si no los encuentras');
  console.log('   3. Usa esta configuración en tu Supabase self-hosted');
  console.log('   4. Configura tu dominio personalizado en Resend (opcional)');
}

// Ejecutar prueba
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testSMTPConnection,
  sendTestEmail,
  RESEND_CONFIG,
  RESEND_CONFIG_587
};