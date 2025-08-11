"use client"

import { Badge } from "@/components/ui/badge"
import type { Personnel } from "@/types/personnel"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { PersonnelActionsMenu } from "./actions-menu"

type Props = {
  rows?: Personnel[]
  onView?: (p: Personnel) => void
  onEdit?: (p: Personnel) => void
  onArchive?: (p: Personnel) => void
}
export function PersonnelTable({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-cyan-800/10 sm:block">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cyan-800/5 text-cyan-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Nome</th>
            <th className="px-4 py-3 text-left font-medium">Função</th>
            <th className="px-4 py-3 text-left font-medium">Supervisor</th>
            <th className="px-4 py-3 text-left font-medium">Localidade</th>
            <th className="px-4 py-3 text-left font-medium">Acesso</th>
            <th className="px-4 py-3 text-left font-medium">Contato</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className={cn("border-t transition-colors hover:bg-cyan-800/5", "animate-in fade-in")}>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {p.titulo} {p.nome} {p.sobrenome}
                  </span>
                  <span className="text-xs text-muted-foreground">BI {p.biNumero}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{p.funcao}</Badge>
              </td>
              <td className="px-4 py-3">{p.supervisor}</td>
              <td className="px-4 py-3">{p.localidade}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-cyan-800" />
                  <span>{p.nivelAcesso}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="truncate max-w-[220px]">{p.email}</span>
                  <span className="text-xs text-muted-foreground">{p.telefonePessoal}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-1 text-xs",
                    p.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700",
                  )}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <PersonnelActionsMenu
                    onView={() => onView(p)}
                    onEdit={() => onEdit(p)}
                    onArchive={() => onArchive(p)}
                    isArchived={p.status === "Arquivado"}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                Nenhum resultado encontrado com os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
