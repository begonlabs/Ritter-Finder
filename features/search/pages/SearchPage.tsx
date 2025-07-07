import React from 'react'
import { CheckCircle, MapPin, Activity, BarChart3, Star } from 'lucide-react'
import { SearchForm } from '../components/SearchForm'
import { useSearch } from '../hooks/useSearch'
import { LayoutPage, PageContainer, SectionCard } from '../../layout'
import styles from '../styles/SearchPage.module.css'

export const SearchPage: React.FC = () => {
  const { 
    state, 
    actions,
    canStartSearch,
    results, // Legacy format for compatibility
    searchResults, // New enhanced format
    isSearching,
    searchComplete,
    currentSearchId
  } = useSearch()

  // Use enhanced results if available, fall back to legacy
  const enhancedResults = searchResults || results

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
              searchComplete={searchComplete}
              currentSearchId={currentSearchId}
            />
          </SectionCard>

          {enhancedResults && (
            <div className={styles.resultsSection}>
              <SectionCard title="Search Results">
                <div className={styles.successState}>
                  <p className={styles.successMessage}>
                    <CheckCircle className={styles.successIcon} />
                    ✓ Found {enhancedResults.leads?.length || 0} potential leads
                  </p>
                  <p className={styles.successDetails}>
                    Search completed in {(enhancedResults.searchTime / 1000).toFixed(1)} seconds
                  </p>
                </div>

                {/* Enhanced Search Metrics - only show if available */}
                {searchResults && (
                  <div className={styles.enhancedMetrics}>
                    {/* Quality Distribution */}
                    {searchResults.qualityDistribution && (
                      <div className={styles.metricCard}>
                        <h4 className={styles.metricTitle}>
                          <Star className={styles.metricIcon} />
                          Quality Distribution
                        </h4>
                        <div className={styles.qualityGrid}>
                          {Object.entries(searchResults.qualityDistribution).map(([key, value]) => {
                            const score = key.replace('score', '')
                            const stars = '★'.repeat(parseInt(score))
                            return (
                              <div key={key} className={styles.qualityItem}>
                                <span className={styles.qualityStars}>{stars}</span>
                                <span className={styles.qualityCount}>{value} leads</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Location Breakdown */}
                    {searchResults.locationBreakdown && Object.keys(searchResults.locationBreakdown).length > 0 && (
                      <div className={styles.metricCard}>
                        <h4 className={styles.metricTitle}>
                          <MapPin className={styles.metricIcon} />
                          Location Breakdown
                        </h4>
                        <div className={styles.breakdownList}>
                          {Object.entries(searchResults.locationBreakdown)
                            .sort(([, a], [, b]) => b - a) // Sort by count descending
                            .slice(0, 5) // Show top 5
                            .map(([location, count]) => (
                              <div key={location} className={styles.breakdownItem}>
                                <span className={styles.breakdownLabel}>{location}</span>
                                <span className={styles.breakdownCount}>{count} leads</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Activity Breakdown */}
                    {searchResults.activityBreakdown && Object.keys(searchResults.activityBreakdown).length > 0 && (
                      <div className={styles.metricCard}>
                        <h4 className={styles.metricTitle}>
                          <Activity className={styles.metricIcon} />
                          Business Activities
                        </h4>
                        <div className={styles.breakdownList}>
                          {Object.entries(searchResults.activityBreakdown)
                            .sort(([, a], [, b]) => b - a) // Sort by count descending
                            .slice(0, 5) // Show top 5
                            .map(([activity, count]) => (
                              <div key={activity} className={styles.breakdownItem}>
                                <span className={styles.breakdownLabel}>{activity}</span>
                                <span className={styles.breakdownCount}>{count} leads</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Search Quality Summary */}
                    <div className={styles.metricCard}>
                      <h4 className={styles.metricTitle}>
                        <BarChart3 className={styles.metricIcon} />
                        Search Summary
                      </h4>
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryLabel}>Total Leads</span>
                          <span className={styles.summaryValue}>{enhancedResults.totalFound}</span>
                        </div>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryLabel}>Search Time</span>
                          <span className={styles.summaryValue}>{(enhancedResults.searchTime / 1000).toFixed(1)}s</span>
                        </div>
                        {searchResults?.qualityDistribution && (
                          <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>High Quality (4-5★)</span>
                            <span className={styles.summaryValue}>
                              {(searchResults.qualityDistribution.score4 + searchResults.qualityDistribution.score5)} leads
                            </span>
                          </div>
                        )}
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryLabel}>Search ID</span>
                          <span className={styles.summaryValue}>{enhancedResults.searchId.slice(-8)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SectionCard>
            </div>
          )}
        </PageContainer>
      </LayoutPage>
    </div>
  )
} 