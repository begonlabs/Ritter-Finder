"use client"

import { useState, useEffect, useCallback } from 'react';
import type { 
  Lead, 
  EmailTemplate, 
  EmailComposerState, 
  EmailComposerActions,
  Language,
  Campaign,
  TemplateVariable
} from "../types"
import { AUTO_VARIABLES } from "../types"
import { useEmailTemplates } from './useEmailTemplates'

interface EmailComposerData {
  // Basic fields
  name: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  content: string;
  htmlContent?: string;
  
  // Template-related
  selectedTemplate: EmailTemplate | null;
  templateVariables: Record<string, string>;
  
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
  updateTemplateVariable: (variableName: string, value: string) => void;
  selectTemplate: (template: EmailTemplate | null) => void;
  clearTemplate: () => void;
  setPreviewLead: (lead: Lead) => void;
  setSubject: (subject: string) => void;
  setContent: (content: string) => void;
  setHtmlContent: (htmlContent: string) => void;
  setSenderName: (name: string) => void;
  setSenderEmail: (email: string) => void;
  setSelectedTemplate: (template: EmailTemplate | null) => void;
  setIsHtmlMode: (isHtml: boolean) => void;
  setTemplateVariable: (key: string, value: string) => void;
  
  // Content processing
  getProcessedContent: () => string;
  getProcessedSubject: () => string;
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
  
  // Loading and template
  loadTemplate: (templateId?: string) => Promise<void>;
  
  // Reset
  reset: () => void;
}

