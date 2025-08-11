"use client"

import type { Client } from "@/types/customers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"

type Props = {
  rows?: Client[]
  onView?: (c: Client) => void
  onEdit?: (c: Client) => void
  onArchive?: (c: Client) => void
}
export function ClientsMobileList({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="grid gap-3 sm:hidden">
      {rows.map((c) => (
        <Card
          key={c.id}
          className={cn(
            "border-cyan-800/10 transition-all hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{c.nome}</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      c.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700"
                    }
                  >
                    {c.status}
                  </Badge>
                  {c.segmento && (
                    <Badge variant="secondary" className="bg-cyan-800/10 text-cyan-800 border border-cyan-800/20">
                      {c.segmento}
                    </Badge>
                  )}
                </div>
              </div>
              <PersonnelActionsMenu
                onView={() => onView(c)}
                onEdit={() => onEdit(c)}
                onArchive={() => onArchive(c)}
                isArchived={c.status === "Arquivado"}
              />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs">E-mail</div>
                <div className="truncate">{c.email}</div>
              </div>
              <div>
                <div className="text-xs">Telefone</div>
                <div>{c.telefone}</div>
              </div>
              <div>
                <div className="text-xs">Local</div>
                <div>
                  {c.cidade}, {c.pais}
                </div>
              </div>
              <div>
                <div className="text-xs">Website</div>
                <div className="truncate">{c.website || "-"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
