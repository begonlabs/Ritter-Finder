"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Copy, Eye, Mail, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { useCampaignHistory } from "../hooks/useCampaignHistory"
import type { Campaign } from "../types"

interface EmailHistoryProps {
  campaigns: Campaign[]
  onViewCampaign: (campaignId: string) => void
  onDuplicateCampaign: (campaignId: string) => void
}

export function EmailHistory({ campaigns, onViewCampaign, onDuplicateCampaign }: EmailHistoryProps) {
  const history = useCampaignHistory(campaigns, onViewCampaign, onDuplicateCampaign)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Historial de Campañas</CardTitle>
          <CardDescription>
            Revisa el rendimiento de tus campañas de email anteriores
          </CardDescription>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar campañas..."
            className="pl-8"
            value={history.searchTerm}
            onChange={(e) => history.setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead className="text-center">Destinatarios</TableHead>
                <TableHead>Tasa de Apertura</TableHead>
                <TableHead>Tasa de Click</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {history.searchTerm ? 
                      "No se encontraron campañas que coincidan con tu búsqueda" :
                      "No hay campañas de email en el historial"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                history.filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(campaign.sentAt), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{campaign.subject}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      {campaign.recipients.length}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={campaign.openRate || 0} className="h-2" />
                        <span className="text-sm">{campaign.openRate || 0}%</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={campaign.clickRate || 0} className="h-2" />
                        <span className="text-sm">{campaign.clickRate || 0}%</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => history.onViewCampaign(campaign.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => history.onDuplicateCampaign(campaign.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar Campaña
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
