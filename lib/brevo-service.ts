import * as SibApiV3Sdk from '@getbrevo/brevo';

// Configuración de Brevo API
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configurar API key desde variables de entorno
let apiKey = process.env.BREVO_API_KEY;
let senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@rittermor.energy';
let senderName = process.env.BREVO_SENDER_NAME || 'RitterFinder Team';

// Función para configurar la API key
function configureApiKey() {
  apiKey = process.env.BREVO_API_KEY;
  senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@rittermor.energy';
  senderName = process.env.BREVO_SENDER_NAME || 'RitterFinder Team';
  
  if (apiKey) {
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }
}

// Configurar API key al inicializar
configureApiKey();

export interface EmailData {
  to: string;
  name?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
}

export interface CampaignData {
  subject: string;
  content: string;
  htmlContent?: string;
  senderName: string;
  senderEmail: string;
  recipients: Array<{
    email: string;
    name?: string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SendCampaignResult {
  success: boolean;
  sentCount: number;
  failedCount: number;
  results: Array<{
    email: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}

class BrevoService {
  /**
   * Enviar un email individual
   */
  async sendEmail(emailData: EmailData): Promise<SendEmailResult> {
    try {
      // Validar que la API key esté configurada
      if (!apiKey) {
        console.error('BREVO_API_KEY no está configurada en las variables de entorno');
        return {
          success: false,
          error: 'API key no configurada. Verifica BREVO_API_KEY en tu archivo .env'
        };
      }

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = emailData.subject;
      sendSmtpEmail.htmlContent = emailData.htmlContent;
      sendSmtpEmail.textContent = emailData.textContent;
      sendSmtpEmail.sender = {
        name: senderName,
        email: senderEmail
      };
      sendSmtpEmail.to = [{
        email: emailData.to,
        name: emailData.name || emailData.to.split('@')[0]
      }];

      console.log('Enviando email a:', emailData.to);
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email enviado exitosamente:', data);
      
      return {
        success: true,
        messageId: (data as any).messageId || 'unknown'
      };
    } catch (error: any) {
      console.error('Error sending email to', emailData.to, ':', error);
      return {
        success: false,
        error: error.message || 'Error desconocido al enviar email'
      };
    }
  }

  /**
   * Enviar una campaña a múltiples destinatarios
   */
  async sendCampaign(campaignData: CampaignData): Promise<SendCampaignResult> {
    console.log('Iniciando envío de campaña a', campaignData.recipients.length, 'destinatarios');
    console.log('Asunto:', campaignData.subject);
    console.log('Remitente:', campaignData.senderName, '<', campaignData.senderEmail, '>');
    
    const results: Array<{
      email: string;
      success: boolean;
      messageId?: string;
      error?: string;
    }> = [];

    let sentCount = 0;
    let failedCount = 0;

    // Enviar emails uno por uno para mejor control de errores
    for (let i = 0; i < campaignData.recipients.length; i++) {
      const recipient = campaignData.recipients[i];
      console.log(`Enviando email ${i + 1}/${campaignData.recipients.length} a:`, recipient.email);
      
      try {
        // Personalizar contenido para este destinatario específico
        const personalizedHtmlContent = campaignData.htmlContent 
          ? this.personalizeContent(campaignData.htmlContent, recipient)
          : undefined;
        
        const personalizedTextContent = campaignData.content
          ? this.personalizeContent(campaignData.content, recipient)
          : undefined;

        console.log('Contenido personalizado para', recipient.email, ':', {
          htmlLength: personalizedHtmlContent?.length || 0,
          textLength: personalizedTextContent?.length || 0,
          recipientData: {
            name: recipient.name,
            company_name: (recipient as any).company_name,
            activity: (recipient as any).activity,
            category: (recipient as any).category,
            location_display: (recipient as any).location_display
          }
        });

        // Debug: mostrar algunas variables personalizadas
        if (personalizedHtmlContent) {
          const hasGreeting = personalizedHtmlContent.includes('Estimado/a') || personalizedHtmlContent.includes('Hola');
          const hasCompany = personalizedHtmlContent.includes((recipient as any).company_name || '');
          const hasActivity = personalizedHtmlContent.includes((recipient as any).activity || '');
          
          console.log('Variables personalizadas verificadas:', {
            hasGreeting,
            hasCompany,
            hasActivity,
            companyName: (recipient as any).company_name,
            activity: (recipient as any).activity
          });
        }

        const result = await this.sendEmail({
          to: recipient.email,
          name: recipient.name,
          subject: campaignData.subject,
          htmlContent: personalizedHtmlContent,
          textContent: personalizedTextContent
        });

        if (result.success) {
          sentCount++;
          console.log('✅ Email enviado exitosamente a:', recipient.email);
          results.push({
            email: recipient.email,
            success: true,
            messageId: result.messageId
          });
        } else {
          failedCount++;
          console.log('❌ Error al enviar email a:', recipient.email, '-', result.error);
          results.push({
            email: recipient.email,
            success: false,
            error: result.error
          });
        }

        // Pausa entre emails para evitar rate limiting
        if (i < campaignData.recipients.length - 1) {
          console.log('Esperando 100ms antes del siguiente email...');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error: any) {
        failedCount++;
        console.log('❌ Excepción al enviar email a:', recipient.email, '-', error.message);
        results.push({
          email: recipient.email,
          success: false,
          error: error.message || 'Error desconocido'
        });
      }
    }

    console.log(`Campaña completada: ${sentCount} enviados, ${failedCount} fallidos`);
    
    return {
      success: sentCount > 0,
      sentCount,
      failedCount,
      results
    };
  }

  /**
   * Personalizar contenido de email con datos del lead
   */
  personalizeContent(content: string, lead: any): string {
    if (!content || !lead) return content;

    // Variables básicas del lead
    const leadVariables = {
      // Información de contacto
      'lead.contact_name': lead.name || lead.contact_name || '',
      'lead.contact_email': lead.email || lead.contact_email || '',
      'lead.contact_phone': lead.phone || lead.contact_phone || '',
      
      // Información de empresa
      'lead.company_name': lead.company_name || lead.company || '',
      'lead.company_website': lead.company_website || lead.website || '',
      'lead.company_description': lead.description || lead.company_description || '',
      
      // Ubicación
      'lead.address': lead.address || '',
      'lead.state': lead.state || '',
      'lead.country': lead.country || '',
      'lead.location_display': `${lead.state || ''} ${lead.country || ''}`.trim() || 'Ubicación',
      
      // Actividad y categoría
      'lead.activity': lead.activity || lead.position || 'Actividad',
      'lead.category': lead.category || lead.industry || 'Categoría',
      'lead.industry': lead.industry || lead.category || 'Industria',
      
      // Saludos personalizados
      'lead.greeting': lead.name ? `Estimado/a ${lead.name}` : `Estimado/a representante de ${lead.company_name || 'su empresa'}`,
      'lead.formal_greeting': lead.name ? `Estimado/a ${lead.name}` : 'Estimado/a representante',
      'lead.casual_greeting': lead.name ? `Hola ${lead.name}` : 'Hola',
      
      // Validación de datos
      'lead.email_validated': lead.verified_email ? 'Sí' : 'No',
      'lead.phone_validated': lead.verified_phone ? 'Sí' : 'No',
      'lead.website_exists': lead.verified_website ? 'Sí' : 'No',
      'lead.data_quality_score': lead.data_quality_score || 'N/A',
      'lead.data_quality_percentage': lead.data_quality_score ? `${(lead.data_quality_score / 5) * 100}%` : 'N/A',
      
      // Variables legacy para compatibilidad
      'name': lead.name || lead.company_name || '',
      'company': lead.company || lead.company_name || '',
      'email': lead.email || '',
      'position': lead.position || lead.activity || '',
      'industry': lead.industry || lead.category || '',
      'location': lead.location || `${lead.state || ''} ${lead.country || ''}`.trim(),
    };

    // Reemplazar todas las variables dinámicas
    Object.entries(leadVariables).forEach(([variable, value]) => {
      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      content = content.replace(regex, value);
    });

    return content;
  }

  /**
   * Convertir contenido de texto a HTML básico
   */
  textToHtml(text: string): string {
    if (!text) return '';
    
    return text
      .split('\n')
      .map(line => `<p>${line}</p>`)
      .join('');
  }

  /**
   * Validar configuración de Brevo
   */
  async validateConfiguration(): Promise<boolean> {
    try {
      // Verificar que la API key esté configurada
      if (!apiKey) {
        console.error('BREVO_API_KEY no está configurada');
        return false;
      }

      // Verificar que las variables de entorno estén configuradas
      if (!senderEmail || !senderName) {
        console.error('BREVO_SENDER_EMAIL o BREVO_SENDER_NAME no están configuradas');
        return false;
      }

      console.log('Configuración de Brevo validada correctamente');
      console.log('Sender Email:', senderEmail);
      console.log('Sender Name:', senderName);
      
      return true;
    } catch (error) {
      console.error('Error validating Brevo configuration:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const brevoService = new BrevoService(); 