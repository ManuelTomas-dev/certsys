"use client"

import type { Enquiry } from "@/types/enquiries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"
import { formatDate, formatCurrency } from "@/lib/mock-enquiries"
import { CheckCircle, X } from "lucide-react"

type Props = {
  rows?: Enquiry[]
  onView?: (e: Enquiry) => void
  onEdit?: (e: Enquiry) => void
  onArchive?: (e: Enquiry) => void
  onConvert?: (e: Enquiry) => void
  onClose?: (e: Enquiry) => void
}

function getStatusColor(status: string) {
  switch (status) {
    case "Nova":
      return "border-blue-600/30 text-blue-700"
    case "Em Análise":
      return "border-yellow-600/30 text-yellow-700"
    case "Cotação Enviada":
      return "border-purple-600/30 text-purple-700"
    case "Aprovada":
      return "border-green-600/30 text-green-700"
    case "Convertida":
      return "border-emerald-600/30 text-emerald-700 bg-emerald-50"
    case "Fechada":
      return "border-gray-600/30 text-gray-700"
    case "Rejeitada":
      return "border-red-600/30 text-red-700"
    case "Arquivada":
      return "border-gray-600/30 text-gray-700"
    default:
      return "border-gray-600/30 text-gray-700"
  }
}

function getProbabilityColor(probabilidade: number) {
  if (probabilidade >= 80) return "border-green-600/30 text-green-700 bg-green-50"
  if (probabilidade >= 60) return "border-blue-600/30 text-blue-700 bg-blue-50"
  if (probabilidade >= 40) return "border-yellow-600/30 text-yellow-700 bg-yellow-50"
  if (probabilidade >= 20) return "border-orange-600/30 text-orange-700 bg-orange-50"
  return "border-red-600/30 text-red-700 bg-red-50"
}

export function EnquiriesTable({
  rows = [],
  onView = () => {},
  onEdit = () => {},
  onArchive = () => {},
  onConvert = () => {},
  onClose = () => {},
}: Props) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-cyan-800/10 sm:block">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cyan-800/5 text-cyan-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Enquiry</th>
            <th className="px-4 py-3 text-left font-medium">Cliente</th>
            <th className="px-4 py-3 text-left font-medium">Origem</th>
            <th className="px-4 py-3 text-left font-medium">Equipa</th>
            <th className="px-4 py-3 text-left font-medium">Probabilidade</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Valor Est.</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className={cn("border-t transition-colors hover:bg-cyan-800/5", "animate-in fade-in")}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{e.titulo}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(e.data)}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="truncate max-w-[160px]">{e.nomeCliente}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[160px]">{e.localizacaoCliente}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="text-xs">
                  {e.origem}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-muted-foreground">{e.equipaVenda}</span>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={getProbabilityColor(e.probabilidade)}>
                  {e.probabilidade}%
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={getStatusColor(e.status)}>
                  {e.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatCurrency(e.valorEstimado)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end items-center gap-1">
                  {/* Botões de ação rápida */}
                  {e.status === "Aprovada" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onConvert(e)}
                      className="h-7 px-2 text-xs text-green-700 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Converter
                    </Button>
                  )}
                  {(e.status === "Rejeitada" || e.status === "Em Análise") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onClose(e)}
                      className="h-7 px-2 text-xs text-gray-700 border-gray-200 hover:bg-gray-50"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Fechar
                    </Button>
                  )}
                  <PersonnelActionsMenu
                    onView={() => onView(e)}
                    onEdit={() => onEdit(e)}
                    onArchive={() => onArchive(e)}
                    isArchived={e.status === "Arquivada"}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                Nenhuma enquiry encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
