"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/dialog"
import { 
  Upload,
  FileText,
  Users,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  FileSpreadsheet
} from "lucide-react"
import { useLeadImport } from "../hooks/useLeadImport"
import { ConfirmDialog } from "./ConfirmDialog"
import { useConfirmDialog } from "../hooks/useConfirmDialog"
import type { LeadData } from "../types"
import styles from "../styles/LeadImport.module.css"

interface LeadImportProps {
  className?: string
}

export function LeadImport({ className = "" }: LeadImportProps) {
  const {
    // State
    leads,
    isLoading,
    error,
    isImporting,
    isCreating,
    validationErrors,
    previewData,
    notifications,
    
    // Actions
    importFromCSV,
    createLead,
    validateLead,
    clearLeads,
    downloadTemplate,
    importLeadsBulk,
    
    // Form state
    formData,
    setFormData,
    resetForm,
    
    // Notifications
    addNotification,
    removeNotification,
    clearNotifications
  } = useLeadImport()

  const [activeTab, setActiveTab] = useState("manual")
  const [showPreview, setShowPreview] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { confirmDialog, showConfirmDialog, closeConfirmDialog } = useConfirmDialog()

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setSelectedFile(file)
      importFromCSV(file)
    }
  }, [importFromCSV])

  // Handle manual lead creation
  const handleCreateLead = async () => {
    try {
      await createLead(formData)
      resetForm()
      // Show success notification
    } catch (error) {
      console.error('Error creating lead:', error)
    }
  }

  // Handle bulk import
  const handleBulkImport = async () => {
    if (leads.length === 0) return

    showConfirmDialog(
      "Importar Leads",
      `¿Estás seguro de que quieres importar ${leads.length} leads? Esta acción no se puede deshacer.`,
      async () => {
        try {
          const result = await importLeadsBulk(leads)
          console.log('Import result:', result)
        } catch (error) {
          console.error('Error importing leads:', error)
        }
      },
      {
        type: 'warning',
        confirmText: 'Importar',
        cancelText: 'Cancelar'
      }
    )
  }

  // Handle clear leads
  const handleClearLeads = () => {
    showConfirmDialog(
      "Limpiar Leads",
      "¿Estás seguro de que quieres limpiar todos los leads cargados?",
      async () => {
        clearLeads()
        setSelectedFile(null)
      },
      {
        type: 'delete',
        confirmText: 'Limpiar',
        cancelText: 'Cancelar'
      }
    )
  }

  const getValidationStatus = (field: string) => {
    const error = validationErrors.find(e => e.field === field)
    if (error) return 'error'
    if (formData[field as keyof typeof formData]) return 'valid'
    return 'neutral'
  }

  return (
    <div className={`${styles.leadImport} ${className} space-y-6`}>
      {/* Header */}
      <div className={styles.importHeader}>
        <div>
          <h2 className={styles.importTitle}>
            <Users className="h-6 w-6 text-ritter-gold" />
            Importar Leads
          </h2>
          <p className={styles.importDescription}>
            Crea leads manualmente o importa desde un archivo CSV
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Descargar Plantilla
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.importTabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="manual" className={styles.tabsTrigger}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Manual
          </TabsTrigger>
          <TabsTrigger value="csv" className={styles.tabsTrigger}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Importar CSV
          </TabsTrigger>
          <TabsTrigger value="preview" className={styles.tabsTrigger}>
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa ({leads.length})
          </TabsTrigger>
        </TabsList>

        {/* Manual Creation Tab */}
        <TabsContent value="manual" className={styles.tabsContent}>
          <Card className={styles.manualCard}>
            <CardHeader>
              <CardTitle>Crear Lead Manualmente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.formGrid}>
                {/* Company Information */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Información de la Empresa</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <Label htmlFor="company_name" className={styles.formLabel}>
                        Nombre de la Empresa <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Nombre de la empresa"
                        className={`${styles.formInput} ${getValidationStatus('company_name') === 'error' ? styles.inputError : ''}`}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <Label htmlFor="company_website" className={styles.formLabel}>
                        Sitio Web
                      </Label>
                      <Input
                        id="company_website"
                        value={formData.company_website || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_website: e.target.value }))}
                        placeholder="https://ejemplo.com"
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Información de Contacto</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <Label htmlFor="email" className={styles.formLabel}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="contacto@empresa.com"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <Label htmlFor="phone" className={styles.formLabel}>
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+34 600 000 000"
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Ubicación</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <Label htmlFor="address" className={styles.formLabel}>
                        Dirección
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Dirección completa"
                        rows={2}
                        className={styles.formTextarea}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <Label htmlFor="state" className={styles.formLabel}>
                        Provincia
                      </Label>
                      <Input
                        id="state"
                        value={formData.state || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Madrid"
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <Label htmlFor="country" className={styles.formLabel}>
                        País
                      </Label>
                      <Input
                        id="country"
                        value={formData.country || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="España"
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Información Comercial</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <Label htmlFor="activity" className={styles.formLabel}>
                        Actividad <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="activity"
                        value={formData.activity}
                        onChange={(e) => setFormData(prev => ({ ...prev, activity: e.target.value }))}
                        placeholder="Descripción de la actividad"
                        className={`${styles.formInput} ${getValidationStatus('activity') === 'error' ? styles.inputError : ''}`}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <Label htmlFor="category" className={styles.formLabel}>
                        Categoría
                      </Label>
                      <Select 
                        value={formData.category || ''} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className={styles.formSelect}>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Empresas Axesor">Empresas Axesor</SelectItem>
                          <SelectItem value="Empresas CNAE">Empresas CNAE</SelectItem>
                          <SelectItem value="Empresas Personalizadas">Empresas Personalizadas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="description" className={styles.formLabel}>
                      Descripción
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descripción detallada del negocio"
                      rows={3}
                      className={styles.formTextarea}
                    />
                  </div>
                </div>

                {/* Verification Settings */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Configuración de Verificación</h3>
                  <div className={styles.verificationGrid}>
                    <div className={styles.verificationItem}>
                      <Switch
                        id="verified_email"
                        checked={formData.verified_email}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified_email: checked }))}
                      />
                      <Label htmlFor="verified_email">Email Verificado</Label>
                    </div>
                    <div className={styles.verificationItem}>
                      <Switch
                        id="verified_phone"
                        checked={formData.verified_phone}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified_phone: checked }))}
                      />
                      <Label htmlFor="verified_phone">Teléfono Verificado</Label>
                    </div>
                    <div className={styles.verificationItem}>
                      <Switch
                        id="verified_website"
                        checked={formData.verified_website}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified_website: checked }))}
                      />
                      <Label htmlFor="verified_website">Sitio Web Verificado</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className={styles.formActions}>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className={styles.resetButton}
                >
                  Limpiar Formulario
                </Button>
                <Button 
                  onClick={handleCreateLead}
                  disabled={isCreating || !formData.company_name || !formData.activity}
                  className={styles.createButton}
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Lead
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CSV Import Tab */}
        <TabsContent value="csv" className={styles.tabsContent}>
          <Card className={styles.csvCard}>
            <CardHeader>
              <CardTitle>Importar desde CSV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.csvUpload}>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className={styles.fileInput}
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className={styles.uploadLabel}>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className={styles.uploadText}>
                      {selectedFile ? selectedFile.name : "Arrastra un archivo CSV o haz clic para seleccionar"}
                    </span>
                    <span className={styles.uploadHint}>
                      Solo archivos CSV con la estructura correcta
                    </span>
                  </label>
                </div>

                {leads.length > 0 && (
                  <div className={styles.importActions}>
                    <div className={styles.importStats}>
                      <Badge variant="outline" className={styles.importBadge}>
                        {leads.length} leads cargados
                      </Badge>
                      {validationErrors.length > 0 && (
                        <Badge variant="destructive" className={styles.errorBadge}>
                          {validationErrors.length} errores
                        </Badge>
                      )}
                    </div>
                    <div className={styles.actionButtons}>
                      <Button 
                        variant="outline" 
                        onClick={handleClearLeads}
                        className={styles.clearButton}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                      <Button 
                        onClick={handleBulkImport}
                        disabled={isImporting || validationErrors.length > 0}
                        className={styles.importButton}
                      >
                        {isImporting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Importar Leads
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className={styles.tabsContent}>
          <Card className={styles.previewCard}>
            <CardHeader>
              <CardTitle>Vista Previa de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {leads.length === 0 ? (
                <div className={styles.emptyPreview}>
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay leads para mostrar</p>
                  <p className="text-sm">Importa un archivo CSV o crea leads manualmente</p>
                </div>
              ) : (
                <div className={styles.previewTable}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Actividad</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.slice(0, 10).map((lead, index) => (
                        <TableRow key={index} className={styles.previewRow}>
                          <TableCell>
                            <div className={styles.leadCell}>
                              <div className={styles.leadName}>{lead.company_name}</div>
                              {lead.company_website && (
                                <div className={styles.leadWebsite}>{lead.company_website}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={styles.leadContact}>
                              {lead.email ? (
                                <span className={styles.leadEmail}>{lead.email}</span>
                              ) : (
                                <span className={styles.noData}>Sin email</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={styles.leadContact}>
                              {lead.phone ? (
                                <span className={styles.leadPhone}>{lead.phone}</span>
                              ) : (
                                <span className={styles.noData}>Sin teléfono</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={styles.leadActivity}>
                              <span className={styles.activityText}>{lead.activity}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={styles.leadStatus}>
                              {validationErrors.find(e => e.row === index) ? (
                                <Badge variant="destructive" className={styles.errorBadge}>
                                  Error
                                </Badge>
                              ) : (
                                <Badge variant="default" className={styles.validBadge}>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Válido
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {leads.length > 10 && (
                    <div className={styles.previewFooter}>
                      <p className={styles.previewInfo}>
                        Mostrando 10 de {leads.length} leads
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* Notifications */}
      <div className={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${styles.notification} ${styles[`notification${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`]}`}
          >
            <div className={styles.notificationContent}>
              <div className={styles.notificationTitle}>{notification.title}</div>
              <div className={styles.notificationMessage}>{notification.message}</div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={styles.notificationClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 