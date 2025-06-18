"use client"

import { useCallback } from 'react'
import type { Lead, NormalizedLead, LeadAdapter } from '../types'

interface UseLeadAdapterReturn extends LeadAdapter {
  adaptLeadsForCampaign: (normalizedLeads: NormalizedLead[]) => Lead[]
  getEmailFromLead: (normalized: NormalizedLead) => string
  validateLeadForCampaign: (lead: Lead) => { isValid: boolean; issues: string[] }
}

export const useLeadAdapter = (): UseLeadAdapterReturn => {
  
  // Inferir posición basada en actividad y categoría
  const inferPosition = useCallback((activity?: string, category?: string): string => {
    if (!activity && !category) return 'Contacto';
    
    // Mapeo de actividades a posiciones típicas
    const positionByActivity: Record<string, string> = {
      // Tecnología
      'desarrollo de software': 'CTO',
      'consultoría tecnológica': 'Consultor Senior',
      'programación': 'Desarrollador',
      'diseño web': 'Diseñador Web',
      
      // Ventas y Marketing
      'ventas': 'Director Comercial',
      'marketing digital': 'Director de Marketing',
      'publicidad': 'Director Creativo',
      'relaciones públicas': 'Director de Comunicación',
      
      // Construcción
      'construcción': 'Jefe de Obra',
      'arquitectura': 'Arquitecto',
      'ingeniería': 'Ingeniero',
      'reformas': 'Contratista',
      
      // Servicios
      'consultoría': 'Consultor',
      'asesoría': 'Asesor',
      'contabilidad': 'Contador',
      'legal': 'Abogado',
      
      // Retail y Restauración
      'restauración': 'Gerente',
      'comercio': 'Gerente de Tienda',
      'hostelería': 'Gerente',
      
      // Salud
      'medicina': 'Doctor',
      'farmacia': 'Farmacéutico',
      'clínica': 'Director Médico',
      
      // Educación
      'educación': 'Director',
      'formación': 'Coordinador de Formación',
      
      // Energía
      'energías renovables': 'Ingeniero Energético',
      'instalaciones solares': 'Técnico Solar',
      
      // Transporte
      'transporte': 'Jefe de Operaciones',
      'logística': 'Director de Logística',
      
      // Inmobiliaria
      'inmobiliaria': 'Agente Inmobiliario',
      'gestión inmobiliaria': 'Gestor Inmobiliario'
    };

    if (activity) {
      const activityLower = activity.toLowerCase();
      for (const [key, position] of Object.entries(positionByActivity)) {
        if (activityLower.includes(key)) {
          return position;
        }
      }
    }

    // Si no hay actividad específica, usar categoría
    const positionByCategory: Record<string, string> = {
      'tecnología': 'Responsable Técnico',
      'servicios': 'Responsable de Servicios',
      'comercio': 'Gerente Comercial',
      'construcción': 'Responsable de Proyectos',
      'salud': 'Responsable Sanitario',
      'educación': 'Responsable Académico',
      'energía': 'Responsable Energético',
      'transporte': 'Responsable de Operaciones',
      'inmobiliaria': 'Responsable Inmobiliario',
      'alimentación': 'Responsable de Calidad',
      'textil': 'Responsable de Producción',
      'automoción': 'Responsable Técnico'
    };

    if (category) {
      const categoryLower = category.toLowerCase();
      for (const [key, position] of Object.entries(positionByCategory)) {
        if (categoryLower.includes(key)) {
          return position;
        }
      }
    }

    return 'Responsable';
  }, []);

  // Crear nombre de contacto basado en el nombre de la empresa
  const createContactName = useCallback((companyName: string): string => {
    // Extraer posibles nombres de la empresa
    const cleanName = companyName
      .replace(/\b(SL|SA|SLU|CB|SLL|SCoop|SAT)\b/gi, '') // Quitar formas jurídicas
      .replace(/\b(Sociedad|Limitada|Anónima|Cooperativa)\b/gi, '') // Quitar palabras corporativas
      .trim();
    
    // Si el nombre limpio es muy corto, usar el original
    if (cleanName.length < 3) {
      return `Responsable de ${companyName}`;
    }
    
    return `Responsable de ${cleanName}`;
  }, []);

  // Obtener email del lead normalizado
  const getEmailFromLead = useCallback((normalized: NormalizedLead): string => {
    if (normalized.email) {
      return normalized.email;
    }
    
    // Intentar generar un email genérico si no hay uno
    if (normalized.company_website) {
      const domain = normalized.company_website.replace(/^https?:\/\//, '').replace(/^www\./, '');
      return `info@${domain}`;
    }
    
    // Email placeholder basado en el nombre de la empresa
    const companySlug = normalized.company_name.toLowerCase()
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
    
    if (normalized.activity) {
      notes.push(`Actividad: ${normalized.activity}`);
    }
    
    if (normalized.category) {
      notes.push(`Categoría: ${normalized.category}`);
    }
    
    // Información de contacto y ubicación
    if (normalized.address) {
      notes.push(`Dirección: ${normalized.address}`);
    }
    
    if (normalized.state) {
      notes.push(`Provincia: ${normalized.state}`);
    }
    

    
    // Información de validación (nueva estructura)
    const validations: string[] = [];
    if (normalized.verified_email) validations.push('Email verificado');
    if (normalized.verified_website) validations.push('Web verificada');
    if (normalized.verified_phone) validations.push('Teléfono verificado');
    
    if (validations.length > 0) {
      notes.push(`Verificaciones: ${validations.join(', ')}`);
    }
    
    // Puntuación de calidad (1-5, solo para filtros internos)
    if (normalized.data_quality_score) {
      notes.push(`Score de calidad: ${normalized.data_quality_score}/5`);
    }
    
    // Información del sistema
    notes.push(`Creado: ${new Date(normalized.created_at).toLocaleDateString()}`);
    
    return notes.join('\n');
  }, []);

  // Convertir lead normalizado a lead de campaña
  const fromNormalized = useCallback((normalized: NormalizedLead): Lead => {
    const email = getEmailFromLead(normalized);
    const contactName = createContactName(normalized.company_name);
    const position = inferPosition(normalized.activity, normalized.category);
    const notes = formatNotes(normalized);
    
    // Construir location a partir de address y state
    const locationParts = [normalized.address, normalized.state].filter(Boolean);
    const location = locationParts.join(', ');
    
    return {
      id: normalized.id,
      
      // Contact Information (from simplified schema)
      email: normalized.email,
      phone: normalized.phone,
      
      // Company Information (from simplified schema)
      company_name: normalized.company_name,
      company_website: normalized.company_website,
      
      // Location Information (from simplified schema - NO postal_code)
      address: normalized.address,
      state: normalized.state,
      country: normalized.country,
      
      // New Fields (from simplified schema)
      activity: normalized.activity,
      description: normalized.description,
      category: normalized.category,
      
      // Verification flags (new structure)
      verified_email: normalized.verified_email,
      verified_phone: normalized.verified_phone,
      verified_website: normalized.verified_website,
      data_quality_score: normalized.data_quality_score,
      
      // System Fields (from simplified schema)
      created_at: new Date(normalized.created_at),
      updated_at: new Date(normalized.updated_at),
      last_contacted_at: normalized.last_contacted_at ? new Date(normalized.last_contacted_at) : undefined,
      
      // Legacy computed fields for campaign compatibility
      name: contactName,
      company: normalized.company_name, // Alias
      website: normalized.company_website, // Alias
      position: position,
      industry: normalized.category || 'General',
      location: location,
      emailValidated: normalized.verified_email,
      phoneValidated: normalized.verified_phone,
      websiteExists: normalized.verified_website,
      
             // Campaign specific fields (defaults)
       status: 'new',
       score: normalized.data_quality_score,
       tags: [
         normalized.activity,
         normalized.category
       ].filter((tag): tag is string => Boolean(tag)),
      lastContact: normalized.last_contacted_at ? new Date(normalized.last_contacted_at) : undefined
    };
  }, [getEmailFromLead, createContactName, inferPosition, formatNotes]);

  // Convertir lead de campaña a normalizado (para updates)
  const toNormalized = useCallback((lead: Lead): Partial<NormalizedLead> => {
    return {
      id: lead.id,
      email: lead.email,
      verified_email: lead.verified_email || false,
      phone: lead.phone,
      verified_phone: lead.verified_phone || false,
      company_name: lead.company_name,
      company_website: lead.company_website,
      verified_website: lead.verified_website || false,
      address: lead.address,
      state: lead.state,
      country: lead.country,
      activity: lead.activity,
      description: lead.description,
      category: lead.category,
      data_quality_score: lead.data_quality_score || 1,
      updated_at: new Date().toISOString(),
      last_contacted_at: lead.last_contacted_at ? lead.last_contacted_at.toISOString() : undefined
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
    
    if (!lead.company_name || lead.company_name.trim().length < 2) {
      issues.push('Nombre de empresa no válido');
    }
    
    if (!lead.activity || lead.activity.trim().length < 2) {
      issues.push('Actividad de la empresa no especificada');
    }
    
    if (lead.data_quality_score && lead.data_quality_score < 2) {
      issues.push('Score de calidad muy bajo (menos de 2/5)');
    }
    
    if (lead.verified_email === false) {
      issues.push('Email no verificado');
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
    createCompanyName: createContactName, // Renamed function
    formatNotes,
    adaptLeadsForCampaign,
    getEmailFromLead,
    validateLeadForCampaign
  };
}; 