const DEFAULT_COMPOSER_DATA: EmailComposerData = {
  name: '',
  subject: '',
  senderName: 'RitterFinder',
  senderEmail: 'no-reply@ritterfinder.com',
  content: '',
  htmlContent: '',
  selectedTemplate: null,
  templateVariables: {},
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

  // Update template variables
  const updateTemplateVariable = useCallback((variableName: string, value: string) => {
    setData(prev => ({
      ...prev,
      templateVariables: {
        ...prev.templateVariables,
        [variableName]: value
      }
    }));
  }, []);

  // Select template
  const selectTemplate = useCallback((template: EmailTemplate | null) => {
    if (!template) {
      setData(prev => ({
        ...prev,
        selectedTemplate: null,
        templateVariables: {},
        subject: '',
        content: ''
      }));
      return;
    }

    // Initialize template variables with default values (solo variables personalizadas)    
    const initialVariables: Record<string, string> = {};
    template.variables?.forEach(variable => {
      // Solo inicializar variables personalizadas
      if (!AUTO_VARIABLES.includes(variable.key)) {
        initialVariables[variable.key] = variable.defaultValue || '';
      }
    });

    setData(prev => ({
      ...prev,
      selectedTemplate: template,
      templateVariables: initialVariables,
      subject: template.subject,
      content: template.htmlContent || template.plainTextContent || '',
      contentMode: template.htmlContent ? 'html' : 'text'
    }));
  }, []);

  // Clear template
  const clearTemplate = useCallback(() => {
    selectTemplate(null);
  }, [selectTemplate]);

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

  const setSelectedTemplate = useCallback((template: EmailTemplate | null) => {
    selectTemplate(template);
  }, [selectTemplate]);

  const setIsHtmlMode = useCallback((isHtmlMode: boolean) => {
    setData(prev => ({ ...prev, isHtmlMode, contentMode: isHtmlMode ? 'html' : 'text' }));
  }, []);

  const setTemplateVariable = useCallback((key: string, value: string) => {
    updateTemplateVariable(key, value);
  }, [updateTemplateVariable]);

  // Process content with template variables
  const replaceVariables = useCallback((text: string, variables: Record<string, string>): string => {
    // Ensure text is a string
    if (!text || typeof text !== 'string') {
      return '';
    }

    let processedText = text;
    
    // Ensure variables is an object
    if (!variables || typeof variables !== 'object') {
      return processedText;
    }
    
    Object.entries(variables).forEach(([key, value]) => {
      // Skip if key is invalid
      if (!key || typeof key !== 'string') {
        return;
      }

      // Ensure value is a string
      const safeValue = value != null ? String(value) : `[${key}]`;
      
      // Replace various formats: {{variable}}, {variable}, [variable]
      const patterns = [
        new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'),
        new RegExp(`\\{\\s*${key}\\s*\\}`, 'g'),
        new RegExp(`\\[\\s*${key}\\s*\\]`, 'g'),
        new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g')
      ];
      
      patterns.forEach(pattern => {
        try {
          processedText = processedText.replace(pattern, safeValue);
        } catch (error) {
          console.warn(`Error replacing pattern ${pattern} with value ${safeValue}:`, error);
        }
      });
    });
    
    return processedText;
  }, []);

  // Get processed content
  const getProcessedContent = useCallback((): string => {
    if (!data.selectedTemplate) {
      return data.content || '';
    }

    const baseContent = data.contentMode === 'html' 
      ? data.selectedTemplate.htmlContent 
      : data.selectedTemplate.plainTextContent;

    return replaceVariables(baseContent || data.content || '', data.templateVariables || {});
  }, [data, replaceVariables]);

  // Get processed subject
  const getProcessedSubject = useCallback((): string => {
    if (!data.selectedTemplate) {
      return data.subject || '';
    }

    return replaceVariables(data.selectedTemplate.subject || '', data.templateVariables || {});
  }, [data, replaceVariables]);

  // Personalize email content with lead data
  const personalizeEmail = useCallback((content: string, lead: Lead): string => {
    // Ensure content and lead are valid
    if (!content || typeof content !== 'string') {
      return '';
    }

    if (!lead) {
      return content;
    }

    let personalizedContent = content;

    // Split name into first and last names if needed
    const nameParts = (lead.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Replace standard lead variables - ensure all values are strings
    const leadVariables: Record<string, string> = {
      // Variables básicas
      'contact_name': String(lead.name || ''),
      'company_name': String(lead.company || ''),
      'contact_email': String(lead.email || ''),
      'contact_phone': String(lead.phone || ''),
      'first_name': String(firstName),
      'last_name': String(lastName),
      'full_name': String(lead.name || ''),
      'lead_id': String(lead.id || ''),
      'position': String(lead.position || ''),
      'industry': String(lead.industry || ''),
      
      // Variables de datos normalizados
      'location': String(lead.location || ''),
      'confidence_score': String(Math.round((lead.confidence || 0) * 100)),
      'source_type': String(lead.source || ''),
      'website': String(lead.website || ''),
      'cif_nif': String(lead.cif || ''),
      'legal_form': String(lead.legalForm || ''),
      'cnae_code': String(lead.cnaeCode || ''),
      'employees': String(lead.employees || ''),
      'revenue': String(lead.revenue || ''),
      
      // Variables calculadas
      'has_website': lead.hasWebsite ? 'Sí' : 'No',
      'website_validated': lead.websiteExists ? 'Validada' : 'No validada',
      'email_validated': lead.emailValidated ? 'Validado' : 'No validado',
      'phone_validated': lead.phoneValidated ? 'Validado' : 'No validado',
      'confidence_level': (lead.confidence || 0) > 0.7 ? 'Alta' : (lead.confidence || 0) > 0.4 ? 'Media' : 'Baja'
    };

    // Apply lead variables
    personalizedContent = replaceVariables(personalizedContent, leadVariables);

    // Apply template variables if template is selected
    if (data.selectedTemplate && data.templateVariables) {
      personalizedContent = replaceVariables(personalizedContent, data.templateVariables);
    }

    return personalizedContent;
  }, [data, replaceVariables]);

  // Render HTML content for a specific lead
  const renderHtmlContent = useCallback((lead: Lead): string => {
    if (!lead) {
      return '';
    }

    const baseContent = data.contentMode === 'html' 
      ? (data.selectedTemplate?.htmlContent || data.content || '')
      : (data.content || '');

    return personalizeEmail(baseContent, lead);
  }, [data, personalizeEmail]);

  // Validation
  const validateData = useCallback((): {
    errors: ValidationError[];
    warnings: ValidationError[];
    isValid: boolean;
  } => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required fields
    if (!data.name.trim()) {
      errors.push({
        field: 'name',
        message: 'El nombre de la campaña es obligatorio',
        type: 'error'
      });
    }

    if (!data.subject.trim() && !data.selectedTemplate?.subject.trim()) {
      errors.push({
        field: 'subject',
        message: 'El asunto del email es obligatorio',
        type: 'error'
      });
    }

    if (!data.content.trim() && !data.selectedTemplate?.htmlContent && !data.selectedTemplate?.plainTextContent) {
      errors.push({
        field: 'content',
        message: 'El contenido del email es obligatorio',
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.senderEmail && !emailRegex.test(data.senderEmail)) {
      errors.push({
        field: 'senderEmail',
        message: 'El email del remitente no es válido',
        type: 'error'
      });
    }

    // Template variable validation (solo variables personalizadas)
    if (data.selectedTemplate?.variables) {
      // Filtrar variables automáticas
      data.selectedTemplate.variables
        .filter(variable => !AUTO_VARIABLES.includes(variable.key))
        .forEach(variable => {
          const value = data.templateVariables[variable.key];
          
          if (variable.required && (!value || !value.trim())) {
            errors.push({
              field: `templateVariable_${variable.key}`,
              message: `La variable personalizada "${variable.key}" es obligatoria`,
              type: 'error'
            });
          }
        });
    }

    // Warnings
    if (data.recipientCount === 0) {
      warnings.push({
        field: 'recipients',
        message: 'No hay destinatarios seleccionados para esta campaña',
        type: 'warning'
      });
    }

    if (data.contentMode === 'html' && data.content.length > 102400) { // 100KB
      warnings.push({
        field: 'content',
        message: 'El contenido HTML es muy largo, puede afectar la entrega',
        type: 'warning'
      });
    }

    if (data.subject.length > 78) {
      warnings.push({
        field: 'subject',
        message: 'El asunto es muy largo, puede cortarse en algunos clientes de email',
        type: 'warning'
      });
    }

    return {
      errors,
      warnings,
      isValid: errors.length === 0
    };
  }, [data]);

  // Send email
  const sendEmail = useCallback(async (): Promise<void> => {
    if (!validation.isValid) {
      throw new Error('El formulario contiene errores que deben corregirse');
    }

    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here would be the actual API call
      const emailData = {
        name: data.name,
        subject: getProcessedSubject(),
        content: getProcessedContent(),
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        contentMode: data.contentMode,
        templateId: data.selectedTemplate?.id,
        templateVariables: data.templateVariables,
        recipientCount: data.recipientCount,
        leadId: data.leadId
      };

      console.log('Sending email:', emailData);
      
      // Reset form after successful send
      reset();
      
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  }, [data, validation.isValid, getProcessedContent, getProcessedSubject]);

  // Send campaign
  const sendCampaign = useCallback(async (leads: Lead[]): Promise<void> => {
    if (!validation.isValid) {
      throw new Error('El formulario contiene errores que deben corregirse');
    }

    setData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here would be the actual API call
      const campaignData = {
        subject: getProcessedSubject(),
        content: getProcessedContent(),
        htmlContent: data.htmlContent,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        templateId: data.selectedTemplate?.id,
        templateVariables: data.templateVariables,
        leads: leads
      };

      console.log('Sending campaign:', campaignData);
      
      setData(prev => ({ ...prev, emailSent: true }));
      
    } catch (error) {
      console.error('Error sending campaign:', error);
      throw error;
    } finally {
      setData(prev => ({ ...prev, isLoading: false }));
    }
  }, [data, validation.isValid, getProcessedContent, getProcessedSubject]);

  // Load template
  const loadTemplate = useCallback(async (templateId?: string): Promise<void> => {
    if (!templateId) return;
    
    setData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call to load template
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here would be the actual API call to fetch template
      console.log('Loading template:', templateId);
      
    } catch (error) {
      console.error('Error loading template:', error);
      throw error;
    } finally {
      setData(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setData(DEFAULT_COMPOSER_DATA);
  }, []);

  // Update validation when data changes
  useEffect(() => {
    const validationResult = validateData();
    setValidation(validationResult);
  }, [validateData]);

  return {
    data,
    updateField,
    updateTemplateVariable,
    selectTemplate,
    clearTemplate,
    setPreviewLead,
    setSubject,
    setContent,
    setHtmlContent,
    setSenderName,
    setSenderEmail,
    setSelectedTemplate,
    setIsHtmlMode,
    setTemplateVariable,
    getProcessedContent,
    getProcessedSubject,
    personalizeEmail,
    renderHtmlContent,
    validation,
    sendEmail,
    sendCampaign,
    isSending,
    loadTemplate,
    reset
  };
};
