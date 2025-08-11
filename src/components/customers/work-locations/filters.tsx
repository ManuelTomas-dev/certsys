"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import { tiposWorkLocation } from "@/lib/mock-work-locations"

export type WorkLocationFilters = {
  busca: string
  status: "Todos" | "Ativo" | "Arquivado"
  cliente: "Todos" | string
  pais: "Todos" | string
  cidade: "Todos" | string
  tipo: "Todos" | (typeof tiposWorkLocation)[number]
}

type Props = {
  filters?: WorkLocationFilters
  onChange?: (next: WorkLocationFilters) => void
  clientes?: string[]
  paises?: string[]
  cidades?: string[]
  tipos?: string[]
  totalFiltered?: number
}
export function WorkLocationFiltersBar({
  filters = { busca: "", status: "Todos", cliente: "Todos", pais: "Todos", cidade: "Todos", tipo: "Todos" },
  onChange = () => {},
  clientes = ["Todos"],
  paises = ["Todos"],
  cidades = ["Todos"],
  tipos = ["Todos", ...tiposWorkLocation],
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
                aria-label="Buscar local de trabalho"
                placeholder="Buscar por local, cliente, cidade..."
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
              onValueChange={(v: WorkLocationFilters["status"]) => onChange({ ...filters, status: v })}
            >
              <SelectTrigger id="f-status" className="focus:ring-cyan-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Ativo">Ativos</SelectItem>
                <SelectItem value="Arquivado">Arquivados</SelectItem>
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
            <Label htmlFor="f-pais" className="sr-only">
              Filtrar por país
            </Label>
            <Select value={filters.pais} onValueChange={(v) => onChange({ ...filters, pais: v, cidade: "Todos" })}>
              <SelectTrigger id="f-pais" className="focus:ring-cyan-700">
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                {paises.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-cidade" className="sr-only">
              Filtrar por cidade
            </Label>
            <Select value={filters.cidade} onValueChange={(v) => onChange({ ...filters, cidade: v })}>
              <SelectTrigger id="f-cidade" className="focus:ring-cyan-700">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidades.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-tipo" className="sr-only">
              Filtrar por tipo
            </Label>
            <Select value={filters.tipo} onValueChange={(v) => onChange({ ...filters, tipo: v as any })}>
              <SelectTrigger id="f-tipo" className="focus:ring-cyan-700">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
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
              onChange({ busca: "", status: "Todos", cliente: "Todos", pais: "Todos", cidade: "Todos", tipo: "Todos" })
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
