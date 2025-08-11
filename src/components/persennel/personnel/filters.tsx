"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import type { Filters } from "@/types/personnel"

type Props = {
  filters?: Filters
  onChange?: (next: Filters) => void
  funcoes?: string[]
  localidades?: string[]
  supervisores?: string[]
  totalFiltered?: number
}
export function PersonnelFilters({
  filters = { busca: "", funcao: "Todos", localidade: "Todos", supervisor: "Todos", status: "Todos" },
  onChange = () => {},
  funcoes = ["Todos"],
  localidades = ["Todos"],
  supervisores = ["Todos"],
  totalFiltered = 0,
}: Props) {
  return (
    <Card className="border-cyan-800/10 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-cyan-800">Filtragem e Pesquisa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-6">
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-800/70" />
              <Input
                aria-label="Buscar pessoal"
                placeholder="Buscar por nome, e-mail, função, BI..."
                className="pl-8 focus-visible:ring-cyan-700"
                value={filters.busca}
                onChange={(e) => onChange({ ...filters, busca: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="f-funcao" className="sr-only">
              Filtrar por função
            </Label>
            <Select value={filters.funcao} onValueChange={(v) => onChange({ ...filters, funcao: v })}>
              <SelectTrigger id="f-funcao" className="focus:ring-cyan-700">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                {funcoes.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-localidade" className="sr-only">
              Filtrar por localidade
            </Label>
            <Select value={filters.localidade} onValueChange={(v) => onChange({ ...filters, localidade: v })}>
              <SelectTrigger id="f-localidade" className="focus:ring-cyan-700">
                <SelectValue placeholder="Localidade" />
              </SelectTrigger>
              <SelectContent>
                {localidades.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-supervisor" className="sr-only">
              Filtrar por supervisor
            </Label>
            <Select value={filters.supervisor} onValueChange={(v) => onChange({ ...filters, supervisor: v })}>
              <SelectTrigger id="f-supervisor" className="focus:ring-cyan-700">
                <SelectValue placeholder="Supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisores.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-status" className="sr-only">
              Filtrar por status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(v: Filters["status"]) => onChange({ ...filters, status: v })}
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
              onChange({ busca: "", funcao: "Todos", localidade: "Todos", supervisor: "Todos", status: "Todos" })
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
