"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"

export type ClientFilters = {
  busca: string
  status: "Todos" | "Ativo" | "Arquivado"
  pais: "Todos" | string
  cidade: "Todos" | string
}

type Props = {
  filters?: ClientFilters
  onChange?: (next: ClientFilters) => void
  paises?: string[]
  cidades?: string[]
  totalFiltered?: number
}
export function ClientFiltersBar({
  filters = { busca: "", status: "Todos", pais: "Todos", cidade: "Todos" },
  onChange = () => {},
  paises = ["Todos"],
  cidades = ["Todos"],
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
                aria-label="Buscar cliente"
                placeholder="Buscar por nome, NIF, e-mail, website..."
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
              onValueChange={(v: ClientFilters["status"]) => onChange({ ...filters, status: v })}
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
            onClick={() => onChange({ busca: "", status: "Todos", pais: "Todos", cidade: "Todos" })}
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
