import { useState, useCallback, useMemo } from 'react';
import { EmailTemplate, TemplateFilters } from '../types';

interface UseEmailTemplatesReturn {
  // Data
  templates: EmailTemplate[];
  filteredTemplates: EmailTemplate[];
  
  // Filters
  filters: TemplateFilters;
  updateFilters: (newFilters: Partial<TemplateFilters>) => void;
  clearFilters: () => void;
  
  // Actions
  createTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<EmailTemplate>;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => Promise<EmailTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<EmailTemplate>;
  getTemplateById: (id: string) => EmailTemplate | undefined;
  
  // Statistics
  getTemplatesByCategory: () => Record<string, EmailTemplate[]>;
  getTotalUsage: () => number;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const DEFAULT_FILTERS: TemplateFilters = {
  searchTerm: '',
  category: '',
  isActive: null
};

// Mock data with comprehensive templates
const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl_001',
    name: 'Propuesta Comercial Premium',
    description: 'Template profesional para envío de propuestas comerciales con detalles del servicio',
    subject: 'Propuesta Comercial - {{company_name}} | RitterFinder',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .highlight { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RitterFinder</h1>
        <p>Soluciones Profesionales</p>
    </div>
    
    <div class="content">
        <h2>Estimado/a {{contact_name}},</h2>
        
        <p>Es un placer contactarle en nombre de <strong>{{company_name}}</strong>. Hemos preparado una propuesta personalizada que consideramos será de gran valor para su organización.</p>
        
        <div class="highlight">
            <h3>Propuesta: {{service_name}}</h3>
            <p><strong>Valor de la inversión:</strong> {{service_price}}</p>
            <p><strong>Tiempo de implementación:</strong> {{implementation_time}}</p>
        </div>
        
        <p>Nuestro equipo está disponible para una presentación personalizada donde podemos discutir los detalles específicos y responder cualquier pregunta que pueda tener.</p>
        
        <p>Cordialmente,<br><strong>{{sender_name}}</strong><br>{{sender_position}}<br>RitterFinder</p>
    </div>
    
    <div class="footer">
        <p>© 2025 RitterFinder. Todos los derechos reservados.</p>
        <p>Este email fue enviado a {{contact_email}}</p>
    </div>
</body>
</html>`,
    plainTextContent: `
Estimado/a {{contact_name}},

Es un placer contactarle en nombre de {{company_name}}. Hemos preparado una propuesta personalizada que consideramos será de gran valor para su organización.

PROPUESTA: {{service_name}}
Valor de la inversión: {{service_price}}
Tiempo de implementación: {{implementation_time}}

Nuestro equipo está disponible para una presentación personalizada donde podemos discutir los detalles específicos y responder cualquier pregunta que pueda tener.

Cordialmente,
{{sender_name}}
{{sender_position}}
RitterFinder

© 2025 RitterFinder. Todos los derechos reservados.
Este email fue enviado a {{contact_email}}
`,
    category: 'sales',
    isActive: true,
    variables: [
      { key: 'contact_name', label: 'Nombre del contacto', description: 'Nombre del contacto', required: true, defaultValue: '', type: 'text' },
      { key: 'company_name', label: 'Nombre de la empresa cliente', description: 'Nombre de la empresa cliente', required: true, defaultValue: '', type: 'text' },
      { key: 'service_name', label: 'Nombre del servicio propuesto', description: 'Nombre del servicio propuesto', required: true, defaultValue: '', type: 'text' },
      { key: 'service_price', label: 'Precio del servicio', description: 'Precio del servicio', required: true, defaultValue: '', type: 'text' },
      { key: 'implementation_time', label: 'Tiempo de implementación', description: 'Tiempo de implementación', required: false, defaultValue: '2-4 semanas', type: 'text' },
      { key: 'sender_name', label: 'Nombre del remitente', description: 'Nombre del remitente', required: true, defaultValue: '', type: 'text' },
      { key: 'sender_position', label: 'Cargo del remitente', description: 'Cargo del remitente', required: false, defaultValue: 'Consultor Comercial', type: 'text' },
      { key: 'contact_email', label: 'Email del contacto', description: 'Email del contacto', required: true, defaultValue: '', type: 'email' }
    ],
    usageCount: 45,
    createdBy: 'admin',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: 'tpl_002',
    name: 'Follow-up Post Reunión',
    description: 'Template para seguimiento después de reuniones comerciales',
    subject: 'Seguimiento de nuestra reunión - {{meeting_date}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .next-steps { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RitterFinder</h1>
        <p>Seguimiento Profesional</p>
    </div>
    
    <div class="content">
        <h2>Hola {{contact_name}},</h2>
        
        <p>Gracias por el tiempo dedicado en nuestra reunión del {{meeting_date}}. Fue muy productivo discutir sobre {{meeting_topic}}.</p>
        
        <div class="next-steps">
            <h3>Próximos Pasos:</h3>
            <ul>
                <li>{{next_step_1}}</li>
                <li>{{next_step_2}}</li>
                <li>{{next_step_3}}</li>
            </ul>
        </div>
        
        <p>He adjuntado {{attachment_description}} como mencionamos en la reunión.</p>
        
        <p>Quedo a su disposición para cualquier consulta.</p>
        
        <p>Saludos cordiales,<br><strong>{{sender_name}}</strong></p>
    </div>
    
    <div class="footer">
        <p>© 2025 RitterFinder. Todos los derechos reservados.</p>
    </div>
</body>
</html>`,
    plainTextContent: `
Hola {{contact_name}},

Gracias por el tiempo dedicado en nuestra reunión del {{meeting_date}}. Fue muy productivo discutir sobre {{meeting_topic}}.

PRÓXIMOS PASOS:
- {{next_step_1}}
- {{next_step_2}}
- {{next_step_3}}

He adjuntado {{attachment_description}} como mencionamos en la reunión.

Quedo a su disposición para cualquier consulta.

Saludos cordiales,
{{sender_name}}

© 2025 RitterFinder. Todos los derechos reservados.
`,
    category: 'follow-up',
    isActive: true,
    variables: [
      { key: 'contact_name', label: 'Nombre del contacto', description: 'Nombre del contacto', required: true, defaultValue: '', type: 'text' },
      { key: 'meeting_date', label: 'Fecha de la reunión', description: 'Fecha de la reunión', required: true, defaultValue: '', type: 'date' },
      { key: 'meeting_topic', label: 'Tema principal de la reunión', description: 'Tema principal de la reunión', required: true, defaultValue: '', type: 'text' },
      { key: 'next_step_1', label: 'Primer paso a seguir', description: 'Primer paso a seguir', required: true, defaultValue: '', type: 'text' },
      { key: 'next_step_2', label: 'Segundo paso a seguir', description: 'Segundo paso a seguir', required: false, defaultValue: '', type: 'text' },
      { key: 'next_step_3', label: 'Tercer paso a seguir', description: 'Tercer paso a seguir', required: false, defaultValue: '', type: 'text' },
      { key: 'attachment_description', label: 'Descripción del adjunto', description: 'Descripción del adjunto', required: false, defaultValue: 'la información solicitada', type: 'text' },
      { key: 'sender_name', label: 'Nombre del remitente', description: 'Nombre del remitente', required: true, defaultValue: '', type: 'text' }
    ],
    usageCount: 32,
    createdBy: 'admin',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'tpl_003',
    name: 'Newsletter Mensual',
    description: 'Template para newsletters mensuales con noticias y actualizaciones',
    subject: 'RitterFinder Newsletter - {{month}} {{year}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .news-item { border-bottom: 1px solid #e5e7eb; padding: 20px 0; }
        .cta { background: #10b981; color: white; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RitterFinder Newsletter</h1>
        <p>{{month}} {{year}}</p>
    </div>
    
    <div class="content">
        <h2>¡Hola {{subscriber_name}}!</h2>
        
        <p>Este mes tenemos noticias emocionantes que compartir contigo:</p>
        
        <div class="news-item">
            <h3>{{news_title_1}}</h3>
            <p>{{news_content_1}}</p>
        </div>
        
        <div class="news-item">
            <h3>{{news_title_2}}</h3>
            <p>{{news_content_2}}</p>
        </div>
        
        <div class="cta">
            <h3>{{cta_title}}</h3>
            <p>{{cta_description}}</p>
        </div>
        
        <p>Gracias por ser parte de la comunidad RitterFinder.</p>
    </div>
    
    <div class="footer">
        <p>© 2025 RitterFinder. Todos los derechos reservados.</p>
        <p>Si no deseas recibir más newsletters, puedes <a href="#">darte de baja aquí</a></p>
    </div>
</body>
</html>`,
    plainTextContent: `
RITTERFINDER NEWSLETTER - {{month}} {{year}}

¡Hola {{subscriber_name}}!

Este mes tenemos noticias emocionantes que compartir contigo:

{{news_title_1}}
{{news_content_1}}

{{news_title_2}}  
{{news_content_2}}

{{cta_title}}
{{cta_description}}

Gracias por ser parte de la comunidad RitterFinder.

© 2025 RitterFinder. Todos los derechos reservados.
Si no deseas recibir más newsletters, puedes darte de baja respondiendo a este email.
`,
    category: 'marketing',
    isActive: true,
    variables: [
      { key: 'subscriber_name', label: 'Nombre del suscriptor', description: 'Nombre del suscriptor', required: true, defaultValue: '', type: 'text' },
      { key: 'month', label: 'Mes actual', description: 'Mes actual', required: true, defaultValue: '', type: 'text' },
      { key: 'year', label: 'Año actual', description: 'Año actual', required: true, defaultValue: '2025', type: 'number' },
      { key: 'news_title_1', label: 'Título de la primera noticia', description: 'Título de la primera noticia', required: true, defaultValue: '', type: 'text' },
      { key: 'news_content_1', label: 'Contenido de la primera noticia', description: 'Contenido de la primera noticia', required: true, defaultValue: '', type: 'text' },
      { key: 'news_title_2', label: 'Título de la segunda noticia', description: 'Título de la segunda noticia', required: false, defaultValue: '', type: 'text' },
      { key: 'news_content_2', label: 'Contenido de la segunda noticia', description: 'Contenido de la segunda noticia', required: false, defaultValue: '', type: 'text' },
      { key: 'cta_title', label: 'Título del call-to-action', description: 'Título del call-to-action', required: true, defaultValue: '', type: 'text' },
      { key: 'cta_description', label: 'Descripción del call-to-action', description: 'Descripción del call-to-action', required: true, defaultValue: '', type: 'text' }
    ],
    usageCount: 12,
    createdBy: 'admin',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: 'tpl_004',
    name: 'Bienvenida Nuevo Cliente',
    description: 'Template de bienvenida para nuevos clientes',
    subject: '¡Bienvenido/a a RitterFinder, {{client_name}}!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .welcome-box { background: #f3e8ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .steps { background: #fafbfc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>¡Bienvenido/a a RitterFinder!</h1>
    </div>
    
    <div class="content">
        <div class="welcome-box">
            <h2>¡Hola {{client_name}}!</h2>
            <p>Estamos emocionados de tenerte como parte de nuestra familia.</p>
        </div>
        
        <p>Tu cuenta ha sido configurada exitosamente. Aquí tienes todo lo que necesitas saber para comenzar:</p>
        
        <div class="steps">
            <h3>Próximos Pasos:</h3>
            <ol>
                <li>{{step_1}}</li>
                <li>{{step_2}}</li>
                <li>{{step_3}}</li>
            </ol>
        </div>
        
        <p><strong>Tu representante asignado:</strong> {{account_manager}}<br>
        <strong>Email de contacto:</strong> {{manager_email}}<br>
        <strong>Teléfono:</strong> {{manager_phone}}</p>
        
        <p>Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.</p>
        
        <p>¡Bienvenido/a al equipo!</p>
    </div>
    
    <div class="footer">
        <p>© 2025 RitterFinder. Todos los derechos reservados.</p>
    </div>
</body>
</html>`,
    plainTextContent: `
¡BIENVENIDO/A A RITTERFINDER!

¡Hola {{client_name}}!

Estamos emocionados de tenerte como parte de nuestra familia.

Tu cuenta ha sido configurada exitosamente. Aquí tienes todo lo que necesitas saber para comenzar:

PRÓXIMOS PASOS:
1. {{step_1}}
2. {{step_2}}
3. {{step_3}}

Tu representante asignado: {{account_manager}}
Email de contacto: {{manager_email}}
Teléfono: {{manager_phone}}

Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.

¡Bienvenido/a al equipo!

© 2025 RitterFinder. Todos los derechos reservados.
`,
    category: 'welcome',
    isActive: true,
    variables: [
      { key: 'client_name', label: 'Nombre del cliente', description: 'Nombre del cliente', required: true, defaultValue: '', type: 'text' },
      { key: 'step_1', label: 'Primer paso a seguir', description: 'Primer paso a seguir', required: true, defaultValue: '', type: 'text' },
      { key: 'step_2', label: 'Segundo paso a seguir', description: 'Segundo paso a seguir', required: true, defaultValue: '', type: 'text' },
      { key: 'step_3', label: 'Tercer paso a seguir', description: 'Tercer paso a seguir', required: true, defaultValue: '', type: 'text' },
      { key: 'account_manager', label: 'Nombre del gestor de cuenta', description: 'Nombre del gestor de cuenta', required: true, defaultValue: '', type: 'text' },
      { key: 'manager_email', label: 'Email del gestor', description: 'Email del gestor', required: true, defaultValue: '', type: 'email' },
      { key: 'manager_phone', label: 'Teléfono del gestor', description: 'Teléfono del gestor', required: false, defaultValue: '', type: 'text' }
    ],
    usageCount: 23,
    createdBy: 'admin',
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-11-30')
  },
  {
    id: 'tpl_005',
    name: 'Energías Renovables - Consultoría',
    description: 'Template especializado para empresas del sector de energías renovables',
    subject: 'Soluciones en Energías Renovables para {{company_name}} - RitterFinder',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .highlight { background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
        .benefits { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌱 RitterFinder</h1>
        <p>Consultoría en Energías Renovables</p>
    </div>
    
    <div class="content">
        <h2>Estimado/a {{contact_name}},</h2>
        
        <p>Hemos identificado a <strong>{{company_name}}</strong> como una empresa líder en {{industry}} ubicada en {{location}}. Creemos que nuestras soluciones en energías renovables pueden ser de gran valor para su organización.</p>
        
        <div class="highlight">
            <h3>🔋 {{service_type}} para su empresa</h3>
            <p><strong>Ahorro estimado:</strong> {{estimated_savings}}</p>
            <p><strong>Retorno de inversión:</strong> {{roi_period}}</p>
            <p><strong>Reducción de CO₂:</strong> {{co2_reduction}}</p>
        </div>
        
        <div class="benefits">
            <h3>Beneficios específicos para {{industry}}:</h3>
            <ul>
                <li>✅ Reducción de costes energéticos hasta un 70%</li>
                <li>✅ Independencia energética y sostenibilidad</li>
                <li>✅ Cumplimiento de normativas medioambientales</li>
                <li>✅ Mejora de la imagen corporativa</li>
                <li>✅ Subvenciones y incentivos fiscales disponibles</li>
            </ul>
        </div>
        
        <p>Con una confianza del {{confidence_score}}% en nuestros datos sobre su empresa y conociendo sus necesidades específicas, podemos ofrecerle una consultoría personalizada <strong>sin compromiso</strong>.</p>
        
        <p>¿Le interesaría conocer más detalles sobre cómo las energías renovables pueden transformar el consumo energético de {{company_name}}?</p>
        
        <p>Cordialmente,<br><strong>{{consultant_name}}</strong><br>{{consultant_title}}<br>RitterFinder - Consultoría Energética</p>
    </div>
    
    <div class="footer">
        <p>🌍 © 2025 RitterFinder. Especialistas en transición energética.</p>
        <p>Este email fue enviado a {{contact_email}} | {{source_type}} verificado</p>
    </div>
</body>
</html>`,
    plainTextContent: `
🌱 RITTERFINDER - CONSULTORÍA EN ENERGÍAS RENOVABLES

Estimado/a {{contact_name}},

Hemos identificado a {{company_name}} como una empresa líder en {{industry}} ubicada en {{location}}. Creemos que nuestras soluciones en energías renovables pueden ser de gran valor para su organización.

🔋 {{service_type}} para su empresa:
- Ahorro estimado: {{estimated_savings}}
- Retorno de inversión: {{roi_period}}  
- Reducción de CO₂: {{co2_reduction}}

BENEFICIOS ESPECÍFICOS PARA {{industry}}:
✅ Reducción de costes energéticos hasta un 70%
✅ Independencia energética y sostenibilidad
✅ Cumplimiento de normativas medioambientales
✅ Mejora de la imagen corporativa
✅ Subvenciones y incentivos fiscales disponibles

Con una confianza del {{confidence_score}}% en nuestros datos sobre su empresa y conociendo sus necesidades específicas, podemos ofrecerle una consultoría personalizada sin compromiso.

¿Le interesaría conocer más detalles sobre cómo las energías renovables pueden transformar el consumo energético de {{company_name}}?

Cordialmente,
{{consultant_name}}
{{consultant_title}}
RitterFinder - Consultoría Energética

🌍 © 2025 RitterFinder. Especialistas en transición energética.
Este email fue enviado a {{contact_email}} | {{source_type}} verificado
`,
    category: 'sales',
    isActive: true,
    variables: [
      // Variables automáticas (se cargan desde leads): contact_name, company_name, industry, location, confidence_score, contact_email, source_type
      { key: 'service_type', label: 'Tipo de servicio energético', description: 'Instalación Solar, Aerotermia, etc.', required: true, defaultValue: 'Instalación Solar Fotovoltaica', type: 'text' },
      { key: 'estimated_savings', label: 'Ahorro estimado', description: 'Porcentaje o cantidad de ahorro', required: true, defaultValue: '40-60%', type: 'text' },
      { key: 'roi_period', label: 'Período de retorno de inversión', description: 'Tiempo para recuperar la inversión', required: true, defaultValue: '5-7 años', type: 'text' },
      { key: 'co2_reduction', label: 'Reducción de CO₂', description: 'Reducción de emisiones anuales', required: true, defaultValue: '3-5 toneladas/año', type: 'text' },
      { key: 'consultant_name', label: 'Nombre del consultor', description: 'Nombre del especialista en energías renovables', required: true, defaultValue: '', type: 'text' },
      { key: 'consultant_title', label: 'Cargo del consultor', description: 'Título del especialista', required: false, defaultValue: 'Especialista en Energías Renovables', type: 'text' }
    ],
    usageCount: 15,
    createdBy: 'admin',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: 'tpl_006',
    name: 'Template Personalizado Simple',
    description: 'Template básico personalizable para cualquier propósito',
    subject: '{{custom_subject}}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
        .content { max-width: 600px; margin: 0 auto; }
        .header { border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="content">
        <div class="header">
            <h1>{{header_title}}</h1>
        </div>
        
        <p>{{greeting}} {{contact_name}},</p>
        
        <p>{{main_message}}</p>
        
        <p>{{closing_message}}</p>
        
        <p>{{signature_name}}<br>{{signature_title}}</p>
        
        <div class="footer">
            <p>{{footer_text}}</p>
        </div>
    </div>
</body>
</html>`,
    plainTextContent: `
{{header_title}}

{{greeting}} {{contact_name}},

{{main_message}}

{{closing_message}}

{{signature_name}}
{{signature_title}}

{{footer_text}}
`,
    category: 'custom',
    isActive: true,
    variables: [
      // Variables automáticas: contact_name se carga automáticamente
      { key: 'custom_subject', label: 'Asunto personalizado', description: 'Asunto personalizado', required: true, defaultValue: '', type: 'text' },
      { key: 'header_title', label: 'Título del encabezado', description: 'Título del encabezado', required: true, defaultValue: '', type: 'text' },
      { key: 'greeting', label: 'Saludo (Estimado/a, Hola, etc.)', description: 'Saludo (Estimado/a, Hola, etc.)', required: false, defaultValue: 'Estimado/a', type: 'text' },
      { key: 'main_message', label: 'Mensaje principal', description: 'Mensaje principal', required: true, defaultValue: '', type: 'text' },
      { key: 'closing_message', label: 'Mensaje de cierre', description: 'Mensaje de cierre', required: false, defaultValue: 'Gracias por su tiempo.', type: 'text' },
      { key: 'signature_name', label: 'Nombre en la firma', description: 'Nombre en la firma', required: true, defaultValue: '', type: 'text' },
      { key: 'signature_title', label: 'Cargo en la firma', description: 'Cargo en la firma', required: false, defaultValue: '', type: 'text' },
      { key: 'footer_text', label: 'Texto del pie de página', description: 'Texto del pie de página', required: false, defaultValue: '© 2025 RitterFinder. Todos los derechos reservados.', type: 'text' }
    ],
    usageCount: 3,
    createdBy: 'admin',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }
];

export const useEmailTemplates = (): UseEmailTemplatesReturn => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [filters, setFilters] = useState<TemplateFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let result = templates;

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.subject.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(template => template.category === filters.category);
    }

    // Active status filter
    if (filters.isActive !== null) {
      result = result.filter(template => template.isActive === filters.isActive);
    }

    return result;
  }, [templates, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TemplateFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Create template
  const createTemplate = useCallback(async (
    templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
  ): Promise<EmailTemplate> => {
    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTemplate: EmailTemplate = {
        ...templateData,
        id: `tpl_${Date.now()}`,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Update template
  const updateTemplate = useCallback(async (
    id: string,
    updates: Partial<EmailTemplate>
  ): Promise<EmailTemplate> => {
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedTemplate = { ...updates, updatedAt: new Date() };
      
      setTemplates(prev => prev.map(template =>
        template.id === id
          ? { ...template, ...updatedTemplate }
          : template
      ));

      const template = templates.find(t => t.id === id);
      if (!template) throw new Error('Template not found');
      
      return { ...template, ...updatedTemplate };
    } finally {
      setIsUpdating(false);
    }
  }, [templates]);

  // Delete template
  const deleteTemplate = useCallback(async (id: string): Promise<void> => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setTemplates(prev => prev.filter(template => template.id !== id));
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Duplicate template
  const duplicateTemplate = useCallback(async (id: string): Promise<EmailTemplate> => {
    const originalTemplate = templates.find(t => t.id === id);
    if (!originalTemplate) {
      throw new Error('Template not found');
    }

    const duplicatedTemplate = await createTemplate({
      ...originalTemplate,
      name: `${originalTemplate.name} (Copia)`,
      createdBy: 'user'
    });

    return duplicatedTemplate;
  }, [templates, createTemplate]);

  // Get template by ID
  const getTemplateById = useCallback((id: string): EmailTemplate | undefined => {
    return templates.find(template => template.id === id);
  }, [templates]);

  // Get templates by category
  const getTemplatesByCategory = useCallback((): Record<string, EmailTemplate[]> => {
    const categories: Record<string, EmailTemplate[]> = {};
    
    templates.forEach(template => {
      if (!categories[template.category]) {
        categories[template.category] = [];
      }
      categories[template.category].push(template);
    });

    // Sort templates within each category by usage count
    Object.keys(categories).forEach(category => {
      categories[category].sort((a, b) => b.usageCount - a.usageCount);
    });

    return categories;
  }, [templates]);

  // Get total usage
  const getTotalUsage = useCallback((): number => {
    return templates.reduce((total, template) => total + template.usageCount, 0);
  }, [templates]);

  return {
    // Data
    templates,
    filteredTemplates,
    
    // Filters
    filters,
    updateFilters,
    clearFilters,
    
    // Actions
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    getTemplateById,
    
    // Statistics
    getTemplatesByCategory,
    getTotalUsage,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting
  };
}; 