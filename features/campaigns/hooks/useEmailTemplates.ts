import { useState, useCallback, useMemo } from 'react';
import { EmailTemplate, TemplateFilters } from '../types';

// Obtener el dominio desde las variables de entorno
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://ritterfinder.begonlabs.com';

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
    name: 'Contacto Inicial',
    description: 'Template básico para primer contacto con leads',
    subject: 'Soluciones Energéticas para {{lead.company_name}} - RitterFinder',
    htmlContent: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>RitterFinder - Soluciones Energéticas</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 20px; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🌱 RitterFinder</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Soluciones Energéticas Profesionales</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
            <p>Hola <strong>{{lead.greeting}}</strong>,</p>

            <p>Te escribo desde <strong>RitterFinder</strong>, donde ayudamos a empresas
               de <em>{{lead.category}}</em> a <strong>optimizar su consumo energético y reducir costes</strong> mediante
               soluciones renovables personalizadas.</p>

            <p>Encontramos tu contacto público y creemos que
               esta idea podría ser útil para <strong>{{lead.company_name}}</strong>:</p>

            <ul style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <li style="margin-bottom: 10px;"><strong>Problema típico:</strong> Altos costes energéticos y dependencia de combustibles fósiles</li>
                <li style="margin-bottom: 10px;"><strong>Nuestra solución:</strong> Instalaciones solares fotovoltaicas llave en mano</li>
                <li style="margin-bottom: 0;"><strong>Resultados:</strong> 40-60% de ahorro energético en 5-7 años</li>
            </ul>

            <p>Basándonos en que {{lead.company_name}} se dedica a <strong>{{lead.activity}}</strong> 
               en <strong>{{lead.location_display}}</strong>, creemos que nuestras soluciones 
               pueden ser de gran valor para su organización.</p>

            <p>¿Te interesa? Responde a este correo </p>

            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 0.9em; color: #92400e;">
                   ⚠️ Si prefieres no recibir más mensajes, haz clic
                   <a href="${DOMAIN}/unsubscribe?email={{lead.contact_email}}" style="color: #d97706;">aquí</a>.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 20px; border-top: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 15px;">
                <p style="margin: 0; font-size: 0.9em; color: #6b7280;">
                    <strong>Equipo RitterFinder</strong> · Consultores Energéticos · RitterFinder Energy<br/>
                    📞 +34 900 123 456 · ✉️ info@ritterfinder.com<br/>
                    🌐 <a href="${DOMAIN}" style="color: #3b82f6;">${DOMAIN.replace('https://', '')}</a>
                </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #d1d5db; margin: 15px 0;" />
            
            <p style="font-size: 0.8em; color: #6b7280; margin: 0; text-align: center;">
                <strong>Información legal y protección de datos</strong><br/>
                Este mensaje se dirige a empresas cuyos datos de contacto se encuentran publicados en fuentes públicas. 
                La base jurídica del tratamiento es el interés legítimo para comunicaciones profesionales (art. 6.1.f RGPD y art. 21.2 LSSI).<br/>
                Puedes ejercer tus derechos de acceso, rectificación, supresión u oposición escribiéndonos a: 
                <a href="mailto:info@rittermor.energy" style="color: #3b82f6;">info@rittermor.energy</a>
            </p>
        </div>
    </div>
</body>
</html>`,
    plainTextContent: `
🌱 RITTERFINDER - SOLUCIONES ENERGÉTICAS PROFESIONALES

Hola {{lead.greeting}},

Te escribo desde RitterFinder, donde ayudamos a empresas de {{lead.category}} a optimizar su consumo energético y reducir costes mediante soluciones renovables personalizadas.

Encontramos tu contacto público y creemos que esta idea podría ser útil para {{lead.company_name}}:

PROBLEMA TÍPICO: Altos costes energéticos y dependencia de combustibles fósiles
NUESTRA SOLUCIÓN: Instalaciones solares fotovoltaicas llave en mano
RESULTADOS: 40-60% de ahorro energético en 5-7 años

Basándonos en que {{lead.company_name}} se dedica a {{lead.activity}} en {{lead.location_display}}, creemos que nuestras soluciones pueden ser de gran valor para su organización.

¿Te interesa? Responde a este correo

⚠️ Si prefieres no recibir más mensajes, haz clic aquí: ${DOMAIN}/unsubscribe?email={{lead.contact_email}}.

---

Equipo RitterFinder · Consultores Energéticos · RitterFinder Energy
📞 +34 900 123 456 · ✉️ info@ritterfinder.com
🌐 ${DOMAIN}

---

INFORMACIÓN LEGAL Y PROTECCIÓN DE DATOS
Este mensaje se dirige a empresas cuyos datos de contacto se encuentran publicados en fuentes públicas. La base jurídica del tratamiento es el interés legítimo para comunicaciones profesionales (art. 6.1.f RGPD y art. 21.2 LSSI).
Puedes ejercer tus derechos de acceso, rectificación, supresión u oposición escribiéndonos a: info@rittermor.energy
`,
    category: 'sales',
    isActive: true,
    variables: [
      // Variables automáticas: todas las variables lead.* se cargan automáticamente
      { key: 'custom_message', label: 'Mensaje personalizado adicional', description: 'Mensaje personalizado adicional', required: false, defaultValue: '', type: 'text' },
      { key: 'sender_name', label: 'Nombre del remitente', description: 'Nombre del remitente', required: true, defaultValue: 'Equipo RitterFinder', type: 'text' },
      { key: 'sender_position', label: 'Cargo del remitente', description: 'Cargo del remitente', required: false, defaultValue: 'Consultor Energético', type: 'text' }
    ],
    usageCount: 0,
    createdBy: 'admin',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
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