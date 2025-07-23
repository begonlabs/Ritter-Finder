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
        const result = await this.sendEmail({
          to: recipient.email,
          name: recipient.name,
          subject: campaignData.subject,
          htmlContent: campaignData.htmlContent,
          textContent: campaignData.content
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

    return content
      .replace(/\{\{name\}\}/g, lead.name || lead.company_name || '')
      .replace(/\{\{company\}\}/g, lead.company || lead.company_name || '')
      .replace(/\{\{email\}\}/g, lead.email || '')
      .replace(/\{\{position\}\}/g, lead.position || lead.activity || '')
      .replace(/\{\{industry\}\}/g, lead.industry || lead.category || '')
      .replace(/\{\{location\}\}/g, lead.location || '');
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