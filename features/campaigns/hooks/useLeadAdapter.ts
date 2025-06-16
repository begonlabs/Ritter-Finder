"use client"

import { useCallback } from 'react'
import type { Lead, NormalizedLead, LeadAdapter } from '../types'

interface UseLeadAdapterReturn extends LeadAdapter {
  adaptLeadsForCampaign: (normalizedLeads: NormalizedLead[]) => Lead[]
  getEmailFromLead: (normalized: NormalizedLead) => string
  validateLeadForCampaign: (lead: Lead) => { isValid: boolean; issues: string[] }
}

export const useLeadAdapter = (): UseLeadAdapterReturn => {
  
  // Inferir posición basada en forma jurídica e industria
  const inferPosition = useCallback((legalForm?: string, industry?: string): string => {
    if (!legalForm && !industry) return 'Contacto';
    
    // Mapeo de formas jurídicas a posiciones típicas
    const positionByLegalForm: Record<string, string> = {
      // Sociedades
      'SA': 'Director General',
      'SL': 'Gerente',
      'SLU': 'Administrador Único',
      'SLL': 'Gerente',
      'SRC': 'Gerente',
      'SAL': 'Director General',
      'SLNE': 'Administrador',
      
      // Personas físicas
      'Empresario Individual': 'Propietario',
      'Autónomo': 'Autónomo',
      'Profesional Liberal': 'Profesional',
      
      // Cooperativas
      'Cooperativa': 'Presidente',
      'SAT': 'Presidente',
      
      // Otras formas
      'Asociación': 'Presidente',
      'Fundación': 'Director',
      'ONG': 'Director',
      'Administración Pública': 'Responsable'
    };

    if (legalForm && positionByLegalForm[legalForm]) {
      return positionByLegalForm[legalForm];
    }

    // Si no hay forma jurídica específica, usar industria
    const positionByIndustry: Record<string, string> = {
      'tecnología': 'CTO',
      'marketing': 'Director de Marketing',
      'ventas': 'Director Comercial',
      'finanzas': 'Director Financiero',
      'construcción': 'Jefe de Obra',
      'restauración': 'Gerente',
      'retail': 'Gerente de Tienda',
      'consultoría': 'Consultor Senior',
      'educación': 'Director',
      'salud': 'Director Médico',
      'energía': 'Ingeniero Principal',
      'transporte': 'Jefe de Operaciones',
      'inmobiliaria': 'Agente Inmobiliario'
    };

    if (industry) {
      const industryLower = industry.toLowerCase();
      for (const [key, position] of Object.entries(positionByIndustry)) {
        if (industryLower.includes(key)) {
          return position;
        }
      }
    }

    return 'Responsable';
  }, []);

  // Crear nombre de empresa combinando nombre y forma jurídica
  const createCompanyName = useCallback((name: string, legalForm?: string): string => {
    if (!legalForm || name.includes(legalForm)) {
      return name;
    }
    
    // Si la forma jurídica es muy común, agregarla
    const commonForms = ['SL', 'SA', 'SLU', 'CB', 'SLL'];
    if (commonForms.includes(legalForm)) {
      return `${name} ${legalForm}`;
    }
    
    return name;
  }, []);

  // Obtener email del lead normalizado
  const getEmailFromLead = useCallback((normalized: NormalizedLead): string => {
    if (normalized.email_found) {
      return normalized.email_found;
    }
    
    // Intentar generar un email genérico si no hay uno
    if (normalized.website) {
      const domain = normalized.website.replace(/^https?:\/\//, '').replace(/^www\./, '');
      return `info@${domain}`;
    }
    
    // Email placeholder
    const companySlug = normalized.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]/g, '') // Solo letras y números
      .substring(0, 20);
    
    return `contacto@${companySlug}.es`;
  }, []);

  // Formatear notas con información disponible
  const formatNotes = useCallback((normalized: NormalizedLead): string => {
    const notes: string[] = [];
    
    // Información básica
    if (normalized.description) {
      notes.push(`Descripción: ${normalized.description}`);
    }
    
    if (normalized.business_object) {
      notes.push(`Objeto social: ${normalized.business_object}`);
    }
    
    if (normalized.activities) {
      notes.push(`Actividades: ${normalized.activities}`);
    }
    
    // Información legal y técnica
    if (normalized.cif_nif) {
      notes.push(`CIF/NIF: ${normalized.cif_nif}`);
    }
    
    if (normalized.cnae_code) {
      notes.push(`CNAE: ${normalized.cnae_code}`);
    }
    
    if (normalized.constitution_date) {
      notes.push(`Fecha constitución: ${normalized.constitution_date}`);
    }
    
    // Validaciones
    const validations: string[] = [];
    if (normalized.email_validated) validations.push('Email validado');
    if (normalized.website_validated) validations.push('Web validada');
    if (normalized.phone_validated) validations.push('Teléfono validado');
    
    if (validations.length > 0) {
      notes.push(`Validaciones: ${validations.join(', ')}`);
    }
    
    // Información de scraping
    notes.push(`Fuente: ${normalized.source_type}`);
    notes.push(`Scraped: ${new Date(normalized.scraped_at).toLocaleDateString()}`);
    
    return notes.join('\n');
  }, []);

  // Convertir lead normalizado a lead de campaña
  const fromNormalized = useCallback((normalized: NormalizedLead): Lead => {
    const email = getEmailFromLead(normalized);
    const position = inferPosition(normalized.legal_form, normalized.industry);
    const company = createCompanyName(normalized.name, normalized.legal_form);
    const notes = formatNotes(normalized);
    
    return {
      id: normalized.id,
      name: normalized.name,
      email: email,
      company: company,
      position: position,
      industry: normalized.industry || 'General',
      phone: normalized.phone,
      website: normalized.website,
      notes: notes,
      
      // Campos adicionales de datos normalizados
      location: `${normalized.city}, ${normalized.province}`,
      confidence: normalized.confidence_score,
      source: normalized.source_type,
      sourceUrl: normalized.source_url,
      hasWebsite: !!normalized.website,
      websiteExists: normalized.website_validated,
      emailValidated: normalized.email_validated,
      phoneValidated: normalized.phone_validated,
      employees: normalized.estimated_employees,
      revenue: normalized.estimated_revenue,
      cif: normalized.cif_nif,
      legalForm: normalized.legal_form,
      cnaeCode: normalized.cnae_code,
      
      // Campos por defecto
      status: 'new',
      score: Math.round(normalized.confidence_score * 100),
      tags: [
        normalized.source_type,
        normalized.industry,
        ...(normalized.legal_form ? [normalized.legal_form] : [])
      ].filter(Boolean),
      lastContact: undefined
    };
  }, [getEmailFromLead, inferPosition, createCompanyName, formatNotes]);

  // Convertir lead de campaña a normalizado (para updates)
  const toNormalized = useCallback((lead: Lead): Partial<NormalizedLead> => {
    return {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      website: lead.website,
      industry: lead.industry,
      email_found: lead.email,
      cif_nif: lead.cif,
      legal_form: lead.legalForm,
      cnae_code: lead.cnaeCode,
      estimated_employees: lead.employees,
      estimated_revenue: lead.revenue,
      confidence_score: lead.confidence || 0.5,
      last_updated: new Date().toISOString()
    };
  }, []);

  // Adaptar array de leads para campañas
  const adaptLeadsForCampaign = useCallback((normalizedLeads: NormalizedLead[]): Lead[] => {
    return normalizedLeads.map(fromNormalized);
  }, [fromNormalized]);

  // Validar lead para campaña
  const validateLeadForCampaign = useCallback((lead: Lead): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (!lead.email || lead.email.includes('placeholder') || lead.email.includes('@example.')) {
      issues.push('Email no válido o es placeholder');
    }
    
    if (!lead.name || lead.name.trim().length < 2) {
      issues.push('Nombre demasiado corto');
    }
    
    if (!lead.company || lead.company.trim().length < 2) {
      issues.push('Nombre de empresa no válido');
    }
    
    if (lead.confidence && lead.confidence < 0.3) {
      issues.push('Confianza muy baja en los datos');
    }
    
    if (!lead.emailValidated && lead.source !== 'manual') {
      issues.push('Email no validado automáticamente');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }, []);

  return {
    fromNormalized,
    toNormalized,
    inferPosition,
    createCompanyName,
    formatNotes,
    adaptLeadsForCampaign,
    getEmailFromLead,
    validateLeadForCampaign
  };
}; 