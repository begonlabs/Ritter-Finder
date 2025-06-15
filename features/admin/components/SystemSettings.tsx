"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings,
  Download,
  RefreshCw,
  Database,
  FileText,
  Shield,
  CheckCircle,
  Clock,
  Server,
  HardDrive,
  Activity,
  Eye,
  Search,
  Trash2,
  Archive
} from "lucide-react"
import type { SystemSettingsProps } from "../types"
import styles from "../styles/SystemSettings.module.css"

// Mock data for system info
const systemInfo = {
  version: "2.1.4",
  buildDate: "2024-12-20",
  environment: "production",
  uptime: "15 días, 8 horas",
  lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  database: {
    type: "PostgreSQL",
    version: "15.4",
    size: "2.4 GB",
    connections: 12,
    maxConnections: 100
  },
  storage: {
    total: "500 GB",
    used: "187 GB",
    available: "313 GB",
    percentage: 37
  }
}

// Mock backup data
const mockBackups = [
  {
    id: "backup_001",
    name: "Backup Automático - Diario",
    type: "automatic",
    size: "1.2 GB",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: "completed",
    includes: ["database", "files", "config"]
  },
  {
    id: "backup_002", 
    name: "Backup Manual - Pre-actualización",
    type: "manual",
    size: "1.1 GB",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    status: "completed",
    includes: ["database", "config"]
  }
]

// Mock system logs
const mockLogs = [
  {
    id: "log_001",
    level: "info",
    message: "Usuario admin@ritterfinder.com inició sesión",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    source: "auth",
    userId: "admin_001"
  },
  {
    id: "log_002",
    level: "warning",
    message: "Intento de acceso fallido desde IP 192.168.1.50",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    source: "security",
    ipAddress: "192.168.1.50"
  },
  {
    id: "log_003",
    level: "error",
    message: "Error en conexión a base de datos - timeout",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    source: "database",
    details: "Connection timeout after 30 seconds"
  }
]

