"use client"

import React from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Send, Mail, Code, Type } from 'lucide-react';
import type { Lead } from '../types';
import type { UseEmailComposerReturn } from '../hooks/useEmailComposer';
import styles from '../styles/ComposeTab.module.css';

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
              value={data.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('content', e.target.value)}
              rows={12}
            />
            {data.contentMode === 'html' && (
              <div className={styles.helperText}>
                ℹ️ Modo HTML activo. Puedes usar etiquetas HTML y CSS inline.
              </div>
            )}
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