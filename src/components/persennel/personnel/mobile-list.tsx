"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Personnel } from "@/types/personnel"
import { Building2, Mail, Phone, UserCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PersonnelActionsMenu } from "./actions-menu"

type Props = {
  rows?: Personnel[]
  onView?: (p: Personnel) => void
  onEdit?: (p: Personnel) => void
  onArchive?: (p: Personnel) => void
}
export function PersonnelMobileList({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  return (
    <div className="grid gap-3 sm:hidden">
      {rows.map((p) => (
        <Card
          key={p.id}
          className={cn(
            "border-cyan-800/10 transition-all hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  {p.titulo} {p.nome} {p.sobrenome}
                </CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-cyan-800/10 text-cyan-800 border border-cyan-800/20">
                    {p.funcao}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      p.status === "Ativo" ? "border-green-600/30 text-green-700" : "border-amber-600/30 text-amber-700"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
              <PersonnelActionsMenu
                onView={() => onView(p)}
                onEdit={() => onEdit(p)}
                onArchive={() => onArchive(p)}
                isArchived={p.status === "Arquivado"}
              />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-800/80" />
                <span>{p.localidade}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-cyan-800/80" />
                <span>{p.supervisor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-800/80" />
                <span className="truncate">{p.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-800/80" />
                <span>{p.telefonePessoal}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
