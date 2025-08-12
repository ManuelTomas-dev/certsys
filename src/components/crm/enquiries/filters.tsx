"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import { tiposServico, statusEnquiry, prioridades } from "@/lib/mock-enquiries"

export type EnquiryFilters = {
  busca: string
  status: "Todos" | (typeof statusEnquiry)[number]
  tipoServico: "Todos" | (typeof tiposServico)[number]
  prioridade: "Todos" | (typeof prioridades)[number]
  cliente: "Todos" | string
  responsavel: "Todos" | string
}

type Props = {
  filters?: EnquiryFilters
  onChange?: (next: EnquiryFilters) => void
  clientes?: string[]
  responsaveis?: string[]
  totalFiltered?: number
}

export function EnquiryFiltersBar({
  filters = {
    busca: "",
    status: "Todos",
    tipoServico: "Todos",
    prioridade: "Todos",
    cliente: "Todos",
    responsavel: "Todos",
  },
  onChange = () => {},
  clientes = ["Todos"],
  responsaveis = ["Todos"],
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
                aria-label="Buscar enquiry"
                placeholder="Buscar por título, cliente, descrição..."
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
              onValueChange={(v: EnquiryFilters["status"]) => onChange({ ...filters, status: v })}
            >
              <SelectTrigger id="f-status" className="focus:ring-cyan-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {statusEnquiry.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-tipo" className="sr-only">
              Filtrar por tipo de serviço
            </Label>
            <Select
              value={filters.tipoServico}
              onValueChange={(v: EnquiryFilters["tipoServico"]) => onChange({ ...filters, tipoServico: v })}
            >
              <SelectTrigger id="f-tipo" className="focus:ring-cyan-700">
                <SelectValue placeholder="Serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {tiposServico.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-prioridade" className="sr-only">
              Filtrar por prioridade
            </Label>
            <Select
              value={filters.prioridade}
              onValueChange={(v: EnquiryFilters["prioridade"]) => onChange({ ...filters, prioridade: v })}
            >
              <SelectTrigger id="f-prioridade" className="focus:ring-cyan-700">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {prioridades.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
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
            <Label htmlFor="f-responsavel" className="sr-only">
              Filtrar por responsável
            </Label>
            <Select value={filters.responsavel} onValueChange={(v) => onChange({ ...filters, responsavel: v })}>
              <SelectTrigger id="f-responsavel" className="focus:ring-cyan-700">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                {responsaveis.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
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
                tipoServico: "Todos",
                prioridade: "Todos",
                cliente: "Todos",
                responsavel: "Todos",
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
