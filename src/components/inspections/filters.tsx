"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import { tiposInspection, statusInspection } from "@/lib/mock-inspections"

export type InspectionFilters = {
  busca: string
  status: "Todos" | (typeof statusInspection)[number]
  tipo: "Todos" | (typeof tiposInspection)[number]
  cliente: "Todos" | string
  local: "Todos" | string
  inspetor: "Todos" | string
}

type Props = {
  filters?: InspectionFilters
  onChange?: (next: InspectionFilters) => void
  clientes?: string[]
  locais?: string[]
  inspetores?: string[]
  totalFiltered?: number
}

export function InspectionFiltersBar({
  filters = { busca: "", status: "Todos", tipo: "Todos", cliente: "Todos", local: "Todos", inspetor: "Todos" },
  onChange = () => {},
  clientes = ["Todos"],
  locais = ["Todos"],
  inspetores = ["Todos"],
  totalFiltered = 0,
}: Props) {
  return (
    <Card className="border-cyan-800/10 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-cyan-800">Consulta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-6">
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-800/70" />
              <Input
                aria-label="Buscar inspeção"
                placeholder="Buscar por equipamento, norma, cliente..."
                className="pl-8 focus-visible:ring-cyan-700"
                value={filters.busca}
                onChange={(e) => onChange({ ...filters, busca: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="f-status" className="sr-only">
              Filtrar por status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(v: InspectionFilters["status"]) => onChange({ ...filters, status: v })}
            >
              <SelectTrigger id="f-status" className="focus:ring-cyan-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {statusInspection.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-tipo" className="sr-only">
              Filtrar por tipo
            </Label>
            <Select
              value={filters.tipo}
              onValueChange={(v: InspectionFilters["tipo"]) => onChange({ ...filters, tipo: v })}
            >
              <SelectTrigger id="f-tipo" className="focus:ring-cyan-700">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {tiposInspection.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-cliente" className="sr-only">
              Filtrar por cliente
            </Label>
            <Select value={filters.cliente} onValueChange={(v) => onChange({ ...filters, cliente: v })}>
              <SelectTrigger id="f-cliente" className="focus:ring-cyan-700">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-local" className="sr-only">
              Filtrar por local
            </Label>
            <Select value={filters.local} onValueChange={(v) => onChange({ ...filters, local: v })}>
              <SelectTrigger id="f-local" className="focus:ring-cyan-700">
                <SelectValue placeholder="Local" />
              </SelectTrigger>
              <SelectContent>
                {locais.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-inspetor" className="sr-only">
              Filtrar por inspetor
            </Label>
            <Select value={filters.inspetor} onValueChange={(v) => onChange({ ...filters, inspetor: v })}>
              <SelectTrigger id="f-inspetor" className="focus:ring-cyan-700">
                <SelectValue placeholder="Inspetor" />
              </SelectTrigger>
              <SelectContent>
                {inspetores.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5 text-cyan-800/80" />
            <span>
              {totalFiltered} resultado{totalFiltered === 1 ? "" : "s"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                busca: "",
                status: "Todos",
                tipo: "Todos",
                cliente: "Todos",
                local: "Todos",
                inspetor: "Todos",
              })
            }
            className="text-cyan-800 hover:bg-cyan-800/10"
          >
            <X className="mr-2 h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
