"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Copy, Eye, Mail, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/language-context"

interface EmailHistoryProps {
  campaigns: any[]
  onViewCampaign: (campaignId: string) => void
  onDuplicateCampaign: (campaignId: string) => void
}

export function EmailHistory({ campaigns, onViewCampaign, onDuplicateCampaign }: EmailHistoryProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{t("history.email.title")}</CardTitle>
          <CardDescription>{t("history.email.desc")}</CardDescription>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("history.email.search")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("history.email.date")}</TableHead>
                <TableHead>{t("history.email.subject")}</TableHead>
                <TableHead className="text-center">{t("history.email.recipients")}</TableHead>
                <TableHead>{t("history.email.open")}</TableHead>
                <TableHead>{t("history.email.click")}</TableHead>
                <TableHead className="text-right">{t("history.email.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("history.email.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(campaign.date), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{campaign.subject}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{campaign.recipients}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={campaign.openRate} className="h-2" />
                        <span className="text-sm">{campaign.openRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={campaign.clickRate} className="h-2" />
                        <span className="text-sm">{campaign.clickRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewCampaign(campaign.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("history.email.view")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDuplicateCampaign(campaign.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            {t("history.email.duplicate")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
