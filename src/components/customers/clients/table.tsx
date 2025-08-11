"use client"

import type { Client } from "@/types/customers"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"

type Props = {
  rows?: Client[]
  onView?: (c: Client) => void
  onEdit?: (c: Client) => void
  onArchive?: (c: Client) => void
}
export function ClientsTable({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-cyan-800/10 sm:block">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cyan-800/5 text-cyan-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Cliente</th>
            <th className="px-4 py-3 text-left font-medium">Contacto</th>
            <th className="px-4 py-3 text-left font-medium">Local</th>
            <th className="px-4 py-3 text-left font-medium">Segmento</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Atualizado</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className={cn("border-t transition-colors hover:bg-cyan-800/5", "animate-in fade-in")}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{c.nome}</span>
                  <span className="text-xs text-muted-foreground">NIF {c.nif}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="truncate max-w-[240px]">{c.email}</span>
                  <span className="text-xs text-muted-foreground">{c.telefone}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span>{c.cidade}</span>
                  <span className="text-xs text-muted-foreground">{c.pais}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {c.segmento ? (
                  <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{c.segmento}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={
                    c.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700"
                  }
                >
                  {c.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{new Date(c.atualizadoEm).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <PersonnelActionsMenu
                    onView={() => onView(c)}
                    onEdit={() => onEdit(c)}
                    onArchive={() => onArchive(c)}
                    isArchived={c.status === "Arquivado"}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
