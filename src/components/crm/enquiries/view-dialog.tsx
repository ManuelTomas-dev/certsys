"use client"

import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Enquiry } from "@/types/enquiries"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/mock-enquiries"
import {
  Calendar,
  FileText,
  MapPin,
  User,
  DollarSign,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle,
  Paperclip,
  Phone,
  Building,
  Users,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"

function getStatusColor(status: string) {
  switch (status) {
    case "Nova":
      return "border-blue-600/30 text-blue-700 bg-blue-50"
    case "Em Análise":
      return "border-yellow-600/30 text-yellow-700 bg-yellow-50"
    case "Cotação Enviada":
      return "border-purple-600/30 text-purple-700 bg-purple-50"
    case "Aprovada":
      return "border-green-600/30 text-green-700 bg-green-50"
    case "Convertida":
      return "border-emerald-600/30 text-emerald-700 bg-emerald-50"
    case "Fechada":
      return "border-gray-600/30 text-gray-700 bg-gray-50"
    case "Rejeitada":
      return "border-red-600/30 text-red-700 bg-red-50"
    case "Arquivada":
      return "border-gray-600/30 text-gray-700 bg-gray-50"
    default:
      return "border-gray-600/30 text-gray-700 bg-gray-50"
  }
}

function getProbabilityColor(probabilidade: number) {
  if (probabilidade >= 80) return "border-green-600/30 text-green-700 bg-green-50"
  if (probabilidade >= 60) return "border-blue-600/30 text-blue-700 bg-blue-50"
  if (probabilidade >= 40) return "border-yellow-600/30 text-yellow-700 bg-yellow-50"
  if (probabilidade >= 20) return "border-orange-600/30 text-orange-700 bg-orange-50"
  return "border-red-600/30 text-red-700 bg-red-50"
}

function getSLAStatus(dataLimite?: string) {
  if (!dataLimite) return null

  const hoje = new Date()
  const limite = new Date(dataLimite)
  const diffDays = Math.ceil((limite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { status: "Vencido", color: "text-red-700 bg-red-50 border-red-200", days: Math.abs(diffDays) }
  } else if (diffDays <= 3) {
    return { status: "Próximo do Vencimento", color: "text-orange-700 bg-orange-50 border-orange-200", days: diffDays }
  } else {
    return { status: "Em Dia", color: "text-green-700 bg-green-50 border-green-200", days: diffDays }
  }
}

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  current?: Enquiry | null
}

export function EnquiryViewDialog({ open = false, onOpenChange = () => {}, current = null }: Props) {
  const slaInfo = current?.dataLimite ? getSLAStatus(current.dataLimite) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Detalhes da Enquiry</DialogTitle>
          <DialogDescription>Consulta completa da solicitação de serviço.</DialogDescription>
        </DialogHeader>
        {current && (
          <div className="space-y-6">
            {/* Header com título e status */}
            <div className="rounded-lg border border-cyan-800/20 bg-cyan-800/5 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-800">{current.titulo}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Criada em {formatDate(current.data)} • Origem: {current.origem}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={cn("px-3 py-1", getStatusColor(current.status))}>{current.status}</Badge>
                  <Badge className={cn("px-3 py-1", getProbabilityColor(current.probabilidade))}>
                    <Percent className="h-3 w-3 mr-1" />
                    {current.probabilidade}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* SLA Status */}
            {slaInfo && (
              <Card className={cn("border-2", slaInfo.color)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Status do Prazo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{slaInfo.status}</span>
                    <span className="text-sm">
                      {slaInfo.status === "Vencido"
                        ? `${slaInfo.days} dias em atraso`
                        : `${slaInfo.days} dias restantes`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Info label="Nome do Cliente" icon={<User className="h-4 w-4" />}>
                    {current.nomeCliente}
                  </Info>
                  <Info label="Localização" icon={<MapPin className="h-4 w-4" />}>
                    {current.localizacaoCliente}
                  </Info>
                  <Info label="Contacto" icon={<Phone className="h-4 w-4" />}>
                    {current.contactoCliente}
                  </Info>
                  <Info label="Equipa de Venda" icon={<Users className="h-4 w-4" />}>
                    {current.equipaVenda}
                  </Info>
                </div>
              </CardContent>
            </Card>

            {/* Detalhes da Enquiry */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Tipo de Serviço" icon={<FileText className="h-4 w-4" />}>
                <Badge className="bg-cyan-800 text-white">{current.tipoServico}</Badge>
              </Info>
              <Info label="Prioridade" icon={<AlertTriangle className="h-4 w-4" />}>
                <Badge
                  variant="outline"
                  className={
                    current.prioridade === "Crítica"
                      ? "border-red-600/30 text-red-700"
                      : current.prioridade === "Alta"
                        ? "border-orange-600/30 text-orange-700"
                        : current.prioridade === "Média"
                          ? "border-yellow-600/30 text-yellow-700"
                          : "border-green-600/30 text-green-700"
                  }
                >
                  {current.prioridade}
                </Badge>
              </Info>
              <Info label="Responsável" icon={<User className="h-4 w-4" />}>
                {current.responsavelName || "Não atribuído"}
              </Info>
              <Info label="Valor Estimado" icon={<DollarSign className="h-4 w-4" />}>
                {formatCurrency(current.valorEstimado)}
              </Info>
            </div>

            {/* Descrição */}
            <Info label="Descrição da Enquiry" icon={<FileText className="h-4 w-4" />}>
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-md">{current.descricao}</div>
            </Info>

            {/* Datas */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Data da Enquiry" icon={<Calendar className="h-4 w-4" />}>
                {formatDate(current.data)}
              </Info>
              <Info label="Data Limite" icon={<AlertTriangle className="h-4 w-4" />}>
                {current.dataLimite ? formatDate(current.dataLimite) : "Não definida"}
              </Info>
            </div>

            {/* Timeline de Status (simulado) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Timeline de Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-md bg-green-50 border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Nova</div>
                      <div className="text-xs text-muted-foreground">{formatDate(current.criadoEm)} - Sistema</div>
                    </div>
                  </div>
                  {current.status !== "Nova" && (
                    <div className="flex items-center gap-3 p-2 rounded-md bg-blue-50 border border-blue-200">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{current.status}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(current.atualizadoEm)} - {current.responsavelName || "Sistema"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Anexos simulados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Anexos ({Math.floor(Math.random() * 4)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Especificação_Técnica.pdf", "Proposta_Comercial.docx"].map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 border">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{file}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {(Math.random() * 2 + 0.5).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notas */}
            {current.notas && (
              <Info label="Notas Internas" icon={<FileText className="h-4 w-4" />}>
                <div className="whitespace-pre-wrap text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  {current.notas}
                </div>
              </Info>
            )}

            {/* Observações */}
            {current.observacoes && (
              <Info label="Observações" icon={<FileText className="h-4 w-4" />}>
                <div className="whitespace-pre-wrap text-sm bg-blue-50 p-3 rounded-md border border-blue-200">
                  {current.observacoes}
                </div>
              </Info>
            )}

            {/* Metadados */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-muted-foreground">
              <div>Criado em: {formatDate(current.criadoEm)}</div>
              <div>Atualizado em: {formatDate(current.atualizadoEm)}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Info({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-cyan-800/10 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-800/90 mb-1">
        {icon && <span className="text-cyan-800/70">{icon}</span>}
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  )
}
