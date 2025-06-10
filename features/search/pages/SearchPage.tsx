import React from 'react'
import { SearchForm } from '../components/SearchForm'
import { useSearch } from '../hooks/useSearch'
import { LayoutPage, PageContainer, SectionCard } from '../../layout'

export const SearchPage: React.FC = () => {
  const { 
    state, 
    actions,
    canStartSearch,
    results,
    isSearching 
  } = useSearch()

  return (
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
          <SectionCard title="Search Results">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ Found {results.leads?.length || 0} potential leads
              </p>
              <p className="text-green-600 text-sm mt-1">
                Search completed in {(results.searchTime / 1000).toFixed(1)} seconds
              </p>
            </div>
          </SectionCard>
        )}
      </PageContainer>
    </LayoutPage>
  )
} 