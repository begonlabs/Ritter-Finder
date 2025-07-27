"use client"

import { useState, useEffect, useCallback } from 'react';
import { campaignClient } from '../../../lib/campaign-client';
import { incrementEmailCount } from './useEmailLimits';
import type { Lead, Campaign } from "../types"

interface EmailComposerData {
  // Basic fields
  name: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  content: string;
  htmlContent?: string;
  
  // Mode
  contentMode: 'text' | 'html';
  isHtmlMode: boolean;
  
  // Preview
  previewLead?: Lead;
  
  // Recipients
  recipientCount: number;
  leadId?: string;
  
  // Status
  isLoading: boolean;
  emailSent: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface UseEmailComposerReturn {
  // Data
  data: EmailComposerData;
  
  // Actions
  updateField: (field: keyof EmailComposerData, value: any) => void;
  setPreviewLead: (lead: Lead) => void;
  setSubject: (subject: string) => void;
  setContent: (content: string) => void;
  setHtmlContent: (htmlContent: string) => void;
  setSenderName: (name: string) => void;
  setSenderEmail: (email: string) => void;
  setIsHtmlMode: (isHtml: boolean) => void;
  
  // Content processing
  personalizeEmail: (content: string, lead: Lead) => string;
  renderHtmlContent: (lead: Lead) => string;
  
  // Validation
  validation: {
    errors: ValidationError[];
    warnings: ValidationError[];
    isValid: boolean;
  };
  
  // Send
  sendEmail: () => Promise<void>;
  sendCampaign: (leads: Lead[]) => Promise<void>;
  isSending: boolean;
  
  // Reset
  reset: () => void;
}

const DEFAULT_COMPOSER_DATA: EmailComposerData = {
  name: '',
  subject: '',
  senderName: process.env.NEXT_PUBLIC_BREVO_SENDER_NAME || 'RitterFinder Team',
  senderEmail: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || 'info@rittermor.energy',
  content: '',
  htmlContent: '',
  contentMode: 'text',
  isHtmlMode: false,
  previewLead: undefined,
  recipientCount: 0,
  leadId: undefined,
  isLoading: false,
  emailSent: false
};

export const useEmailComposer = (): UseEmailComposerReturn => {
  const [data, setData] = useState<EmailComposerData>(DEFAULT_COMPOSER_DATA);
  const [isSending, setIsSending] = useState(false);
  const [validation, setValidation] = useState<{
    errors: ValidationError[];
    warnings: ValidationError[];
    isValid: boolean;
  }>({
    errors: [],
    warnings: [],
    isValid: false
  });

  // Update individual fields
  const updateField = useCallback((field: keyof EmailComposerData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Individual field setters
  const setPreviewLead = useCallback((lead: Lead) => {
    setData(prev => ({ ...prev, previewLead: lead }));
  }, []);

  const setSubject = useCallback((subject: string) => {
    setData(prev => ({ ...prev, subject }));
  }, []);

  const setContent = useCallback((content: string) => {
    setData(prev => ({ ...prev, content }));
  }, []);

  const setHtmlContent = useCallback((htmlContent: string) => {
    setData(prev => ({ ...prev, htmlContent }));
  }, []);

  const setSenderName = useCallback((senderName: string) => {
    setData(prev => ({ ...prev, senderName }));
  }, []);

  const setSenderEmail = useCallback((senderEmail: string) => {
    setData(prev => ({ ...prev, senderEmail }));
  }, []);

  const setIsHtmlMode = useCallback((isHtml: boolean) => {
    setData(prev => ({ 
      ...prev, 
      isHtmlMode: isHtml,
      contentMode: isHtml ? 'html' : 'text'
    }));
  }, []);

  // Content processing
  const personalizeEmail = useCallback((content: string, lead: Lead) => {
    if (!content || !lead) return content;

    // Variables básicas (legacy support)
    let personalizedContent = content
      .replace(/\{\{name\}\}/g, lead.name || lead.company_name || '')
      .replace(/\{\{company\}\}/g, lead.company || lead.company_name || '')
      .replace(/\{\{email\}\}/g, lead.email || '')
      .replace(/\{\{position\}\}/g, lead.position || lead.activity || '')
      .replace(/\{\{industry\}\}/g, lead.industry || lead.category || '')
      .replace(/\{\{location\}\}/g, lead.location || '');

    // Nuevas variables dinámicas usando lead.field_name
    const leadVariables = {
      // Información de contacto
      'lead.contact_name': lead.name || lead.company_name || '',
      'lead.contact_email': lead.email || '',
      'lead.contact_phone': lead.phone || '',
      
      // Información de la empresa
      'lead.company_name': lead.company_name || lead.company || '',
      'lead.company_website': lead.company_website || lead.website || '',
      'lead.company_description': lead.description || '',
      
      // Información de ubicación
      'lead.address': lead.address || '',
      'lead.state': lead.state || '',
      'lead.country': lead.country || '',
      'lead.location': lead.location || `${lead.address || ''} ${lead.state || ''} ${lead.country || ''}`.trim(),
      
      // Información de actividad y categoría
      'lead.activity': lead.activity || lead.position || '',
      'lead.category': lead.category || lead.industry || '',
      'lead.industry': lead.industry || lead.category || '',
      
      // Información de validación
      'lead.email_validated': lead.emailValidated || lead.verified_email ? 'Sí' : 'No',
      'lead.phone_validated': lead.phoneValidated || lead.verified_phone ? 'Sí' : 'No',
      'lead.website_exists': lead.websiteExists || lead.verified_website ? 'Sí' : 'No',
      
      // Puntuación de calidad de datos
      'lead.data_quality_score': lead.data_quality_score?.toString() || '',
      'lead.data_quality_percentage': lead.data_quality_score ? `${(lead.data_quality_score / 5) * 100}%` : '',
      
      // Información del sistema
      'lead.created_at': lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-ES') : '',
      'lead.updated_at': lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('es-ES') : '',
      'lead.last_contacted_at': lead.last_contacted_at ? new Date(lead.last_contacted_at).toLocaleDateString('es-ES') : '',
      
      // Campos adicionales
      'lead.tags': lead.tags?.join(', ') || '',
      'lead.score': lead.score?.toString() || '',
      'lead.status': lead.status || 'nuevo',
      
      // Variables computadas
      'lead.full_name': lead.name || lead.company_name || 'Cliente',
      'lead.company_display': lead.company_name || lead.company || 'Empresa',
      'lead.activity_display': lead.activity || lead.position || 'Actividad',
      'lead.category_display': lead.category || lead.industry || 'Categoría',
      'lead.location_display': `${lead.state || ''} ${lead.country || ''}`.trim() || 'Ubicación',
      
      // Variables para saludos personalizados
      'lead.greeting': lead.name ? `Estimado/a ${lead.name}` : `Estimado/a representante de ${lead.company_name || 'su empresa'}`,
      'lead.formal_greeting': lead.name ? `Estimado/a ${lead.name}` : 'Estimado/a representante',
      'lead.casual_greeting': lead.name ? `Hola ${lead.name}` : 'Hola',
    };

    // Reemplazar todas las variables dinámicas
    Object.entries(leadVariables).forEach(([variable, value]) => {
      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      personalizedContent = personalizedContent.replace(regex, value);
    });

    return personalizedContent;
  }, []);

  const renderHtmlContent = useCallback((lead: Lead) => {
    if (!data.content || !lead) return data.content;

    const personalizedContent = personalizeEmail(data.content, lead);
    
    // Si es modo HTML, devolver el contenido tal como está
    if (data.contentMode === 'html') {
    return personalizedContent;
    }
    
    // Si es modo texto, convertir a HTML básico
    return personalizedContent
      .split('\n')
      .map(line => `<p>${line}</p>`)
      .join('');
  }, [data.content, data.contentMode, personalizeEmail]);

  // Validation
  useEffect(() => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required fields
    if (!data.subject.trim()) {
      errors.push({
        field: 'subject',
        message: 'El asunto es obligatorio',
        type: 'error'
      });
    }

    if (!data.content.trim()) {
      errors.push({
        field: 'content',
        message: 'El contenido es obligatorio',
        type: 'error'
      });
    }

    if (!data.senderEmail.trim()) {
      errors.push({
        field: 'senderEmail',
        message: 'El email del remitente es obligatorio',
        type: 'error'
        });
    }

    // Warnings
    if (data.subject.length > 78) {
      warnings.push({
        field: 'subject',
        message: 'El asunto es muy largo (máximo 78 caracteres)',
        type: 'warning'
      });
    }

    if (data.content.length > 50000) {
      warnings.push({
        field: 'content',
        message: 'El contenido es muy largo',
        type: 'warning'
      });
    }

    setValidation({
      errors,
      warnings,
      isValid: errors.length === 0
    });
  }, [data.subject, data.content, data.senderEmail]);

  // Send functions
  const sendEmail = useCallback(async () => {
    if (!validation.isValid) {
      throw new Error('El formulario no es válido');
    }

    setIsSending(true);
    try {
      // Enviar email usando Campaign Client
      const result = await campaignClient.sendEmail({
        to: data.previewLead?.email || 'test@example.com',
        name: data.previewLead?.name || data.previewLead?.company_name,
        subject: data.subject,
        htmlContent: data.contentMode === 'html' ? data.content : undefined,
        textContent: data.contentMode === 'text' ? data.content : undefined
      });

      if (!result.success) {
        throw new Error(result.error || 'Error al enviar email');
      }
      
      // Increment email count for single email
      await incrementEmailCount();
      
      setData(prev => ({ ...prev, emailSent: true }));
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  }, [validation.isValid, data]);

  const sendCampaign = useCallback(async (leads: Lead[]) => {
    if (!validation.isValid) {
      throw new Error('El formulario no es válido');
    }

    if (leads.length === 0) {
      throw new Error('No hay destinatarios seleccionados');
    }

    // Filtrar leads con emails válidos
    const validLeads = leads.filter(lead => lead.email && lead.email.trim() !== '');
    
    if (validLeads.length === 0) {
      throw new Error('No hay emails válidos para enviar');
    }

    console.log('Enviando campaña a', validLeads.length, 'destinatarios válidos');
    console.log('Asunto:', data.subject);
    console.log('Modo de contenido:', data.contentMode);

    setIsSending(true);
    try {
      // Enviar campaña usando Campaign Client
      const result = await campaignClient.sendCampaign({
        subject: data.subject,
        content: data.content,
        htmlContent: data.contentMode === 'html' ? data.content : undefined,
        senderName: process.env.NEXT_PUBLIC_BREVO_SENDER_NAME || 'RitterFinder Team',
        senderEmail: process.env.NEXT_PUBLIC_BREVO_SENDER_EMAIL || 'info@rittermor.energy',
        recipients: validLeads.map(lead => ({
          email: lead.email || '',
          name: lead.name || lead.company_name,
          // Pasar todos los datos del lead para personalización
          ...lead
        }))
      });

      console.log('Resultado de la campaña:', result);

      if (!result.success) {
        const errorMessage = result.failedCount > 0 
          ? `${result.failedCount} emails fallaron de ${result.sentCount + result.failedCount} intentos`
          : 'Error al enviar campaña';
        throw new Error(errorMessage);
      }
      
      // Increment email count for each successfully sent email
      if (result.sentCount > 0) {
        await incrementEmailCount(result.sentCount);
      }
      
      setData(prev => ({ ...prev, emailSent: true }));
    } catch (error) {
      console.error('Error sending campaign:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  }, [validation.isValid, data]);

  // Reset
  const reset = useCallback(() => {
    setData(DEFAULT_COMPOSER_DATA);
    setIsSending(false);
  }, []);

  return {
    data,
    updateField,
    setPreviewLead,
    setSubject,
    setContent,
    setHtmlContent,
    setSenderName,
    setSenderEmail,
    setIsHtmlMode,
    personalizeEmail,
    renderHtmlContent,
    validation,
    sendEmail,
    sendCampaign,
    isSending,
    reset
  };
};
