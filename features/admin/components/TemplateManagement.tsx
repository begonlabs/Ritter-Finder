"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  Mail, 
  Search, 
  Plus, 
  Edit2,
  Trash2,
  Copy,
  Eye,
  Code,
  FileText,
  Save,
  X
} from "lucide-react"
import { useEmailTemplates } from "@/features/campaigns/hooks/useEmailTemplates"
import type { EmailTemplate, TemplateVariable } from "@/features/campaigns/types"
import type { TemplateManagementProps } from "../types"
import { useConfirmDialog } from "../hooks/useConfirmDialog"
import { ConfirmDialog } from "./ConfirmDialog"
import styles from "../styles/TemplateManagement.module.css"

export function TemplateManagement({ className = "" }: TemplateManagementProps) {
  const {
    filteredTemplates,
    isLoading,
    filters,
    updateFilters,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate
  } = useEmailTemplates()

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit')
  const { confirmDialog, showConfirmDialog, closeConfirmDialog } = useConfirmDialog()

  // Template form state
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({
    name: '',
    description: '',
    subject: '',
    htmlContent: '',
    plainTextContent: '',
    category: 'custom',
    isActive: true,
    variables: []
  })

  const handleCreateTemplate = async () => {
    if (!formData.name || !formData.subject || !formData.htmlContent) return

    try {
      await createTemplate({
        name: formData.name,
        description: formData.description || '',
        subject: formData.subject,
        htmlContent: formData.htmlContent,
        plainTextContent: formData.plainTextContent,
        category: formData.category as any,
        isActive: formData.isActive || true,
        variables: formData.variables || [],
        createdBy: 'admin' // TODO: Get from auth context
      })
      
      setIsCreating(false)
      setFormData({
        name: '',
        description: '',
        subject: '',
        htmlContent: '',
        plainTextContent: '',
        category: 'custom',
        isActive: true,
        variables: []
      })
    } catch (error) {
      console.error('Error creating template:', error)
    }
  }

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return

    try {
      await updateTemplate(selectedTemplate.id, formData)
      setIsEditing(false)
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Error updating template:', error)
    }
  }

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    showConfirmDialog(
      "Eliminar Plantilla",
      `¿Estás seguro de que quieres eliminar la plantilla "${templateName}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await deleteTemplate(templateId)
        } catch (error) {
          console.error('Error deleting template:', error)
        }
      },
      {
        type: 'delete',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    )
  }

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      await duplicateTemplate(templateId)
    } catch (error) {
      console.error('Error duplicating template:', error)
    }
  }

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setFormData(template)
    setIsEditing(true)
    setPreviewMode('edit')
  }

  const getCategoryBadge = (category: string) => {
    const categoryMap = {
      sales: { label: '💼 Ventas', color: 'blue' },
      marketing: { label: '📢 Marketing', color: 'purple' },
      'follow-up': { label: '🔄 Seguimiento', color: 'green' },
      welcome: { label: '👋 Bienvenida', color: 'yellow' },
      custom: { label: '⚙️ Personalizada', color: 'gray' }
    }
    
    const config = categoryMap[category as keyof typeof categoryMap] || categoryMap.custom
    
    return (
      <Badge variant="outline" className={`${styles.categoryBadge} ${styles[config.color]}`}>
        {config.label}
      </Badge>
    )
  }

  const renderTemplatePreview = (content: string) => {
    return (
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                * { box-sizing: border-box; }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `}
        className={styles.previewIframe}
        title="Vista previa de plantilla"
        sandbox="allow-same-origin"
      />
    )
  }

  return (
    <div className={`${styles.templateManagement} ${className} space-y-6`}>
      {/* Header */}
      <div className={`${styles.templateHeader} flex items-center justify-between`}>
        <div>
          <h2 className={`${styles.templateTitle} text-2xl font-bold text-gray-900 flex items-center gap-2`}>
            <Mail className="h-6 w-6 text-ritter-gold" />
            Gestión de Plantillas
          </h2>
          <p className={`${styles.templateDescription} text-gray-600`}>
            Administra plantillas HTML para campañas de email
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className={`${styles.addTemplateButton} flex items-center gap-2`}
        >
          <Plus className="h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Filters */}
      <Card className={`${styles.filtersCard} border-0 shadow-sm`}>
        <CardContent className="pt-6">
          <div className={`${styles.filtersGrid} grid gap-4 md:grid-cols-4`}>
            <div className={`${styles.searchContainer} md:col-span-2`}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} />
                <Input
                  placeholder="Buscar plantillas..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                />
              </div>
            </div>
            
            <Select 
              value={filters.category} 
              onValueChange={(value) => updateFilters({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="sales">💼 Ventas</SelectItem>
                <SelectItem value="marketing">📢 Marketing</SelectItem>
                <SelectItem value="follow-up">🔄 Seguimiento</SelectItem>
                <SelectItem value="welcome">👋 Bienvenida</SelectItem>
                <SelectItem value="custom">⚙️ Personalizada</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.isActive === null ? "all" : filters.isActive.toString()} 
              onValueChange={(value) => updateFilters({ 
                isActive: value === "all" ? null : value === "true" 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="true">Activas</SelectItem>
                <SelectItem value="false">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card className={`${styles.templatesTableCard} border-0 shadow-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Plantillas ({filteredTemplates.length})</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {filteredTemplates.filter(t => t.isActive).length} activas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${styles.tableContainer} border rounded-lg`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plantilla</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Actualizada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id} className={styles.templateRow}>
                    <TableCell>
                      <div className={styles.templateCell}>
                        <div>
                          <div className={styles.templateName}>{template.name}</div>
                          <div className={styles.templateSubject}>
                            {template.subject}
                          </div>
                          <div className={styles.templateDesc}>
                            {template.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(template.category)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={template.isActive ? "default" : "secondary"}
                        className={template.isActive ? styles.activeBadge : styles.inactiveBadge}
                      >
                        {template.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={styles.usageCount}>
                        {template.usageCount} veces
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={styles.lastUpdated}>
                        {template.updatedAt.toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={styles.templateActions}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditDialog(template)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteTemplate(template.id, template.name)}
                          className="h-8 w-8 p-0 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTemplates.length === 0 && (
            <div className={`${styles.emptyState} text-center py-12 text-muted-foreground`}>
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron plantillas</p>
              <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Template Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className={`${styles.templateDialog} max-w-4xl`}>
          <DialogHeader className={styles.dialogHeader}>
            <DialogTitle className={styles.dialogTitle}>Crear Nueva Plantilla</DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              Crea una nueva plantilla HTML para campañas de email
            </DialogDescription>
          </DialogHeader>
          
          <div className={styles.dialogContent}>
            <Tabs defaultValue="general" className={styles.createTabs}>
              <TabsList className={styles.createTabsList}>
                <TabsTrigger value="general" className={styles.tabsTrigger}>
                  <FileText className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="content" className={styles.tabsTrigger}>
                  <Code className="h-4 w-4 mr-2" />
                  Contenido
                </TabsTrigger>
                <TabsTrigger value="preview" className={styles.tabsTrigger}>
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className={styles.tabsContent}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <Label htmlFor="template-name" className={styles.formLabel}>Nombre de la plantilla</Label>
                    <Input
                      id="template-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nombre descriptivo..."
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="template-category" className={styles.formLabel}>Categoría</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger className={styles.formSelect}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">💼 Ventas</SelectItem>
                        <SelectItem value="marketing">📢 Marketing</SelectItem>
                        <SelectItem value="follow-up">🔄 Seguimiento</SelectItem>
                        <SelectItem value="welcome">👋 Bienvenida</SelectItem>
                        <SelectItem value="custom">⚙️ Personalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <Label htmlFor="template-description" className={styles.formLabel}>Descripción</Label>
                  <Textarea
                    id="template-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe el propósito de esta plantilla..."
                    rows={3}
                    className={styles.formTextarea}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Label htmlFor="template-subject" className={styles.formLabel}>Asunto del email</Label>
                  <Input
                    id="template-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Asunto del email con variables {{contact_name}}..."
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.switchGroup}>
                  <Switch
                    id="template-active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    className={styles.formSwitch}
                  />
                  <Label htmlFor="template-active" className={styles.switchLabel}>Plantilla activa</Label>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className={styles.tabsContent}>
                <div className={styles.formGroup}>
                  <Label htmlFor="template-html" className={styles.formLabel}>Contenido HTML</Label>
                  <Textarea
                    id="template-html"
                    value={formData.htmlContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
                    placeholder="Código HTML de la plantilla..."
                    rows={20}
                    className={styles.codeTextarea}
                  />
                  <p className={styles.helperText}>
                    Usa variables como {`{{contact_name}}`}, {`{{company_name}}`}, {`{{sender_name}}`}, etc.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className={styles.tabsContent}>
                <div className={styles.previewContainer}>
                  {formData.htmlContent ? (
                    renderTemplatePreview(formData.htmlContent)
                  ) : (
                    <div className={styles.emptyPreview}>
                      <FileText className={styles.emptyPreviewIcon} />
                      <p className={styles.emptyPreviewText}>Agrega contenido HTML para ver la vista previa</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className={styles.dialogFooter}>
            <Button 
              variant="outline" 
              onClick={() => setIsCreating(false)}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateTemplate} 
              disabled={!formData.name || !formData.subject}
              className={styles.saveButton}
            >
              <Save className="h-4 w-4 mr-2" />
              Crear Plantilla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className={`${styles.templateDialog} max-w-4xl`}>
          <DialogHeader className={styles.dialogHeader}>
            <DialogTitle className={styles.dialogTitle}>Editar Plantilla</DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              Modifica la plantilla "{selectedTemplate?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className={styles.dialogContent}>
            <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as any)} className={styles.editTabs}>
              <TabsList className={styles.tabsList}>
                <TabsTrigger value="edit" className={styles.tabsTrigger}>
                  <Code className="h-4 w-4 mr-2" />
                  Editar
                </TabsTrigger>
                <TabsTrigger value="preview" className={styles.tabsTrigger}>
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className={styles.tabsContent}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <Label className={styles.formLabel}>Nombre</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={styles.formInput}
                      placeholder="Nombre de la plantilla"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label className={styles.formLabel}>Categoría</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger className={styles.formSelect}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">💼 Ventas</SelectItem>
                        <SelectItem value="marketing">📢 Marketing</SelectItem>
                        <SelectItem value="follow-up">🔄 Seguimiento</SelectItem>
                        <SelectItem value="welcome">👋 Bienvenida</SelectItem>
                        <SelectItem value="custom">⚙️ Personalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <Label className={styles.formLabel}>Asunto</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className={styles.formInput}
                    placeholder="Asunto del email"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Label className={styles.formLabel}>Contenido HTML</Label>
                  <Textarea
                    value={formData.htmlContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
                    rows={15}
                    className={styles.codeTextarea}
                    placeholder="Código HTML de la plantilla..."
                  />
                                     <p className={styles.helperText}>
                     Usa variables como {`{{contact_name}}`}, {`{{company_name}}`}, {`{{sender_name}}`}, etc.
                   </p>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className={styles.tabsContent}>
                <div className={styles.previewContainer}>
                  {formData.htmlContent ? (
                    renderTemplatePreview(formData.htmlContent)
                  ) : (
                    <div className={styles.emptyPreview}>
                      <FileText className={styles.emptyPreviewIcon} />
                      <p className={styles.emptyPreviewText}>No hay contenido para mostrar</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className={styles.dialogFooter}>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateTemplate}
              className={styles.saveButton}
              disabled={!formData.name || !formData.subject}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
        />
      )}
    </div>
  )
} 