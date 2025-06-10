import React from 'react'
import { LayoutPage, PageContainer, SectionCard } from '../../layout'
// import { ResultsTable } from '../components/ResultsTable'
// import { LeadDetailsModal } from '../components/LeadDetailsModal'

export const ResultsPage: React.FC = () => {
  return (
    <LayoutPage 
      title="Search Results"
      subtitle="Review and manage your lead search results"
    >
      <PageContainer>
        <SectionCard title="Lead Results">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Results Page
            </h3>
            <p className="text-gray-600">
              This page will display search results once the hooks are properly structured
            </p>
          </div>
        </SectionCard>
      </PageContainer>
    </LayoutPage>
  )
} 