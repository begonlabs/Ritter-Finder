"use client"

import { useState } from "react"
import { WebsiteSelector } from "@/components/website-selector"
import { ClientTypeSelector } from "@/components/client-type-selector"
import { ScrapingSimulation } from "@/components/scraping-simulation"
import { SearchHistory } from "@/components/search-history"
import { EmailHistory } from "@/components/email-history"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { mockLeads, mockSearchHistory, mockEmailCampaigns } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, TrendingUp, Users, Sparkles, ArrowRight, History } from "lucide-react"
import { useLanguage, formatMessage } from "@/lib/language-context"
import { Onboarding } from "@/components/onboarding"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrapingStats } from "@/components/scraping-stats"
import { EnhancedResultsTable } from "@/components/enhanced-results-table"
import { EnhancedEmailComposer } from "@/components/enhanced-email-composer"

export default function Dashboard() {
  const { t } = useLanguage()

  // Estados principales
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([])
  const [selectedClientType, setSelectedClientType] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchComplete, setSearchComplete] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [emailSent, setEmailSent] = useState(false)

  // Funciones de manejo
  const handleSearch = () => {
    if (selectedWebsites.length === 0 || !selectedClientType) {
      return
    }

    setIsSearching(true)
    setSearchComplete(false)
    setLeads([])
    setSelectedLeads([])
    setEmailSent(false)

    setTimeout(() => {
      setIsSearching(false)
      setSearchComplete(true)
      setLeads(mockLeads)
      setActiveTab("results")
    }, 5000)
  }

  const handleSelectLead = (id: string) => {
    setSelectedLeads((prev) => (prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]))
  }

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedLeads(leads.map((lead) => lead.id))
    } else {
      setSelectedLeads([])
    }
  }

  const handleSendCampaign = (campaignData: any) => {
    setEmailSent(true)
    console.log("Campaign sent:", campaignData)
    setTimeout(() => {
      setActiveTab("dashboard")
      setSelectedWebsites([])
      setSelectedClientType("")
      setSearchComplete(false)
      setLeads([])
      setSelectedLeads([])
      setEmailSent(false)
    }, 5000)
  }

  const handleRerunSearch = (searchData: any) => {
    setSelectedWebsites(searchData.websites)
    setSelectedClientType(searchData.clientType)
    setActiveTab("search")
  }

  const handleViewLeads = () => {
    setLeads(mockLeads)
    setActiveTab("results")
  }

  const handleViewCampaign = () => {
    setActiveTab("campaign")
  }

  const handleDuplicateCampaign = () => {
    setActiveTab("campaign")
  }

  const getSelectedLeadsData = () => {
    return leads.filter((lead) => selectedLeads.includes(lead.id))
  }

  const canStartSearch = selectedWebsites.length > 0 && selectedClientType && !isSearching

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader />
      <Onboarding />

      <main className="container mx-auto py-6 px-4">
        <DashboardNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchComplete={searchComplete}
          selectedLeadsCount={selectedLeads.length}
        />

        <div className="space-y-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <DashboardStats />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Trend Chart */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-ritter-gold" />
                      {t("dashboard.trend.title")}
                    </CardTitle>
                    <CardDescription>{t("dashboard.trend.subtitle")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-ritter-gold/10 to-ritter-gold/5 rounded-lg border border-ritter-gold/20">
                        <div>
                          <p className="text-sm text-muted-foreground">{t("month.jun")}</p>
                          <p className="text-2xl font-bold text-ritter-gold">150</p>
                          <p className="text-xs text-muted-foreground">{t("dashboard.trend.found")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t("month.jun")}</p>
                          <p className="text-2xl font-bold text-ritter-dark">120</p>
                          <p className="text-xs text-muted-foreground">{t("dashboard.trend.contacted")}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1">
                          <TrendingUp className="h-4 w-4" />↑ 12% {t("time.from.month")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-ritter-gold" />
                      {t("dashboard.activity")}
                    </CardTitle>
                    <CardDescription>{t("dashboard.activity.desc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSearchHistory.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="bg-ritter-gold/10 p-2 rounded-full">
                            <Search className="h-4 w-4 text-ritter-gold" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{t("dashboard.search.completed")}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatMessage(t("dashboard.search.found"), {
                                count: item.leadsFound,
                                type: t(`client.${item.clientType}`),
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-ritter-gold" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button
                      onClick={() => setActiveTab("search")}
                      className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark h-12 justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Iniciar Nueva Búsqueda
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setActiveTab("history")}
                      variant="outline"
                      className="h-12 justify-between border-ritter-gold/20 hover:bg-ritter-gold/5"
                    >
                      <span className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Ver Historial
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Tab */}
          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Búsqueda Inteligente de Leads</h2>
                <p className="text-gray-600">Configura tu búsqueda y deja que nuestra IA encuentre los mejores leads</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <WebsiteSelector selectedWebsites={selectedWebsites} setSelectedWebsites={setSelectedWebsites} />
                <ClientTypeSelector
                  selectedClientType={selectedClientType}
                  setSelectedClientType={setSelectedClientType}
                />
              </div>

              {!canStartSearch && !isSearching && (
                <Alert>
                  <AlertDescription>
                    Selecciona al menos un sitio web y un tipo de cliente para comenzar la búsqueda.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleSearch}
                  disabled={!canStartSearch}
                  className="bg-ritter-gold hover:bg-amber-500 text-ritter-dark px-8 h-12 text-lg"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ritter-dark mr-2"></div>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      {t("search.button")}
                    </>
                  )}
                </Button>
              </div>

              {isSearching && <ScrapingSimulation websites={selectedWebsites} />}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && (
            <div className="space-y-6">
              <EnhancedResultsTable
                leads={leads}
                selectedLeads={selectedLeads}
                onSelectLead={handleSelectLead}
                onSelectAll={handleSelectAll}
                onProceedToCampaign={() => setActiveTab("campaign")}
              />
            </div>
          )}

          {/* Campaign Tab */}
          {activeTab === "campaign" && (
            <div className="space-y-6">
              <EnhancedEmailComposer
                selectedLeads={getSelectedLeadsData()}
                onSendCampaign={handleSendCampaign}
                emailSent={emailSent}
              />
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Historial y Análisis</h2>
                <p className="text-gray-600">Revisa tus búsquedas anteriores y el rendimiento de tus campañas</p>
              </div>

              <SearchHistory
                history={mockSearchHistory}
                onRerunSearch={handleRerunSearch}
                onViewLeads={handleViewLeads}
              />

              <EmailHistory
                campaigns={mockEmailCampaigns}
                onViewCampaign={handleViewCampaign}
                onDuplicateCampaign={handleDuplicateCampaign}
              />
            </div>
          )}

          {/* Scraping Stats Tab */}
          {activeTab === "scraping" && (
            <div className="space-y-6">
              <ScrapingStats />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
