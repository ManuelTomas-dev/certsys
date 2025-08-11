"use client"

import type { WorkLocation } from "@/types/work-locations"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"

type Props = {
  rows?: WorkLocation[]
  onView?: (w: WorkLocation) => void
  onEdit?: (w: WorkLocation) => void
  onArchive?: (w: WorkLocation) => void
}
export function WorkLocationsTable({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-cyan-800/10 sm:block">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cyan-800/5 text-cyan-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Local</th>
            <th className="px-4 py-3 text-left font-medium">Cliente</th>
            <th className="px-4 py-3 text-left font-medium">Tipo</th>
            <th className="px-4 py-3 text-left font-medium">Localização</th>
            <th className="px-4 py-3 text-left font-medium">Responsável</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Atualizado</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.id} className={cn("border-t transition-colors hover:bg-cyan-800/5", "animate-in fade-in")}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{w.nome}</span>
                  <span className="text-xs text-muted-foreground">{w.endereco}</span>
                </div>
              </td>
              <td className="px-4 py-3">{w.clientName}</td>
              <td className="px-4 py-3">
                <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{w.tipo}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span>
                    {w.cidade}, {w.pais}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {w.latitude}, {w.longitude}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span>{w.responsavelNome || "-"}</span>
                  <span className="text-xs text-muted-foreground">{w.responsavelTelefone || "-"}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={
                    w.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700"
                  }
                >
                  {w.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{new Date(w.atualizadoEm).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <PersonnelActionsMenu
                    onView={() => onView(w)}
                    onEdit={() => onEdit(w)}
                    onArchive={() => onArchive(w)}
                    isArchived={w.status === "Arquivado"}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                Nenhum local de trabalho encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
