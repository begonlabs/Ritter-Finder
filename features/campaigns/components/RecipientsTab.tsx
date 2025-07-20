"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { usePagination } from "../hooks/usePagination"
import { Pagination } from "./Pagination"
import type { Lead } from "../types"
import styles from "../styles/RecipientsTab.module.css"

interface RecipientsTabProps {
  selectedLeads: Lead[]
}

export function RecipientsTab({ selectedLeads }: RecipientsTabProps) {
  const ITEMS_PER_PAGE = 25
  
  const {
    currentItems: paginatedLeads,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    pageInfo
  } = usePagination({
    items: selectedLeads,
    itemsPerPage: ITEMS_PER_PAGE
  })

  return (
    <Card className={styles.recipientsTab}>
      <CardHeader className={styles.header}>
        <CardTitle className={`${styles.title} flex items-center gap-2`}>
          <Users className={`${styles.titleIcon} h-5 w-5`} />
          Destinatarios ({selectedLeads.length})
        </CardTitle>
        <CardDescription className={styles.description}>
          Revisa la lista de contactos que recibirán tu campaña
        </CardDescription>
      </CardHeader>
      
      <CardContent className={styles.content}>
        <div className={`${styles.recipientsList} space-y-3`}>
          {paginatedLeads.map((lead, index) => {
            // Calculate the actual index for numbering (considering pagination)
            const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index
            
            return (
              <div 
                key={lead.id} 
                className={`${styles.recipientItem} flex items-center justify-between p-3 bg-gray-50 rounded-lg`}
              >
                <div className={`${styles.recipientLeft} flex items-center gap-3`}>
                  <div className={`${styles.recipientNumber} bg-ritter-gold text-ritter-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`}>
                    {actualIndex + 1}
                  </div>
                  <div className={styles.recipientInfo}>
                    <p className={`${styles.recipientName} font-medium`}>{lead.name || lead.company_name}</p>
                    <p className={`${styles.recipientPosition} text-sm text-muted-foreground`}>
                      {lead.position || lead.activity} en {lead.company || lead.company_name}
                    </p>
                    <p className={`${styles.recipientEmail} text-sm text-blue-600`}>{lead.email}</p>
                    {lead.location && (
                      <p className={`${styles.recipientLocation} text-xs text-gray-500`}>
                        📍 {lead.location}
                      </p>
                    )}
                    {lead.data_quality_score !== undefined && (
                      <p className={`${styles.recipientConfidence} text-xs`}>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.data_quality_score >= 4 ? 'bg-green-100 text-green-800' :
                          lead.data_quality_score >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {lead.data_quality_score}/5 calidad
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className={`${styles.recipientRight} flex flex-col items-end gap-1`}>
                  <Badge variant="outline" className={styles.recipientBadge}>{lead.industry || lead.category}</Badge>
                  {lead.category && (
                    <Badge variant="secondary" className={`${styles.sourceBadge} text-xs`}>
                      {lead.category}
                    </Badge>
                  )}
                  <div className={`${styles.validationIcons} flex gap-1 mt-1`}>
                    {lead.emailValidated && (
                      <span className="text-green-600 text-xs" title="Email validado">📧✓</span>
                    )}
                    {lead.websiteExists && (
                      <span className="text-blue-600 text-xs" title="Web validada">🌐✓</span>
                    )}
                    {lead.phoneValidated && (
                      <span className="text-purple-600 text-xs" title="Teléfono validado">📞✓</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {selectedLeads.length === 0 && (
            <div className={`${styles.emptyState} text-center py-8`}>
              <Users className={`${styles.emptyStateIcon} mx-auto h-12 w-12 text-gray-400 mb-4`} />
              <p className={`${styles.emptyStateText} text-muted-foreground`}>
                No hay leads seleccionados para esta campaña.
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {selectedLeads.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            pageInfo={pageInfo}
            className={styles.pagination}
          />
        )}
        
        {selectedLeads.length > 0 && (
          <div className={styles.recipientsSummary}>
            <div className={styles.summaryText}>
              <span className={styles.summaryCount}>{selectedLeads.length}</span> destinatarios seleccionados
            </div>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <div className={styles.statDot}></div>
                <span>{Array.from(new Set(selectedLeads.map(lead => lead.company || lead.company_name))).length} empresas</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statDot}></div>
                <span>{Array.from(new Set(selectedLeads.map(lead => lead.industry || lead.category))).length} sectores</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 