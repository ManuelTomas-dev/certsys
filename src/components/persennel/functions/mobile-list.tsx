"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
export function FuncoesMobileList({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="grid gap-3 sm:hidden">
      {rows.map((f) => (
        <Card
          key={f.id}
          className={cn(
            "border-cyan-800/10 transition-all hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{f.designacao}</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      f.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700"
                    }
                  >
                    {f.status}
                  </Badge>
                </div>
              </div>
              <PersonnelActionsMenu
                onView={() => onView(f)}
                onEdit={() => onEdit(f)}
                onArchive={() => onArchive(f)}
                isArchived={f.status === "Arquivado"}
              />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="line-clamp-3">{f.descricao}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
