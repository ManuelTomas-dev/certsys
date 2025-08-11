"use client"

import type { WorkLocation } from "@/types/work-locations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"

type Props = {
  rows?: WorkLocation[]
  onView?: (w: WorkLocation) => void
  onEdit?: (w: WorkLocation) => void
  onArchive?: (w: WorkLocation) => void
}
export function WorkLocationsMobileList({
  rows = [],
  onView = () => {},
  onEdit = () => {},
  onArchive = () => {},
}: Props) {
  return (
    <div className="grid gap-3 sm:hidden">
      {rows.map((w) => (
        <Card
          key={w.id}
          className={cn(
            "border-cyan-800/10 transition-all hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{w.nome}</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{w.tipo}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      w.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700"
                    }
                  >
                    {w.status}
                  </Badge>
                </div>
              </div>
              <PersonnelActionsMenu
                onView={() => onView(w)}
                onEdit={() => onEdit(w)}
                onArchive={() => onArchive(w)}
                isArchived={w.status === "Arquivado"}
              />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs">Cliente</div>
                <div className="truncate">{w.clientName}</div>
              </div>
              <div>
                <div className="text-xs">Local</div>
                <div>
                  {w.cidade}, {w.pais}
                </div>
              </div>
              <div>
                <div className="text-xs">Coordenadas</div>
                <div>
                  {w.latitude}, {w.longitude}
                </div>
              </div>
              <div>
                <div className="text-xs">Responsável</div>
                <div className="truncate">{w.responsavelNome || "-"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
