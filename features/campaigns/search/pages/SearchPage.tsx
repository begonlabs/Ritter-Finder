import React from 'react'
import { CheckCircle } from 'lucide-react'
import { SearchForm } from '../components/SearchForm'
import { useSearch } from '../hooks/useSearch'
import { LayoutPage, PageContainer, SectionCard } from '../../layout'
import styles from '../styles/SearchPage.module.css'

export const SearchPage: React.FC = () => {
  const { 
    state, 
    actions,
    canStartSearch,
    results,
    isSearching 
  } = useSearch()

  return (
    <div className={styles.searchPage}>
      <LayoutPage 
        title="Lead Search"
        subtitle="Configure your search parameters and find potential leads"
      >
        <PageContainer>
          <SectionCard title="Search Configuration">
            <SearchForm 
              state={state}
              actions={actions}
              canStartSearch={canStartSearch}
            />
          </SectionCard>

          {results && (
            <div className={styles.resultsSection}>
              <SectionCard title="Search Results">
                <div className={styles.successState}>
                  <p className={styles.successMessage}>
                    <CheckCircle className={styles.successIcon} />
                    ✓ Found {results.leads?.length || 0} potential leads
                  </p>
                  <p className={styles.successDetails}>
                    Search completed in {(results.searchTime / 1000).toFixed(1)} seconds
                  </p>
                </div>
              </SectionCard>
            </div>
          )}
        </PageContainer>
      </LayoutPage>
    </div>
  )
} 