"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  User,
  MapPin,
  ConeIcon as Crane,
  Weight,
  Ruler,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import type { LiftingOperation } from "@/types/qhse"

interface LiftingDetailsProps {
  operation: LiftingOperation
}

const statusConfig = {
  planned: { icon: Clock, color: "bg-blue-100 text-blue-800", label: "Planejada" },
  "in-progress": { icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800", label: "Em Andamento" },
  completed: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Concluída" },
  cancelled: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Cancelada" },
}

export function LiftingDetails({ operation }: LiftingDetailsProps) {
  const statusInfo = statusConfig[operation.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{operation.operationName}</h2>
          <p className="text-muted-foreground">{operation.location}</p>
        </div>
        <Badge className={statusInfo.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Basic Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da Operação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Crane className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Equipamento</p>
                <p className="text-sm text-muted-foreground">{operation.liftingEquipment}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Localização</p>
                <p className="text-sm text-muted-foreground">{operation.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Peso</p>
                <p className="text-sm text-muted-foreground">{operation.weight.toLocaleString()} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Altura</p>
                <p className="text-sm text-muted-foreground">{operation.height} m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Responsáveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Operador</p>
                <p className="text-sm text-muted-foreground">{operation.operator}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Supervisor</p>
                <p className="text-sm text-muted-foreground">{operation.supervisor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data Planejada</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(operation.plannedDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            {operation.actualDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data Real</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(operation.actualDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliação de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{operation.riskAssessment}</p>
        </CardContent>
      </Card>

      {/* Safety Measures */}
      {operation.safetyMeasures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medidas de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {operation.safetyMeasures.map((measure, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{measure}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Operação criada</p>
                <p className="text-xs text-muted-foreground">{new Date(operation.createdAt).toLocaleString("pt-BR")}</p>
              </div>
            </div>
            {operation.updatedAt !== operation.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Última atualização</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(operation.updatedAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
