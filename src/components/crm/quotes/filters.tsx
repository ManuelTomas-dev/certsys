"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { statusQuote, currencies, likelihoodLevels, paymentTerms } from "@/lib/mock-quotes"

export type QuoteFilters = {
  busca: string
  status: string
  tipoServico: string
  currency: string
  likelihood: string
  formaPagamento: string
  cliente: string
  salesPerson: string
  workLocation: string
}

type Props = {
  filters?: QuoteFilters
  onChange?: (filters: QuoteFilters) => void
  tiposServico?: string[]
  clientes?: string[]
  salesPersons?: string[]
  workLocations?: string[]
  totalFiltered?: number
}

export function QuoteFiltersBar({
  filters = {
    busca: "",
    status: "Todos",
    tipoServico: "Todos",
    currency: "Todos",
    likelihood: "Todos",
    formaPagamento: "Todos",
    cliente: "Todos",
    salesPerson: "Todos",
    workLocation: "Todos",
  },
  onChange = () => {},
  tiposServico = [],
  clientes = [],
  salesPersons = [],
  workLocations = [],
  totalFiltered = 0,
}: Props) {
  function update<K extends keyof QuoteFilters>(key: K, value: QuoteFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-4 rounded-lg border border-cyan-800/20 bg-cyan-800/5 p-4">
      {/* Linha 1: Busca */}
      <div className="grid gap-4">
        <div className="relative">
          <Label htmlFor="busca" className="text-sm font-medium text-cyan-800">
            Buscar cotações
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="busca"
              placeholder="Buscar por número, título, cliente, responsável..."
              value={filters.busca}
              onChange={(e) => update("busca", e.target.value)}
              className="pl-10 focus:ring-cyan-700"
            />
          </div>
        </div>
      </div>

      {/* Linha 2: Filtros principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label className="text-sm font-medium text-cyan-800">Status</Label>
          <Select value={filters.status} onValueChange={(v) => update("status", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os status</SelectItem>
              {statusQuote.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-cyan-800">Tipo de Serviço</Label>
          <Select value={filters.tipoServico} onValueChange={(v) => update("tipoServico", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tiposServico.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-cyan-800">Moeda</Label>
          <Select value={filters.currency} onValueChange={(v) => update("currency", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas as moedas</SelectItem>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-cyan-800">Probabilidade</Label>
          <Select value={filters.likelihood} onValueChange={(v) => update("likelihood", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas</SelectItem>
              {likelihoodLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Linha 3: Filtros secundários */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label className="text-sm font-medium text-cyan-800">Cliente</Label>
          <Select value={filters.cliente} onValueChange={(v) => update("cliente", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem key={cliente} value={cliente}>
                  {cliente}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-cyan-800">Vendedor</Label>
          <Select value={filters.salesPerson} onValueChange={(v) => update("salesPerson", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {salesPersons.map((person) => (
                <SelectItem key={person} value={person}>
                  {person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-cyan-800">Local de Trabalho</Label>
          <Select value={filters.workLocation} onValueChange={(v) => update("workLocation", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-cyan-800">Forma de Pagamento</Label>
          <Select value={filters.formaPagamento} onValueChange={(v) => update("formaPagamento", v)}>
            <SelectTrigger className="mt-1 focus:ring-cyan-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas</SelectItem>
              {paymentTerms.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumo */}
      <div className="flex items-center justify-between border-t border-cyan-800/20 pt-3">
        <span className="text-sm text-cyan-800">
          <strong>{totalFiltered}</strong> cotações encontradas
        </span>
      </div>
    </div>
  )
}
