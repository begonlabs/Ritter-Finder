import React, { useState } from 'react'
import { LayoutPage, PageContainer } from '../../layout'
import styles from '../styles/ResultsPage.module.css'
import { ResultsTableAdapter as ResultsTable } from '../components/ResultsTableAdapter'
import type { Lead } from '../types'

// Sample data for demonstration
const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp',
    position: 'CTO',
    email: 'john@techcorp.com',
    phone: '+1 555-0123',
    website: 'techcorp.com',
    industry: 'Technology',
    location: 'San Francisco, CA',
    confidence: 95,
    employees: '100-500',
    revenue: '€5M-10M',
    notes: 'High potential lead interested in energy efficiency solutions',
    lastActivity: '2024-01-15',
    source: 'LinkedIn'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'InnovateLabs',
    position: 'VP Engineering',
    email: 'sarah@innovatelabs.com',
    phone: '+1 555-0124',
    website: 'innovatelabs.com',
    industry: 'Research',
    location: 'Boston, MA',
    confidence: 87,
    employees: '50-100',
    revenue: '€2M-5M',
    notes: 'Interested in sustainable technology solutions',
    lastActivity: '2024-01-14',
    source: 'Website'
  },
  {
    id: '3',
    name: 'Mike Chen',
    company: 'DataSolutions',
    position: 'CEO',
    email: 'mike@datasolutions.com',
    phone: '+1 555-0125',
    website: 'datasolutions.com',
    industry: 'Data Analytics',
    location: 'Austin, TX',
    confidence: 92,
    employees: '200-500',
    revenue: '€10M+',
    notes: 'Looking for energy optimization tools for data centers',
    lastActivity: '2024-01-16',
    source: 'Email Campaign'
  }
]

export const ResultsPage: React.FC = () => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const handleSelectAll = (select: boolean) => {
    setSelectedLeads(select ? sampleLeads.map(lead => lead.id) : [])
  }

  const handleProceedToCampaign = () => {
    console.log('Proceeding to campaign with selected leads:', selectedLeads)
    // Here you would navigate to campaign creation or trigger campaign logic
  }

  return (
    <div className={styles.resultsPage}>
      <LayoutPage 
        title="Search Results"
        subtitle="Review and manage your lead search results"
      >
        <PageContainer>
          {/* Results Header */}
          <div className={styles.resultsHeader}>
            <div className={styles.resultsHeaderContent}>
              <h1 className={styles.resultsTitle}>Lead Results</h1>
              <p className={styles.resultsSubtitle}>
                Found {sampleLeads.length} potential leads matching your search criteria
              </p>
            </div>
            <div className={styles.resultsActions}>
              <button className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
                <svg className={styles.actionButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L11 19.414a1 1 0 01-.707.293A1 1 0 0110 19V13.414a1 1 0 00-.293-.707L3.293 6.293A1 1 0 013 5.586V4z" />
                </svg>
                Filter
              </button>
              <button className={`${styles.actionButton} ${styles.actionButtonPrimary}`}>
                <svg className={styles.actionButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export All
              </button>
            </div>
          </div>

          {/* Results Stats */}
          <div className={styles.resultsStats}>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>{sampleLeads.length}</div>
              <div className={styles.resultsStatLabel}>Total Leads</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>
                {sampleLeads.filter(lead => lead.confidence >= 90).length}
              </div>
              <div className={styles.resultsStatLabel}>High Confidence</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>
                {sampleLeads.filter(lead => lead.confidence >= 80 && lead.confidence < 90).length}
              </div>
              <div className={styles.resultsStatLabel}>Medium Confidence</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>
                {sampleLeads.filter(lead => lead.confidence < 80).length}
              </div>
              <div className={styles.resultsStatLabel}>Low Confidence</div>
            </div>
          </div>

          {/* Results Table - Using the modular component */}
          <ResultsTable
            leads={sampleLeads}
            selectedLeads={selectedLeads}
            onSelectLead={handleSelectLead}
            onSelectAll={handleSelectAll}
            onProceedToCampaign={handleProceedToCampaign}
            showActions={true}
          />
        </PageContainer>
      </LayoutPage>
    </div>
  )
} 