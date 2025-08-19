"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  User,
  Building,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Star,
  Truck,
  Headphones,
} from "lucide-react"
import type { SQMRecord } from "@/types/qhse"

interface SQMDetailsProps {
  record: SQMRecord
}

const statusConfig = {
  approved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Aprovado" },
  conditional: { icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800", label: "Condicional" },
  rejected: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Rejeitado" },
  "under-review": { icon: Clock, color: "bg-blue-100 text-blue-800", label: "Em Revisão" },
}

export function SQMDetails({ record }: SQMDetailsProps) {
  const statusInfo = statusConfig[record.status]
  const StatusIcon = statusInfo.icon

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const isEvaluationDue = () => {
    const nextEvalDate = new Date(record.nextEvaluationDate)
    const today = new Date()
    const daysUntilEval = Math.ceil((nextEvalDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysUntilEval <= 30 && daysUntilEval > 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{record.supplierName}</h2>
          <p className="text-muted-foreground">
            {record.supplierCode} - {record.category}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusInfo.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
          {isEvaluationDue() && <Badge className="bg-orange-100 text-orange-800">Avaliação próxima</Badge>}
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pontuação Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold">{record.overallScore}</span>
            <span className={`text-lg font-semibold ${getScoreColor(record.overallScore)}`}>
              {record.overallScore >= 80 ? "Excelente" : record.overallScore >= 60 ? "Bom" : "Precisa Melhorar"}
            </span>
          </div>
          <Progress value={record.overallScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base">Qualidade</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getScoreColor(record.qualityScore)}`}>{record.qualityScore}</span>
            </div>
            <Progress value={record.qualityScore} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base">Entrega</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getScoreColor(record.deliveryScore)}`}>
                {record.deliveryScore}
              </span>
            </div>
            <Progress value={record.deliveryScore} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">Atendimento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getScoreColor(record.serviceScore)}`}>{record.serviceScore}</span>
            </div>
            <Progress value={record.serviceScore} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Basic Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Avaliador</p>
                <p className="text-sm text-muted-foreground">{record.evaluator}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Categoria</p>
                <p className="text-sm text-muted-foreground">{record.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data da Avaliação</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(record.evaluationDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className={`h-4 w-4 ${isEvaluationDue() ? "text-orange-500" : "text-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium">Próxima Avaliação</p>
                <p className={`text-sm ${isEvaluationDue() ? "text-orange-600" : "text-muted-foreground"}`}>
                  {new Date(record.nextEvaluationDate).toLocaleDateString("pt-BR")}
                  {isEvaluationDue() && " (Em breve)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Criado em</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(record.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(record.updatedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comentários</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{record.comments}</p>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {record.qualityScore < 80 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Melhoria na Qualidade</p>
                  <p className="text-sm text-yellow-700">
                    Implementar controles de qualidade mais rigorosos e treinamento adicional.
                  </p>
                </div>
              </div>
            )}
            {record.deliveryScore < 80 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Truck className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Melhoria na Entrega</p>
                  <p className="text-sm text-orange-700">
                    Revisar cronogramas de entrega e implementar sistema de rastreamento.
                  </p>
                </div>
              </div>
            )}
            {record.serviceScore < 80 && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Headphones className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Melhoria no Atendimento</p>
                  <p className="text-sm text-purple-700">
                    Treinamento da equipe de atendimento e melhoria nos canais de comunicação.
                  </p>
                </div>
              </div>
            )}
            {record.overallScore >= 80 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Excelente Desempenho</p>
                  <p className="text-sm text-green-700">
                    Fornecedor mantém padrões elevados. Considerar parcerias estratégicas.
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
