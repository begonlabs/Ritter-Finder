import React from 'react'
import styles from '../styles/LayoutPage.module.css'

interface LayoutPageProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  headerActions?: React.ReactNode
  className?: string
}

export const LayoutPage: React.FC<LayoutPageProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  className = ""
}) => {
  return (
    <div className={`${styles.layoutPage} ${className}`}>
      <div className={styles.layoutContainer}>
        {(title || subtitle || headerActions) && (
          <div className={styles.layoutHeader}>
            <div className={styles.layoutHeaderContent}>
              <div>
                {title && (
                  <h1 className={styles.layoutTitle}>
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className={styles.layoutSubtitle}>
                    {subtitle}
                  </p>
                )}
              </div>
              {headerActions && (
                <div className={styles.layoutHeaderActions}>
                  {headerActions}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className={styles.layoutContent}>
          <div className={styles.layoutContentCard}>
            <div className={styles.layoutContentInner}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Layout wrapper for consistent spacing and structure
export const PageContainer: React.FC<{ 
  children: React.ReactNode 
  className?: string
  gridCols?: 1 | 2 | 3
}> = ({ children, className = "", gridCols = 1 }) => {
  const gridClass = gridCols === 2 ? styles.responsive2Cols 
    : gridCols === 3 ? styles.responsive3Cols 
    : styles.pageContainer
  
  return (
    <div className={`${styles.pageContainer} ${gridClass} ${className}`}>
      {children}
    </div>
  )
}

// Card wrapper for sections
export const SectionCard: React.FC<{ 
  children: React.ReactNode 
  title?: string
  className?: string
  compact?: boolean
  elevated?: boolean
}> = ({ children, title, className = "", compact = false, elevated = false }) => {
  const cardClasses = [
    styles.sectionCard,
    compact && styles.compact,
    elevated && styles.elevated,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClasses}>
      {title && (
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {title}
          </h3>
        </div>
      )}
      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  )
} 