"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Wrench, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import type { InspectionRecord } from "@/types/qhse"

interface InspectionDetailsProps {
  inspection: InspectionRecord
}

const statusConfig = {
  pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
  "in-progress": { icon: AlertCircle, color: "bg-blue-100 text-blue-800", label: "Em Andamento" },
  completed: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Concluída" },
  failed: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Falhou" },
}

const typeLabels = {
  routine: "Rotina",
  preventive: "Preventiva",
  corrective: "Corretiva",
}

export function InspectionDetails({ inspection }: InspectionDetailsProps) {
  const statusInfo = statusConfig[inspection.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{inspection.equipmentName}</h2>
          <p className="text-muted-foreground">ID: {inspection.equipmentId}</p>
        </div>
        <Badge className={statusInfo.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Tipo de Inspeção</p>
                <p className="text-sm text-muted-foreground">{typeLabels[inspection.inspectionType]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Inspetor</p>
                <p className="text-sm text-muted-foreground">{inspection.inspector}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data da Inspeção</p>
                <p className="text-sm text-muted-foreground">{new Date(inspection.date).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            {inspection.nextInspectionDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Próxima Inspeção</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(inspection.nextInspectionDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Findings */}
      {inspection.findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Constatações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inspection.findings.map((finding, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{finding}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {inspection.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inspection.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{recommendation}</p>
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
                <p className="text-sm font-medium">Inspeção criada</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(inspection.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
            {inspection.updatedAt !== inspection.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Última atualização</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(inspection.updatedAt).toLocaleString("pt-BR")}
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
