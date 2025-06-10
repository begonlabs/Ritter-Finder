"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

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
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t("search.client.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between">
              {selectedType ? t(selectedType.label) : t("search.client.placeholder")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={t("search.client.search")} />
              <CommandList>
                <CommandEmpty>{t("search.client.empty")}</CommandEmpty>
                <CommandGroup>
                  {clientTypes.map((type) => (
                    <CommandItem key={type.value} value={type.value} onSelect={() => setSelectedClientType(type.value)}>
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border",
                            selectedClientType === type.value ? "bg-ritter-gold border-ritter-gold" : "border-gray-300",
                          )}
                        >
                          {selectedClientType === type.value && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span>{t(type.label)}</span>
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
