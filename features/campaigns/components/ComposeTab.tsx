"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { 
  Send, 
  Eye, 
  Users, 
  FileText, 
  Mail, 
  Building, 
  MapPin, 
  Activity, 
  Tag,
  Info,
  Copy,
  Check,
  Code,
  Type,
  FileCode
} from 'lucide-react';
import { Lead, EmailTemplate } from '../types';
import { UseEmailComposerReturn } from '../hooks/useEmailComposer';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import styles from '../styles/ComposeTab.module.css';

// Componente para mostrar variables disponibles
const VariablesHelper = ({ onInsertVariable }: { onInsertVariable: (variable: string) => void }) => {
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const variableCategories = [
    {
      title: 'Información de Contacto',
      icon: <Mail className="w-4 h-4" />,
      variables: [
        { key: '{{lead.contact_name}}', description: 'Nombre del contacto' },
        { key: '{{lead.contact_email}}', description: 'Email del contacto' },
        { key: '{{lead.contact_phone}}', description: 'Teléfono del contacto' },
      ]
    },
    {
      title: 'Información de Empresa',
      icon: <Building className="w-4 h-4" />,
      variables: [
        { key: '{{lead.company_name}}', description: 'Nombre de la empresa' },
        { key: '{{lead.company_website}}', description: 'Sitio web de la empresa' },
        { key: '{{lead.company_description}}', description: 'Descripción de la empresa' },
      ]
    },
    {
      title: 'Ubicación',
      icon: <MapPin className="w-4 h-4" />,
      variables: [
        { key: '{{lead.address}}', description: 'Dirección' },
        { key: '{{lead.state}}', description: 'Estado/Provincia' },
        { key: '{{lead.country}}', description: 'País' },
        { key: '{{lead.location_display}}', description: 'Ubicación formateada' },
      ]
    },
    {
      title: 'Actividad y Categoría',
      icon: <Activity className="w-4 h-4" />,
      variables: [
        { key: '{{lead.activity}}', description: 'Actividad principal' },
        { key: '{{lead.category}}', description: 'Categoría de la empresa' },
        { key: '{{lead.industry}}', description: 'Industria' },
      ]
    },
    {
      title: 'Saludos Personalizados',
      icon: <FileText className="w-4 h-4" />,
      variables: [
        { key: '{{lead.greeting}}', description: 'Saludo formal personalizado' },
        { key: '{{lead.formal_greeting}}', description: 'Saludo formal' },
        { key: '{{lead.casual_greeting}}', description: 'Saludo casual' },
      ]
    },
    {
      title: 'Validación de Datos',
      icon: <Check className="w-4 h-4" />,
      variables: [
        { key: '{{lead.email_validated}}', description: 'Email validado (Sí/No)' },
        { key: '{{lead.phone_validated}}', description: 'Teléfono validado (Sí/No)' },
        { key: '{{lead.website_exists}}', description: 'Sitio web existe (Sí/No)' },
        { key: '{{lead.data_quality_score}}', description: 'Puntuación de calidad (1-5)' },
        { key: '{{lead.data_quality_percentage}}', description: 'Porcentaje de calidad' },
      ]
    }
  ];

  const handleCopyVariable = async (variable: string) => {
    try {
      await navigator.clipboard.writeText(variable);
      setCopiedVariable(variable);
      setTimeout(() => setCopiedVariable(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className={styles.variablesHelper}>
      <div className={styles.variablesHeader}>
        <h4 className={styles.variablesTitle}>
          <Info className="w-4 h-4 mr-2" />
          Variables Disponibles
        </h4>
        <p className={styles.variablesDescription}>
          Haz clic en cualquier variable para copiarla al portapapeles
        </p>
      </div>
      
      <div className={styles.variablesGrid}>
        {variableCategories.map((category) => (
          <Card key={category.title} className={styles.variableCategory}>
            <CardHeader className={styles.categoryHeader}>
              <div className={styles.categoryIcon}>
                {category.icon}
              </div>
              <CardTitle className={styles.categoryTitle}>
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.categoryContent}>
              <div className={styles.variablesList}>
                {category.variables.map((variable) => (
                  <TooltipProvider key={variable.key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.variableButton}
                          onClick={() => {
                            handleCopyVariable(variable.key);
                            onInsertVariable(variable.key);
                          }}
                        >
                          <span className={styles.variableKey}>{variable.key}</span>
                          {copiedVariable === variable.key && (
                            <Check className="w-3 h-3 ml-2 text-green-600" />
                          )}
                          {copiedVariable !== variable.key && (
                            <Copy className="w-3 h-3 ml-2 opacity-50" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{variable.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface ComposeTabProps {
  composer: UseEmailComposerReturn;
  selectedLeads: Lead[];
  recipientCount?: number;
  leadId?: string;
  onSuccess?: () => void;
}

export const ComposeTab: React.FC<ComposeTabProps> = ({
  composer,
  selectedLeads,
  recipientCount = 0,
  leadId,
  onSuccess
}) => {
  const {
    data,
    updateField,
    validation,
    sendEmail,
    isSending
  } = composer;

  const [showVariables, setShowVariables] = useState(false);
  const { templates, getTemplatesByCategory } = useEmailTemplates();

  React.useEffect(() => {
    updateField('recipientCount', selectedLeads.length);
    if (leadId) {
      updateField('leadId', leadId);
    }
  }, [selectedLeads.length, leadId, updateField]);

  // Set preview lead only when leads array changes
  const leadsHashRef = React.useRef<string>('');
  
  React.useEffect(() => {
    const currentHash = selectedLeads.map(lead => lead.id).join(',');
    
    if (selectedLeads.length > 0 && currentHash !== leadsHashRef.current) {
      composer.setPreviewLead(selectedLeads[0]);
      leadsHashRef.current = currentHash;
    } else if (selectedLeads.length === 0) {
      leadsHashRef.current = '';
    }
  }, [selectedLeads, composer.setPreviewLead]);

  const handleSend = async () => {
    try {
      if (composer.sendCampaign) {
        await composer.sendCampaign(selectedLeads);
      } else {
        await sendEmail();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = data.content;
      
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
      updateField('content', newValue);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find(template => template.id === templateId);
    if (selectedTemplate) {
      // Cargar el contenido HTML de la plantilla
      updateField('content', selectedTemplate.htmlContent);
      // También actualizar el asunto si está vacío
      if (!data.subject.trim()) {
        updateField('subject', selectedTemplate.subject);
      }
    }
  };

  // Obtener plantillas organizadas por categoría
  const templatesByCategory = getTemplatesByCategory();

  return (
    <div className={styles.composeTab}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            <Mail className={styles.titleIcon} size={20} />
            Crear Campaña de Email
          </h2>
          <p className={styles.description}>
            Crea y personaliza tu campaña de email marketing
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>

          {/* Content Mode Section */}
          <section className={styles.contentModeSection}>
            <div className={styles.modeToggle}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                  Modo de Contenido
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  Elige entre texto plano o HTML para tu email
                </p>
              </div>

              <div className={styles.toggleControls}>
                <div className={`${styles.modeLabel} ${data.contentMode === 'text' ? styles.active : ''}`}>
                  <Type size={16} />
                  Texto
                </div>
                
                <Switch
                  checked={data.contentMode === 'html'}
                  onCheckedChange={(checked: boolean) => updateField('contentMode', checked ? 'html' : 'text')}
                  className={styles.modeSwitch}
                />
                
                <div className={`${styles.modeLabel} ${data.contentMode === 'html' ? styles.active : ''}`}>
                  <Code size={16} />
                  HTML
                </div>
              </div>
            </div>
          </section>

          {/* Template Selector - Solo visible en modo HTML */}
          {data.contentMode === 'html' && (
            <section className={styles.templateSection}>
              <div className={styles.templateHeader}>
                <div className={styles.templateTitle}>
                  <FileCode className={styles.templateIcon} size={18} />
                  <h3 className={styles.templateTitleText}>Seleccionar Plantilla HTML</h3>
                </div>
                <p className={styles.templateDescription}>
                  Elige una plantilla para empezar con un diseño profesional
                </p>
              </div>

              <div className={styles.templateSelector}>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger className={styles.templateSelect}>
                    <SelectValue placeholder="Selecciona una plantilla..." />
                  </SelectTrigger>
                  <SelectContent className={styles.templateDropdown}>
                    {templates.map((template) => (
                      <SelectItem 
                        key={template.id} 
                        value={template.id}
                        className={styles.templateOption}
                      >
                        <div className={styles.templateOptionContent}>
                          <div className={styles.templateOptionInfo}>
                            <span className={styles.templateOptionName}>{template.name}</span>
                            <span className={styles.templateOptionDescription}>
                              {template.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}

          {/* Form Fields */}
          <div className={styles.formGroup}>
            <Label htmlFor="campaignName" className={styles.formLabel}>
              Nombre de la Campaña <span style={{ color: '#ef4444' }}>*</span>
            </Label>
            <Input 
              id="campaignName"
              type="text"
              className={styles.formInput}
              placeholder="Ej: Newsletter Enero 2025"
              value={data.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="subject" className={styles.formLabel}>
              Asunto del Email <span style={{ color: '#ef4444' }}>*</span>
            </Label>
            <Input
              id="subject"
              type="text"
              className={styles.formInput}
              placeholder="Escribe el asunto de tu email"
              value={data.subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('subject', e.target.value)}
            />
            {data.subject.length > 78 && (
              <div className={styles.helperText}>
                ⚠️ El asunto es muy largo ({data.subject.length} caracteres)
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.formLabel}>
              <Label htmlFor="content">
                Contenido del Email <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowVariables(!showVariables)}
                className={styles.variablesToggle}
              >
                <Tag className="w-4 h-4 mr-2" />
                {showVariables ? 'Ocultar' : 'Mostrar'} Variables
              </Button>
            </div>
            
            {showVariables && (
              <VariablesHelper onInsertVariable={handleInsertVariable} />
            )}
            
            <Textarea
              id="content"
              className={`${styles.formTextarea} ${data.contentMode === 'html' ? styles.htmlMode : ''}`}
              placeholder={
                data.contentMode === 'html' 
                  ? 'Escribe o pega tu código HTML aquí...'
                  : 'Escribe el contenido de tu email aquí...'
              }
              value={data.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('content', e.target.value)}
              rows={12}
            />
            {data.contentMode === 'html' && (
              <div className={styles.helperText}>
                ℹ️ Modo HTML activo. Puedes usar etiquetas HTML y CSS inline.
              </div>
            )}
            <div className={styles.helperText}>
              💡 Usa variables como {'{{lead.company_name}}'} para personalizar automáticamente cada email.
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <div className={styles.recipientCount}>
            {selectedLeads.length} destinatario{selectedLeads.length !== 1 ? 's' : ''}
          </div>
          <div className={styles.deliveryTime}>
            Envío estimado: Inmediato
          </div>
          <div className={styles.contentMode}>
            Modo: {data.contentMode === 'html' ? 'HTML' : 'Texto'}
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!validation.isValid || isSending}
          className={styles.sendButton}
        >
          {isSending ? (
            <>
              <div className={styles.loadingSpinner} />
              Enviando...
            </>
          ) : (
            <>
              <Send className={styles.sendButtonIcon} size={16} />
              Enviar Campaña
            </>
          )}
        </Button>
      </div>
    </div>
  );
}; 