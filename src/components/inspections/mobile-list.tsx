"use client"

import type { Inspection } from "@/types/inspections"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/mock-inspections"
import { Calendar, MapPin, User, FileText } from "lucide-react"

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

type Props = {
  rows?: Inspection[]
  onView?: (i: Inspection) => void
  onEdit?: (i: Inspection) => void
  onArchive?: (i: Inspection) => void
}

export function InspectionsMobileList({
  rows = [],
  onView = () => {},
  onEdit = () => {},
  onArchive = () => {},
}: Props) {
  return (
    <div className="grid gap-3 sm:hidden">
      {rows.map((i) => (
        <Card
          key={i.id}
          className={cn(
            "border-cyan-800/10 transition-all hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{i.equipamento}</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{i.tipo}</Badge>
                  <Badge variant="outline" className={getStatusColor(i.status)}>
                    {i.status}
                  </Badge>
                </div>
              </div>
              <PersonnelActionsMenu
                onView={() => onView(i)}
                onEdit={() => onEdit(i)}
                onArchive={() => onArchive(i)}
                isArchived={i.status === "Arquivada"}
              />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-800/80" />
                <span>{formatDate(i.dataInspecao)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-800/80" />
                <span className="truncate">{i.inspectorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-800/80" />
                <span className="truncate">{i.workLocationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-800/80" />
                <span className="truncate">{i.normasAplicaveis}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
