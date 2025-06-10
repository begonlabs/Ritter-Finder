"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, RefreshCw, Eye, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface SearchHistoryProps {
  history: any[]
  onRerunSearch: (searchData: any) => void
  onViewLeads: (searchId: string) => void
}

export function SearchHistory({ history, onRerunSearch, onViewLeads }: SearchHistoryProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistory = history.filter(
    (item) =>
      item.clientType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.websites.some((website: string) => website.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{t("history.search.title")}</CardTitle>
          <CardDescription>{t("history.search.desc")}</CardDescription>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("history.search.filter")}
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
                <TableHead>{t("history.search.date")}</TableHead>
                <TableHead>{t("history.search.websites")}</TableHead>
                <TableHead>{t("history.search.type")}</TableHead>
                <TableHead className="text-center">{t("history.search.found")}</TableHead>
                <TableHead className="text-center">{t("history.search.contacted")}</TableHead>
                <TableHead className="text-right">{t("history.search.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("history.search.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(item.date), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.websites.map((website: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {website.replace("www.", "")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {t(`client.${item.clientType}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">{item.leadsFound}</TableCell>
                    <TableCell className="text-center">{item.leadsContacted}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onRerunSearch(item)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {t("history.search.rerun")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewLeads(item.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("history.search.view")}
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
