"use client"

import { useState, useEffect, useCallback } from 'react';
import { campaignClient } from '../../../lib/campaign-client';
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

    return content
      .replace(/\{\{name\}\}/g, lead.name || lead.company_name || '')
      .replace(/\{\{company\}\}/g, lead.company || lead.company_name || '')
      .replace(/\{\{email\}\}/g, lead.email || '')
      .replace(/\{\{position\}\}/g, lead.position || lead.activity || '')
      .replace(/\{\{industry\}\}/g, lead.industry || lead.category || '')
      .replace(/\{\{location\}\}/g, lead.location || '');
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
          name: lead.name || lead.company_name
        }))
      });

      console.log('Resultado de la campaña:', result);

      if (!result.success) {
        const errorMessage = result.failedCount > 0 
          ? `${result.failedCount} emails fallaron de ${result.sentCount + result.failedCount} intentos`
          : 'Error al enviar campaña';
        throw new Error(errorMessage);
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
