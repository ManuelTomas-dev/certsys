"use client"

import { Badge } from "@/components/ui/badge"
import type { Funcao } from "@/types/functions"
import { cn } from "@/lib/utils"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"

type Props = {
  rows?: Funcao[]
  onView?: (f: Funcao) => void
  onEdit?: (f: Funcao) => void
  onArchive?: (f: Funcao) => void
}
export function FuncoesTable({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-cyan-800/10 sm:block">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cyan-800/5 text-cyan-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Função</th>
            <th className="px-4 py-3 text-left font-medium">Descrição</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Atualizado</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className={cn("border-t transition-colors hover:bg-cyan-800/5", "animate-in fade-in")}>
              <td className="px-4 py-3 font-medium">{f.designacao}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <div className="line-clamp-2">{f.descricao}</div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={
                    f.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700"
                  }
                >
                  {f.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{new Date(f.atualizadoEm).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <PersonnelActionsMenu
                    onView={() => onView(f)}
                    onEdit={() => onEdit(f)}
                    onArchive={() => onArchive(f)}
                    isArchived={f.status === "Arquivado"}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                Nenhuma função encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
