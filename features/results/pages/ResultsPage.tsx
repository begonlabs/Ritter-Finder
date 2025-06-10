import React from 'react'
import { LayoutPage, PageContainer, SectionCard } from '../../layout'
import styles from '../styles/ResultsPage.module.css'
// import { ResultsTable } from '../components/ResultsTable'
// import { LeadDetailsModal } from '../components/LeadDetailsModal'

export const ResultsPage: React.FC = () => {
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
                Found 1,247 potential leads matching your search criteria
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
                Export
              </button>
            </div>
          </div>

          {/* Results Stats */}
          <div className={styles.resultsStats}>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>1,247</div>
              <div className={styles.resultsStatLabel}>Total Leads</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>856</div>
              <div className={styles.resultsStatLabel}>High Confidence</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>312</div>
              <div className={styles.resultsStatLabel}>Medium Confidence</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatValue}>79</div>
              <div className={styles.resultsStatLabel}>Low Confidence</div>
            </div>
          </div>

          {/* Results Table */}
          <div className={styles.resultsTableContainer}>
            <div className={styles.resultsTableHeader}>
              <div>
                <h2 className={styles.resultsTableTitle}>Lead Database</h2>
                <p className={styles.resultsTableSubtitle}>
                  Manage and export your discovered leads
                </p>
              </div>
              <div className={styles.resultsTableActions}>
                <button className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
                  <svg className={styles.actionButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Select All
                </button>
                <button className={`${styles.actionButton} ${styles.actionButtonPrimary}`}>
                  <svg className={styles.actionButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Add to Campaign
                </button>
              </div>
            </div>

            {/* Sample Table with CSS modules */}
            <table className={styles.resultsTable}>
              <thead className={styles.resultsTableHead}>
                <tr>
                  <th className={styles.resultsTableHeaderCell}>
                    <input type="checkbox" className={styles.selectionCheckbox} />
                  </th>
                  <th className={styles.resultsTableHeaderCell}>Contact</th>
                  <th className={styles.resultsTableHeaderCell}>Company</th>
                  <th className={styles.resultsTableHeaderCell}>Email</th>
                  <th className={styles.resultsTableHeaderCell}>Phone</th>
                  <th className={styles.resultsTableHeaderCell}>Confidence</th>
                  <th className={styles.resultsTableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.resultsTableBody}>
                {/* Sample Data */}
                {[
                  { name: 'John Smith', company: 'TechCorp', email: 'john@techcorp.com', phone: '+1 555-0123', confidence: 'high' },
                  { name: 'Sarah Johnson', company: 'InnovateLabs', email: 'sarah@innovatelabs.com', phone: '+1 555-0124', confidence: 'medium' },
                  { name: 'Mike Chen', company: 'DataSolutions', email: 'mike@datasolutions.com', phone: '+1 555-0125', confidence: 'high' },
                ].map((lead, index) => (
                  <tr key={index} className={styles.resultsTableRow}>
                    <td className={styles.resultsTableCell}>
                      <input type="checkbox" className={styles.selectionCheckbox} />
                    </td>
                    <td className={styles.resultsTableCell}>
                      <div className={styles.leadName}>{lead.name}</div>
                      <div className={styles.leadCompany}>{lead.company}</div>
                    </td>
                    <td className={styles.resultsTableCell}>
                      <div className={styles.leadCompany}>{lead.company}</div>
                    </td>
                    <td className={styles.resultsTableCell}>
                      <div className={styles.leadEmail}>{lead.email}</div>
                    </td>
                    <td className={styles.resultsTableCell}>
                      <div className={styles.leadPhone}>{lead.phone}</div>
                    </td>
                    <td className={styles.resultsTableCell}>
                      <span className={`${styles.confidenceBadge} ${
                        lead.confidence === 'high' ? styles.confidenceHigh : 
                        lead.confidence === 'medium' ? styles.confidenceMedium : 
                        styles.confidenceLow
                      }`}>
                        {lead.confidence}
                      </span>
                    </td>
                    <td className={styles.resultsTableCell}>
                      <button className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Showing 1-10 of 1,247 results
              </div>
              <div className={styles.paginationControls}>
                <button className={styles.paginationButton} disabled>
                  Previous
                </button>
                <button className={`${styles.paginationButton} ${styles.active}`}>
                  1
                </button>
                <button className={styles.paginationButton}>2</button>
                <button className={styles.paginationButton}>3</button>
                <button className={styles.paginationButton}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </PageContainer>
      </LayoutPage>
    </div>
  )
} 