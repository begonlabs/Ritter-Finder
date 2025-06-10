"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, RefreshCw, Eye, Calendar, Trash2, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { useSearchHistory } from "../hooks/useSearchHistory"
import type { SearchHistoryProps } from "../types"

export function SearchHistory({
  onRerunSearch,
  onViewLeads,
  onDeleteSearch,
  showActions = true,
  compact = false
}: Omit<SearchHistoryProps, 'history'>) {
  const history = useSearchHistory()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case 'cancelled':
        return <Clock className="h-3 w-3 text-gray-500" />
      default:
        return <Clock className="h-3 w-3 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  if (history.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-muted-foreground">Cargando historial...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className={compact ? "pb-4" : "flex flex-row items-center justify-between"}>
        <div>
          <CardTitle className={compact ? "text-lg" : "text-xl"}>
            Historial de Búsquedas
          </CardTitle>
          <CardDescription>
            Ver y repetir búsquedas anteriores ({history.stats.totalSearches} búsquedas)
          </CardDescription>
        </div>
        
        {!compact && (
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filtrar historial..."
                className="pl-8"
                value={history.searchTerm}
                onChange={(e) => history.setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={history.statusFilter} onValueChange={history.setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="failed">Fallidas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {!history.hasHistory ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay historial de búsquedas
            </h3>
            <p className="text-gray-500">
              Comienza realizando tu primera búsqueda de leads
            </p>
          </div>
        ) : !history.hasFilteredResults ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron búsquedas
            </h3>
            <p className="text-gray-500">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Sitios Web</TableHead>
                  <TableHead>Tipo de Cliente</TableHead>
                  <TableHead className="text-center">Leads Encontrados</TableHead>
                  <TableHead className="text-center">Contactados</TableHead>
                  <TableHead>Estado</TableHead>
                  {showActions && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.history.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(item.date), "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(item.date), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-48">
                        {item.websites.map((website, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-xs">
                            {website.replace("www.", "").replace(".com", "").replace(".net", "").replace(".org", "")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {item.clientType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">{item.leadsFound}</div>
                      {item.searchTime && (
                        <div className="text-xs text-muted-foreground">
                          {item.searchTime}s
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {item.leadsContacted}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={`border ${getStatusColor(item.status)}`}>
                          {item.status === 'completed' ? 'Completada' :
                           item.status === 'failed' ? 'Fallida' :
                           item.status === 'cancelled' ? 'Cancelada' : item.status}
                        </Badge>
                      </div>
                    </TableCell>
                    {showActions && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onRerunSearch(item)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Repetir Búsqueda
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewLeads(item.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Leads
                            </DropdownMenuItem>
                            {onDeleteSearch && (
                              <DropdownMenuItem 
                                onClick={() => onDeleteSearch(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Quick Stats */}
        {history.hasHistory && !compact && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{history.stats.totalSearches}</div>
              <div className="text-xs text-blue-600">Búsquedas Totales</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">{history.stats.totalLeadsFound}</div>
              <div className="text-xs text-green-600">Leads Encontrados</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-700">{history.stats.averageSearchTime}s</div>
              <div className="text-xs text-purple-600">Tiempo Promedio</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-semibold text-orange-700">{history.stats.successRate}%</div>
              <div className="text-xs text-orange-600">Tasa de Éxito</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
