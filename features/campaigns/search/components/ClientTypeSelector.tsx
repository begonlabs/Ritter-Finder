"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import styles from "../styles/ClientTypeSelector.module.css"

const clientTypes = [
  { value: "industrial", label: "client.industrial" },
  { value: "solar", label: "client.solar" },
  { value: "energy", label: "client.energy" },
  { value: "residential", label: "client.residential" },
  { value: "commercial", label: "client.commercial" },
]

interface ClientTypeSelectorProps {
  selectedClientType: string
  setSelectedClientType: (clientType: string) => void
}

export function ClientTypeSelector({ selectedClientType, setSelectedClientType }: ClientTypeSelectorProps) {
  const { t } = useLanguage()
  const selectedType = clientTypes.find((type) => type.value === selectedClientType)

  return (
    <Card className={styles.clientTypeSelector}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>{t("search.client.title")}</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className={styles.dropdownTrigger}>
              {selectedType ? t(selectedType.label) : t("search.client.placeholder")}
              <ChevronsUpDown className={styles.dropdownIcon} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={styles.popoverContent}>
            <Command>
              <CommandInput placeholder={t("search.client.search")} />
              <CommandList>
                <CommandEmpty>{t("search.client.empty")}</CommandEmpty>
                <CommandGroup>
                  {clientTypes.map((type) => (
                    <CommandItem 
                      key={type.value} 
                      value={type.value} 
                      onSelect={() => setSelectedClientType(type.value)}
                      className={styles.commandItem}
                    >
                      <div className={styles.commandItemContent}>
                        <div
                          className={cn(
                            styles.commandItemCheckbox,
                            selectedClientType === type.value && styles.checked
                          )}
                        >
                          {selectedClientType === type.value && <Check className={styles.commandItemCheckIcon} />}
                        </div>
                        <span className={styles.commandItemLabel}>{t(type.label)}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}
