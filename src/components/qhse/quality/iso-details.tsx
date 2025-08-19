"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  User,
  Building,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
} from "lucide-react"
import type { ISODocument } from "@/types/qhse"

interface ISODetailsProps {
  document: ISODocument
}

const statusConfig = {
  draft: { icon: Clock, color: "bg-gray-100 text-gray-800", label: "Rascunho" },
  "under-review": { icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800", label: "Em Revisão" },
  approved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Aprovado" },
  obsolete: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Obsoleto" },
}

const categoryLabels = {
  procedure: "Procedimento",
  policy: "Política",
  form: "Formulário",
  manual: "Manual",
}

export function ISODetails({ document }: ISODetailsProps) {
  const statusInfo = statusConfig[document.status]
  const StatusIcon = statusInfo.icon

  const isExpiringSoon = () => {
    const reviewDate = new Date(document.reviewDate)
    const today = new Date()
    const daysUntilReview = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysUntilReview <= 30 && daysUntilReview > 0
  }

  const isOverdue = () => {
    const reviewDate = new Date(document.reviewDate)
    const today = new Date()
    return reviewDate < today
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{document.title}</h2>
          <p className="text-muted-foreground">
            {document.documentNumber} - Versão {document.version}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusInfo.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
          {isOverdue() && <Badge className="bg-red-100 text-red-800">Vencido</Badge>}
          {isExpiringSoon() && <Badge className="bg-orange-100 text-orange-800">Expira em breve</Badge>}
        </div>
      </div>

      {/* Document Actions */}
      <div className="flex gap-2">
        <Button className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Visualizar
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      {/* Basic Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Categoria</p>
                <p className="text-sm text-muted-foreground">{categoryLabels[document.category]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Departamento</p>
                <p className="text-sm text-muted-foreground">{document.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Responsável</p>
                <p className="text-sm text-muted-foreground">{document.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Aprovador</p>
                <p className="text-sm text-muted-foreground">{document.approver}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datas Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data de Vigência</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(document.effectiveDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar
                className={`h-4 w-4 ${isOverdue() ? "text-red-500" : isExpiringSoon() ? "text-orange-500" : "text-muted-foreground"}`}
              />
              <div>
                <p className="text-sm font-medium">Data de Revisão</p>
                <p
                  className={`text-sm ${isOverdue() ? "text-red-600" : isExpiringSoon() ? "text-orange-600" : "text-muted-foreground"}`}
                >
                  {new Date(document.reviewDate).toLocaleDateString("pt-BR")}
                  {isOverdue() && " (Vencido)"}
                  {isExpiringSoon() && " (Expira em breve)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Criado em</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(document.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(document.updatedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Information */}
      {document.filePath && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Arquivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{document.filePath}</p>
                  <p className="text-sm text-muted-foreground">Documento PDF</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Versões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Versão {document.version} (Atual)</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(document.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Aprovado por {document.approver}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg opacity-60">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Versão 1.0</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(document.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Versão inicial</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
