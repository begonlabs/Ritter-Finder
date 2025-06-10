"use client"

import { Check, ChevronsUpDown, Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage, formatMessage } from "@/lib/language-context"
import styles from "../styles/WebsiteSelector.module.css"

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
    <Card className={styles.websiteSelector}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <Globe className={styles.titleIcon} />
          {t("search.websites.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={styles.dropdownTrigger}
            >
              {selectedWebsites.length > 0
                ? formatMessage(t("search.websites.selected"), { count: selectedWebsites.length })
                : t("search.websites.placeholder")}
              <ChevronsUpDown className={styles.dropdownIcon} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={styles.popoverContent} align="start">
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
                      className={styles.commandItem}
                    >
                      <div className={styles.commandItemContent}>
                        <div
                          className={cn(
                            styles.commandItemCheckbox,
                            selectedWebsites.includes(website.value) && styles.checked
                          )}
                        >
                          {selectedWebsites.includes(website.value) && <Check className={styles.commandItemCheckIcon} />}
                        </div>
                        <div className={styles.commandItemDetails}>
                          <span className={styles.commandItemLabel}>{t(website.label)}</span>
                          <div className={styles.commandItemUrl}>{website.value}</div>
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
          <div className={styles.selectedSection}>
            <div className={styles.selectedHeader}>
              <span className={styles.selectedLabel}>Sitios seleccionados:</span>
              <Button variant="ghost" size="sm" onClick={clearAll} className={styles.clearButton}>
                <X className={styles.clearButtonIcon} />
                Limpiar todo
              </Button>
            </div>
            <div className={styles.badgesContainer}>
              {selectedWebsites.map((websiteValue) => {
                const website = websites.find((w) => w.value === websiteValue)
                return (
                  <Badge
                    key={websiteValue}
                    variant="secondary"
                    className={styles.badge}
                  >
                    {website ? t(website.label) : websiteValue}
                    <button
                      className={styles.badgeRemoveButton}
                      onClick={() => removeWebsite(websiteValue)}
                    >
                      <X className={styles.badgeRemoveIcon} />
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
