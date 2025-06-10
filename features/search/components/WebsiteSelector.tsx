"use client"

import { Check, ChevronsUpDown, Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage, formatMessage } from "@/lib/language-context"

const websites = [
  { value: "www.solarinstallers.com", label: "website.solarinstallers" },
  { value: "www.greenenergyfirms.net", label: "website.greenenergy" },
  { value: "www.eco-consultants.org", label: "website.ecoconsultants" },
  { value: "www.renewableenergy.com", label: "website.renewableenergy" },
  { value: "www.sustainablesolutions.co", label: "website.sustainablesolutions" },
]

interface WebsiteSelectorProps {
  selectedWebsites: string[]
  setSelectedWebsites: (websites: string[]) => void
}

export function WebsiteSelector({ selectedWebsites, setSelectedWebsites }: WebsiteSelectorProps) {
  const { t } = useLanguage()

  const toggleWebsite = (websiteValue: string) => {
    if (selectedWebsites.includes(websiteValue)) {
      setSelectedWebsites(selectedWebsites.filter((value) => value !== websiteValue))
    } else {
      setSelectedWebsites([...selectedWebsites, websiteValue])
    }
  }

  const removeWebsite = (websiteValue: string) => {
    setSelectedWebsites(selectedWebsites.filter((value) => value !== websiteValue))
  }

  const clearAll = () => {
    setSelectedWebsites([])
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-ritter-gold" />
          {t("search.websites.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between h-12 border-2 border-dashed border-gray-300 hover:border-ritter-gold hover:bg-ritter-gold/5"
            >
              {selectedWebsites.length > 0
                ? formatMessage(t("search.websites.selected"), { count: selectedWebsites.length })
                : t("search.websites.placeholder")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder={t("search.websites.search")} />
              <CommandList>
                <CommandEmpty>{t("search.websites.empty")}</CommandEmpty>
                <CommandGroup>
                  {websites.map((website) => (
                    <CommandItem
                      key={website.value}
                      value={website.value}
                      onSelect={() => toggleWebsite(website.value)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border",
                            selectedWebsites.includes(website.value)
                              ? "bg-ritter-gold border-ritter-gold"
                              : "border-gray-300",
                          )}
                        >
                          {selectedWebsites.includes(website.value) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{t(website.label)}</span>
                          <div className="text-xs text-gray-500">{website.value}</div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedWebsites.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sitios seleccionados:</span>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-700">
                <X className="h-3 w-3 mr-1" />
                Limpiar todo
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedWebsites.map((websiteValue) => {
                const website = websites.find((w) => w.value === websiteValue)
                return (
                  <Badge
                    key={websiteValue}
                    variant="secondary"
                    className="px-3 py-1 bg-ritter-gold/10 text-ritter-dark border border-ritter-gold/20 hover:bg-ritter-gold/20 transition-colors"
                  >
                    {website ? t(website.label) : websiteValue}
                    <button
                      className="ml-2 text-xs hover:text-red-600 transition-colors"
                      onClick={() => removeWebsite(websiteValue)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
