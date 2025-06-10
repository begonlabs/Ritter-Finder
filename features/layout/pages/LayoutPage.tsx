import React from 'react'

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
    <div className={`layout-page min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(title || subtitle || headerActions) && (
          <div className="layout-header mb-8">
            <div className="flex justify-between items-start">
              <div className="layout-header-content">
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 text-lg">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerActions && (
                <div className="layout-header-actions">
                  {headerActions}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="layout-content">
          <div className="bg-white rounded-lg shadow-sm border min-h-[400px]">
            <div className="p-6">
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
}> = ({ children, className = "" }) => {
  return (
    <div className={`page-container ${className}`}>
      <div className="grid gap-6">
        {children}
      </div>
    </div>
  )
}

// Card wrapper for sections
export const SectionCard: React.FC<{ 
  children: React.ReactNode 
  title?: string
  className?: string
}> = ({ children, title, className = "" }) => {
  return (
    <div className={`section-card bg-white rounded-lg border shadow-sm ${className}`}>
      {title && (
        <div className="section-header px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>
      )}
      <div className="section-content p-6">
        {children}
      </div>
    </div>
  )
} 