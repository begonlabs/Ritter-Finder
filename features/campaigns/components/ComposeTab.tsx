"use client"

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Send, Mail, FileText, X, Info, AlertTriangle, Code, Type } from 'lucide-react';
import { useEmailComposer } from '../hooks/useEmailComposer';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import styles from '../styles/ComposeTab.module.css';

interface ComposeTabProps {
  recipientCount?: number;
  leadId?: string;
  onSuccess?: () => void;
}

export const ComposeTab: React.FC<ComposeTabProps> = ({
  recipientCount = 0,
  leadId,
  onSuccess
}) => {
  const {
    data,
    updateField,
    updateTemplateVariable,
    selectTemplate,
    clearTemplate,
    getProcessedContent,
    getProcessedSubject,
    validation,
    sendEmail,
    isSending
  } = useEmailComposer();

  const { getTemplatesByCategory } = useEmailTemplates();

  React.useEffect(() => {
    updateField('recipientCount', recipientCount);
    updateField('leadId', leadId);
  }, [recipientCount, leadId, updateField]);

  const templatesByCategory = getTemplatesByCategory();

  const handleSend = async () => {
    try {
      await sendEmail();
      onSuccess?.();
    } catch (error) {
      console.error('Error sending email:', error);
      // Here you would typically show a toast notification
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return '💼';
      case 'marketing': return '📢';
      case 'follow-up': return '🔄';
      case 'welcome': return '👋';
      case 'custom': return '⚙️';
      default: return '📧';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'sales': return 'Ventas';
      case 'marketing': return 'Marketing';
      case 'follow-up': return 'Seguimiento';
      case 'welcome': return 'Bienvenida';
      case 'custom': return 'Personalizado';
      default: return 'General';
    }
  };

  const getBadgeClass = (category: string) => {
    switch (category) {
      case 'sales': return { background: '#dcfce7', color: '#059669', borderColor: '#bbf7d0' };
      case 'marketing': return { background: '#fef3c7', color: '#d97706', borderColor: '#fde68a' };
      case 'follow-up': return { background: '#dbeafe', color: '#2563eb', borderColor: '#bfdbfe' };
      case 'welcome': return { background: '#f3e8ff', color: '#9333ea', borderColor: '#e9d5ff' };
      case 'custom': return { background: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' };
      default: return { background: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' };
    }
  };

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
            Crea y personaliza tu campaña de email marketing con nuestros templates profesionales
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          
          {/* Template Section */}
          <section className={styles.templateSection}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} />
                Seleccionar Template
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.4' }}>
                Elige un template profesional como base para tu campaña
              </p>
            </div>

            <div className={styles.templateControls}>
              <Select
                value={data.selectedTemplate?.id || ''}
                onValueChange={(value: string) => {
                  if (value) {
                    const allTemplates = Object.values(templatesByCategory).flat();
                    const template = allTemplates.find(t => t.id === value);
                    selectTemplate(template || null);
                  }
                }}
              >
                <SelectTrigger className={styles.templateSelector}>
                  <SelectValue placeholder="Seleccionar template..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templatesByCategory).map(([category, templates]) => (
                    <React.Fragment key={category}>
                      <div className={styles.categoryHeader}>
                        {getCategoryIcon(category)} {getCategoryName(category)}
                      </div>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className={styles.templateOption}>
                            <div className={styles.templateName}>{template.name}</div>
                            <div className={styles.templateDescription}>{template.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>

              {data.selectedTemplate && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearTemplate}
                  className={styles.clearTemplateButton}
                >
                  <X size={14} />
                </Button>
              )}
            </div>

            {data.selectedTemplate && (
              <div className={styles.templateInfo}>
                <span 
                  className={styles.templateBadge}
                  style={getBadgeClass(data.selectedTemplate.category)}
                >
                  {getCategoryName(data.selectedTemplate.category)}
                </span>
                <span className={styles.templateUsage}>
                  Usado {data.selectedTemplate.usageCount} veces
                </span>
              </div>
            )}
          </section>

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

          {/* Form Fields */}
          <div className={styles.formGrid}>
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
              <Label htmlFor="senderName" className={styles.formLabel}>
                Nombre del Remitente
              </Label>
              <Input
                id="senderName"
                type="text"
                className={styles.formInput}
                placeholder="RitterFinder"
                value={data.senderName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('senderName', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="subject" className={styles.formLabel}>
                Asunto del Email <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="subject"
                type="text"
                className={styles.formInput}
                placeholder="Escribe el asunto de tu email"
                value={data.selectedTemplate ? getProcessedSubject() : data.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => !data.selectedTemplate && updateField('subject', e.target.value)}
                readOnly={!!data.selectedTemplate}
              />
              {data.subject.length > 78 && (
                <div className={styles.helperText}>
                  <AlertTriangle size={12} />
                  El asunto es muy largo ({data.subject.length} caracteres)
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="senderEmail" className={styles.formLabel}>
                Email del Remitente <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <Input
                id="senderEmail"
                type="email"
                className={styles.formInput}
                placeholder="no-reply@ritterfinder.com"
                value={data.senderEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('senderEmail', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="content" className={styles.formLabel}>
              Contenido del Email <span style={{ color: '#ef4444' }}>*</span>
            </Label>
            <Textarea
              id="content"
              className={`${styles.formTextarea} ${data.contentMode === 'html' ? styles.htmlMode : ''}`}
              placeholder={
                data.contentMode === 'html' 
                  ? 'Escribe o pega tu código HTML aquí...'
                  : 'Escribe el contenido de tu email aquí...'
              }
              value={data.selectedTemplate ? getProcessedContent() : data.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => !data.selectedTemplate && updateField('content', e.target.value)}
              readOnly={!!data.selectedTemplate}
              rows={12}
            />
            {data.contentMode === 'html' && (
              <div className={styles.helperText}>
                <Info size={12} />
                Modo HTML activo. Puedes usar etiquetas HTML y CSS inline.
              </div>
            )}
          </div>

          {/* Template Variables Section */}
          {data.selectedTemplate?.variables && data.selectedTemplate.variables.length > 0 && (
            <section className={styles.variablesSection}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                  Variables del Template
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  Personaliza tu email completando las siguientes variables
                </p>
              </div>

              <div className={styles.variablesGrid}>
                {data.selectedTemplate.variables.map((variable) => (
                  <div key={variable.key} className={styles.variableGroup}>
                    <Label className={styles.variableLabel}>
                      {variable.label}
                      {variable.required && <span className={styles.required}>*</span>}
                    </Label>
                    <Input
                      type="text"
                      className={styles.variableInput}
                      placeholder={variable.defaultValue || `Ingresa ${variable.label?.toLowerCase()}`}
                      value={data.templateVariables[variable.key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplateVariable(variable.key, e.target.value)}
                    />
                    {variable.description !== variable.key && (
                      <div className={styles.variableDescription}>
                        Variable: {`{{${variable.key}}}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <div className={styles.recipientCount}>
            {recipientCount} destinatario{recipientCount !== 1 ? 's' : ''}
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