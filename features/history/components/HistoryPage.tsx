"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, History, Mail, Clock, BarChart3 } from "lucide-react"
import { SearchHistory } from "./SearchHistory"
import { CampaignHistory } from "./CampaignHistory"
import { ActivityTimeline } from "./ActivityTimeline"
import type { HistoryPageProps } from "../types"

interface HistoryPageComponentProps extends HistoryPageProps {
  onNavigateToSearch?: () => void
  onNavigateToCampaigns?: () => void
  onNavigateToResults?: () => void
  onRerunSearch?: (searchData: any) => void
  onViewLeads?: (searchId: string) => void
  onViewCampaign?: (campaignId: string) => void
  onDuplicateCampaign?: (campaignId: string) => void
  onViewActivityDetails?: (activityId: string) => void
}

export function HistoryPage({
  showSearchHistory = true,
  showCampaignHistory = true,
  showActivityTimeline = true,
  compactMode = false,
  maxItems = 50,
  onNavigateToSearch,
  onNavigateToCampaigns,
  onNavigateToResults,
  onRerunSearch = () => {},
  onViewLeads = () => {},
  onViewCampaign = () => {},
  onDuplicateCampaign = () => {},
  onViewActivityDetails = () => {}
}: HistoryPageComponentProps) {
  const [activeTab, setActiveTab] = useState("search")

  const handleExportHistory = async (type: 'search' | 'campaign' | 'activity') => {
    console.log(`Exporting ${type} history...`)
    // In real app, this would trigger export functionality
  }

  const handleRerunSearchWrapper = (searchData: any) => {
    onRerunSearch(searchData)
    onNavigateToSearch?.()
  }

  const handleViewLeadsWrapper = (searchId: string) => {
    onViewLeads(searchId)
    onNavigateToResults?.()
  }

  const handleViewCampaignWrapper = (campaignId: string) => {
    onViewCampaign(campaignId)
    onNavigateToCampaigns?.()
  }

  const handleDuplicateCampaignWrapper = (campaignId: string) => {
    onDuplicateCampaign(campaignId)
    onNavigateToCampaigns?.()
  }

  // Determine which tabs to show
  const availableTabs = []
  if (showSearchHistory) availableTabs.push({ id: "search", label: "Búsquedas", icon: History })
  if (showCampaignHistory) availableTabs.push({ id: "campaigns", label: "Campañas", icon: Mail })
  if (showActivityTimeline) availableTabs.push({ id: "activity", label: "Actividad", icon: Clock })

  // If only one tab is available, don't show tabs UI
  const showTabs = availableTabs.length > 1

  if (!showTabs && availableTabs.length === 1) {
    const singleTab = availableTabs[0]
    
    return (
      <div className="space-y-6">
        {!compactMode && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Historial y Análisis
            </h2>
            <p className="text-gray-600">
              Revisa tu historial y analiza el rendimiento de tus actividades
            </p>
          </div>
        )}

        {singleTab.id === "search" && showSearchHistory && (
          <SearchHistory
            onRerunSearch={handleRerunSearchWrapper}
            onViewLeads={handleViewLeadsWrapper}
            compact={compactMode}
          />
        )}
        
        {singleTab.id === "campaigns" && showCampaignHistory && (
          <CampaignHistory
            onViewCampaign={handleViewCampaignWrapper}
            onDuplicateCampaign={handleDuplicateCampaignWrapper}
            compact={compactMode}
          />
        )}
        
        {singleTab.id === "activity" && showActivityTimeline && (
          <ActivityTimeline
            onViewDetails={onViewActivityDetails}
            maxItems={maxItems}
            compact={compactMode}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!compactMode && (
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Historial y Análisis
            </h2>
            <p className="text-gray-600">
              Revisa tu historial y analiza el rendimiento de tus actividades
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportHistory(activeTab as 'search' | 'campaign' | 'activity')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      )}

      {showTabs ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {availableTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {showSearchHistory && (
            <TabsContent value="search" className="mt-6">
              <SearchHistory
                onRerunSearch={handleRerunSearchWrapper}
                onViewLeads={handleViewLeadsWrapper}
                compact={compactMode}
              />
            </TabsContent>
          )}

          {showCampaignHistory && (
            <TabsContent value="campaigns" className="mt-6">
              <CampaignHistory
                onViewCampaign={handleViewCampaignWrapper}
                onDuplicateCampaign={handleDuplicateCampaignWrapper}
                compact={compactMode}
              />
            </TabsContent>
          )}

          {showActivityTimeline && (
            <TabsContent value="activity" className="mt-6">
              <ActivityTimeline
                onViewDetails={onViewActivityDetails}
                maxItems={maxItems}
                compact={compactMode}
              />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="space-y-8">
          {showSearchHistory && (
            <SearchHistory
              onRerunSearch={handleRerunSearchWrapper}
              onViewLeads={handleViewLeadsWrapper}
              compact={compactMode}
            />
          )}
          
          {showCampaignHistory && (
            <CampaignHistory
              onViewCampaign={handleViewCampaignWrapper}
              onDuplicateCampaign={handleDuplicateCampaignWrapper}
              compact={compactMode}
            />
          )}
          
          {showActivityTimeline && (
            <ActivityTimeline
              onViewDetails={onViewActivityDetails}
              maxItems={maxItems}
              compact={compactMode}
            />
          )}
        </div>
      )}
    </div>
  )
} 