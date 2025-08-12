"use client"

import type { Quote } from "@/types/quotes"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"
import { formatDate, formatCurrency } from "@/lib/mock-quotes"

type Props = {
  rows?: Quote[]
  onView?: (q: Quote) => void
  onEdit?: (q: Quote) => void
  onArchive?: (q: Quote) => void
}

function getStatusColor(status: string) {
  switch (status) {
    case "Rascunho":
      return "border-gray-600/30 text-gray-700"
    case "Enviada":
      return "border-blue-600/30 text-blue-700"
    case "Em Revisão":
      return "border-yellow-600/30 text-yellow-700"
    case "Aprovada":
      return "border-green-600/30 text-green-700"
    case "Rejeitada":
      return "border-red-600/30 text-red-700"
    case "Expirada":
      return "border-orange-600/30 text-orange-700"
    case "Arquivada":
      return "border-gray-600/30 text-gray-700"
    default:
      return "border-gray-600/30 text-gray-700"
  }
}

function getLikelihoodColor(likelihood: string) {
  switch (likelihood) {
    case "Baixa":
      return "border-red-600/30 text-red-700"
    case "Média":
      return "border-yellow-600/30 text-yellow-700"
    case "Alta":
      return "border-green-600/30 text-green-700"
    case "Muito Alta":
      return "border-emerald-600/30 text-emerald-700"
    default:
      return "border-gray-600/30 text-gray-700"
  }
}

export function QuotesTable({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-cyan-800/10 sm:block">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cyan-800/5 text-cyan-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Cotação</th>
            <th className="px-4 py-3 text-left font-medium">Cliente</th>
            <th className="px-4 py-3 text-left font-medium">Serviço</th>
            <th className="px-4 py-3 text-left font-medium">Valor Total</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Probabilidade</th>
            <th className="px-4 py-3 text-left font-medium">Validade</th>
            <th className="px-4 py-3 text-left font-medium">Vendedor</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((q) => (
            <tr key={q.id} className={cn("border-t transition-colors hover:bg-cyan-800/5", "animate-in fade-in")}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{q.numero}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">{q.titulo}</span>
                  <Badge variant="outline" className="mt-1 w-fit text-xs">
                    {q.currency}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="truncate max-w-[160px]">{q.clientName}</span>
                  {q.workLocationName && (
                    <span className="text-xs text-muted-foreground truncate max-w-[160px]">{q.workLocationName}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{q.tipoServico}</Badge>
              </td>
              <td className="px-4 py-3 font-medium">
                <div className="flex flex-col">
                  <span>{formatCurrency(q.valorTotal, q.currency)}</span>
                  <span className="text-xs text-muted-foreground">Custo: {formatCurrency(q.coast, q.currency)}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={getStatusColor(q.status)}>
                  {q.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={getLikelihoodColor(q.likelihoodOfConversion)}>
                  {q.likelihoodOfConversion}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span>{formatDate(q.dataValidade)}</span>
                  <span className="text-xs text-muted-foreground">Criada: {formatDate(q.dataCriacao)}</span>
                </div>
              </td>
              <td className="px-4 py-3 truncate max-w-[140px]">{q.salesPersonName || "-"}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <PersonnelActionsMenu
                    onView={() => onView(q)}
                    onEdit={() => onEdit(q)}
                    onArchive={() => onArchive(q)}
                    isArchived={q.status === "Arquivada"}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                Nenhuma cotação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
