import React, { useState, useEffect } from 'react'
import { LayoutPage, PageContainer } from '../../layout'
import { ResultsTableAdapter as ResultsTable } from '../components/ResultsTableAdapter'
import { useResults } from '../hooks/useResults'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Search, RefreshCw, Filter } from 'lucide-react'
import styles from '../styles/ResultsPage.module.css'
import type { LeadsSearchParams } from '../types'

interface LeadsResultsPageProps {
  initialSearchParams?: LeadsSearchParams
}

export const LeadsResultsPage: React.FC<LeadsResultsPageProps> = ({ 
  initialSearchParams 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const {
    state,
    actions,
    filteredStats,
    summary,
    searchLeads,
    searchWithFilters,
    loadMore,
    refreshLeads,
    error,
    total,
    hasMore,
    currentPage,
  } = useResults({
    initialSearchParams,
    autoFetch: true
  })

  // Extract isLoading from state
  const isLoading = state.isLoading

  // Handle search form submission
  const handleSearch = async () => {
    const searchParams: LeadsSearchParams = {}
    
    if (searchTerm.trim()) {
      searchParams.search_term = searchTerm.trim()
    }
    
    if (selectedIndustry) {
      searchParams.industry = selectedIndustry
    }
    
    if (selectedLocation) {
      const city = selectedLocation.split(',')[0].trim()
      searchParams.city = city
    }
    
    await searchLeads(searchParams)
  }

  const handleSelectLead = (leadId: string) => {
    actions.selection.handleSelectLead(leadId)
  }

  const handleSelectAll = (select: boolean) => {
    actions.selection.handleSelectAll(select)
  }

  const handleProceedToCampaign = () => {
    console.log('Proceeding to campaign with selected leads:', state.selection.selectedLeads)
    // Navigate to campaign creation
  }

  const handleLoadMore = async () => {
    await loadMore()
  }

  return (
    <div className={styles.resultsPage}>
      <LayoutPage 
        title="Lead Results"
        subtitle="Search and manage leads from web scraping data"
      >
        <PageContainer>
          {/* Search Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search by name, company, or activity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Industry filter..."
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Location filter..."
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={refreshLeads}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error loading leads:</span>
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Header with Stats */}
          <div className={styles.resultsHeader}>
            <div className={styles.resultsHeaderContent}>
              <h1 className={styles.resultsTitle}>Lead Results</h1>
              <p className={styles.resultsSubtitle}>
                Found {total} leads from web scraping data
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="text-sm">
                Showing {state.filteredLeads.length} results
              </Badge>
              {state.selection.selectedLeads.length > 0 && (
                <Badge className="bg-amber-100 text-amber-800">
                  {state.selection.selectedLeads.length} selected
                </Badge>
              )}
            </div>
          </div>

          {/* Results Stats */}
          <div className={styles.resultsStats}>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>{filteredStats.totalLeads}</div>
              <div className={styles.resultsStatLabel}>Total Leads</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>
                {summary.byConfidence.high}
              </div>
              <div className={styles.resultsStatLabel}>High Confidence</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>
                {summary.byConfidence.medium}
              </div>
              <div className={styles.resultsStatLabel}>Medium Confidence</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>
                {filteredStats.averageConfidence}%
              </div>
              <div className={styles.resultsStatLabel}>Avg Confidence</div>
            </div>
          </div>

          {/* Results Table */}
          <ResultsTable
            leads={state.filteredLeads}
            selectedLeads={state.selection.selectedLeads}
            onSelectLead={handleSelectLead}
            onSelectAll={handleSelectAll}
            onProceedToCampaign={handleProceedToCampaign}
            showActions={true}
          />

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="min-w-40"
              >
                {isLoading ? 'Loading...' : 'Load More Results'}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && state.filteredLeads.length === 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <Search className="w-16 h-16" />
                  </div>
                  <h3 className={styles.emptyStateTitle}>No leads found</h3>
                  <p className={styles.emptyStateDescription}>
                    Try adjusting your search criteria or refresh the data.
                  </p>
                  <Button 
                    onClick={handleSearch}
                    className={styles.emptyStateAction}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </LayoutPage>
    </div>
  )
} 