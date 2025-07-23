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
    [key: string]: any; // Permitir datos adicionales del lead para personalización
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

class CampaignClient {
  /**
   * Enviar un email individual
   */
  async sendEmail(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const response = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'email',
          data: emailData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error sending email:', error);
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
    try {
      const response = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'campaign',
          data: campaignData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      return {
        success: false,
        sentCount: 0,
        failedCount: campaignData.recipients.length,
        results: campaignData.recipients.map(recipient => ({
          email: recipient.email,
          success: false,
          error: error.message || 'Error desconocido'
        }))
      };
    }
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
   * Validar configuración (simulado en el cliente)
   */
  async validateConfiguration(): Promise<boolean> {
    try {
      // Intentar enviar un email de prueba
      const testResult = await this.sendEmail({
        to: 'test@example.com',
        subject: 'Test Configuration',
        textContent: 'This is a test email to validate configuration.'
      });
      
      return testResult.success;
    } catch (error) {
      console.error('Error validating configuration:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const campaignClient = new CampaignClient(); 