export function SystemSettings({ className = "" }: SystemSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [logFilter, setLogFilter] = useState<string>("all")
  const [logSearch, setLogSearch] = useState("")
  const [selectedBackupType, setSelectedBackupType] = useState<string>("full")

  // Filter logs
  const filteredLogs = mockLogs.filter(log => {
    const matchesFilter = logFilter === "all" || log.level === logFilter
    const matchesSearch = log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
                         log.source.toLowerCase().includes(logSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Handle system update
  const handleSystemUpdate = async () => {
    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log("Sistema actualizado exitosamente")
    } catch (error) {
      console.error("Error actualizando sistema:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle backup creation
  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Backup creado exitosamente")
    } catch (error) {
      console.error("Error creando backup:", error)
    } finally {
      setIsCreatingBackup(false)
    }
  }

  // Get log level badge
  const getLogLevelBadge = (level: string) => {
    const styles = {
      info: "bg-blue-100 text-blue-800 border-blue-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      error: "bg-red-100 text-red-800 border-red-200",
      debug: "bg-gray-100 text-gray-800 border-gray-200"
    }
    
    return (
      <Badge variant="outline" className={styles[level as keyof typeof styles] || styles.info}>
        {level.toUpperCase()}
      </Badge>
    )
  }

  // Get backup status badge
  const getBackupStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800 border-green-200",
      running: "bg-blue-100 text-blue-800 border-blue-200",
      failed: "bg-red-100 text-red-800 border-red-200"
    }
    
    const labels = {
      completed: "Completado",
      running: "En progreso",
      failed: "Fallido"
    }
    
    return (
      <Badge variant="outline" className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <div className={`${styles.systemSettings} ${className} space-y-6`}>
      {/* Header */}
      <div className={styles.settingsHeader}>
        <div>
          <h2 className={styles.settingsTitle}>
            <Settings className="h-6 w-6 text-ritter-gold" />
            Configuración del Sistema
          </h2>
          <p className={styles.settingsDescription}>
            Gestiona actualizaciones, backups y monitoreo del sistema
          </p>
        </div>
      </div>

      {/* System Overview */}
      <div className={styles.overviewGrid}>
        <Card className={styles.infoCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Versión:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                v{systemInfo.version}
              </Badge>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Entorno:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {systemInfo.environment}
              </Badge>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tiempo activo:</span>
              <span className={styles.infoValue}>{systemInfo.uptime}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.infoCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tipo:</span>
              <span className={styles.infoValue}>{systemInfo.database.type}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tamaño:</span>
              <span className={styles.infoValue}>{systemInfo.database.size}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.infoCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-orange-600" />
              Almacenamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={styles.storageBar}>
              <div className={styles.storageProgress}>
                <div 
                  className={styles.storageUsed}
                  style={{ width: `${systemInfo.storage.percentage}%` }}
                />
              </div>
              <span className={styles.storageText}>
                {systemInfo.storage.percentage}% usado
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Disponible:</span>
              <span className={styles.infoValue}>{systemInfo.storage.available}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="updates" className={styles.settingsTabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="updates" className={styles.tabsTrigger}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizaciones
          </TabsTrigger>
          <TabsTrigger value="backups" className={styles.tabsTrigger}>
            <Archive className="h-4 w-4 mr-2" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="logs" className={styles.tabsTrigger}>
            <FileText className="h-4 w-4 mr-2" />
            Logs del Sistema
          </TabsTrigger>
        </TabsList>

        {/* Updates Tab */}
        <TabsContent value="updates" className={styles.tabsContent}>
          <Card className={styles.updatesCard}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Actualizaciones del Sistema</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sistema actualizado
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={styles.updateInfo}>
                <div className={styles.currentVersion}>
                  <h4 className={styles.versionTitle}>Versión Actual</h4>
                  <div className={styles.versionDetails}>
                    <span className={styles.versionNumber}>v{systemInfo.version}</span>
                    <span className={styles.versionDate}>
                      Compilado el {systemInfo.buildDate}
                    </span>
                  </div>
                </div>
                
                <div className={styles.updateActions}>
                  <Button
                    onClick={handleSystemUpdate}
                    disabled={isUpdating}
                    className={styles.updateButton}
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Buscar Actualizaciones
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className={styles.checkButton}>
                    <Shield className="h-4 w-4 mr-2" />
                    Verificar Integridad
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className={styles.tabsContent}>
          <Card className={styles.backupsCard}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Gestión de Backups</span>
                <Button
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                  className={styles.createBackupButton}
                >
                  {isCreatingBackup ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4 mr-2" />
                      Crear Backup
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.backupsTable}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBackups.map((backup) => (
                      <TableRow key={backup.id} className={styles.backupRow}>
                        <TableCell>
                          <div className={styles.backupName}>
                            <Archive className="h-4 w-4 text-blue-600 mr-2" />
                            {backup.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            backup.type === 'automatic' 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'bg-purple-50 text-purple-700'
                          }>
                            {backup.type === 'automatic' ? 'Automático' : 'Manual'}
                          </Badge>
                        </TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>{backup.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>{getBackupStatusBadge(backup.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className={styles.backupActions}>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className={styles.tabsContent}>
          <Card className={styles.logsCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Logs del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.logsFilters}>
                <div className={styles.logSearch}>
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar en logs..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                
                <Select value={logFilter} onValueChange={setLogFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los niveles</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.logsTable}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Mensaje</TableHead>
                      <TableHead>Fuente</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className={styles.logRow}>
                        <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                        <TableCell className={styles.logMessage}>
                          {log.message}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            {log.source}
                          </Badge>
                        </TableCell>
                        <TableCell className={styles.logTimestamp}>
                          <Clock className="h-3 w-3 mr-1" />
                          {log.timestamp.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredLogs.length === 0 && (
                <div className={styles.emptyLogs}>
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron logs</p>
                  <p className="text-sm">Prueba ajustando los filtros de búsqueda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 