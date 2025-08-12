"use client"

import type { Inspection } from "@/types/inspections"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/mock-inspections"

type Props = {
  rows?: Inspection[]
  onView?: (i: Inspection) => void
  onEdit?: (i: Inspection) => void
  onArchive?: (i: Inspection) => void
}

function getStatusColor(status: string) {
  switch (status) {
    case "Agendada":
      return "border-blue-600/30 text-blue-700"
    case "Em Andamento":
      return "border-yellow-600/30 text-yellow-700"
    case "Concluída":
      return "border-purple-600/30 text-purple-700"
    case "Aprovada":
      return "border-green-600/30 text-green-700"
    case "Rejeitada":
      return "border-red-600/30 text-red-700"
    case "Arquivada":
      return "border-gray-600/30 text-gray-700"
    default:
      return "border-gray-600/30 text-gray-700"
  }
}

function getResultColor(resultado?: string) {
  switch (resultado) {
    case "Conforme":
      return "border-green-600/30 text-green-700"
    case "Não Conforme":
      return "border-red-600/30 text-red-700"
    case "Condicional":
      return "border-yellow-600/30 text-yellow-700"
    default:
      return "border-gray-600/30 text-gray-700"
  }
}

export function InspectionsTable({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-cyan-800/10 sm:block">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cyan-800/5 text-cyan-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Equipamento</th>
            <th className="px-4 py-3 text-left font-medium">Tipo</th>
            <th className="px-4 py-3 text-left font-medium">Cliente/Local</th>
            <th className="px-4 py-3 text-left font-medium">Inspetor</th>
            <th className="px-4 py-3 text-left font-medium">Data</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Resultado</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((i) => (
            <tr key={i.id} className={cn("border-t transition-colors hover:bg-cyan-800/5", "animate-in fade-in")}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{i.equipamento}</span>
                  <span className="text-xs text-muted-foreground">{i.normasAplicaveis}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{i.tipo}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="truncate max-w-[160px]">{i.clientName}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[160px]">{i.workLocationName}</span>
                </div>
              </td>
              <td className="px-4 py-3">{i.inspectorName}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span>{formatDate(i.dataInspecao)}</span>
                  {i.proximaInspecao && (
                    <span className="text-xs text-muted-foreground">Próx: {formatDate(i.proximaInspecao)}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={getStatusColor(i.status)}>
                  {i.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {i.resultado ? (
                  <Badge variant="outline" className={getResultColor(i.resultado)}>
                    {i.resultado}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <PersonnelActionsMenu
                    onView={() => onView(i)}
                    onEdit={() => onEdit(i)}
                    onArchive={() => onArchive(i)}
                    isArchived={i.status === "Arquivada"}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                Nenhuma inspeção encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
