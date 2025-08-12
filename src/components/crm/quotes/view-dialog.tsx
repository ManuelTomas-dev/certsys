"use client"

import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Quote } from "@/types/quotes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/mock-quotes"
import {
  Calendar,
  FileText,
  MapPin,
  User,
  Clock,
  CheckCircle,
  Paperclip,
  Building,
  CreditCard,
  Timer,
  Link,
  TrendingUp,
  DollarSign,
  Phone,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function getStatusColor(status: string) {
  switch (status) {
    case "Rascunho":
      return "border-gray-600/30 text-gray-700 bg-gray-50"
    case "Enviada":
      return "border-blue-600/30 text-blue-700 bg-blue-50"
    case "Em Revisão":
      return "border-yellow-600/30 text-yellow-700 bg-yellow-50"
    case "Aprovada":
      return "border-green-600/30 text-green-700 bg-green-50"
    case "Rejeitada":
      return "border-red-600/30 text-red-700 bg-red-50"
    case "Expirada":
      return "border-orange-600/30 text-orange-700 bg-orange-50"
    case "Arquivada":
      return "border-gray-600/30 text-gray-700 bg-gray-100"
    default:
      return "border-gray-600/30 text-gray-700 bg-gray-50"
  }
}

function getLikelihoodColor(likelihood: string) {
  switch (likelihood) {
    case "Baixa":
      return "border-red-600/30 text-red-700 bg-red-50"
    case "Média":
      return "border-yellow-600/30 text-yellow-700 bg-yellow-50"
    case "Alta":
      return "border-green-600/30 text-green-700 bg-green-50"
    case "Muito Alta":
      return "border-emerald-600/30 text-emerald-700 bg-emerald-50"
    default:
      return "border-gray-600/30 text-gray-700 bg-gray-50"
  }
}

function isExpired(dataValidade: string): boolean {
  const hoje = new Date()
  const validade = new Date(dataValidade)
  return validade < hoje
}

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  current?: Quote | null
  onPrint?: (q: Quote) => void
  onSendEmail?: (q: Quote) => void
}

export function QuoteViewDialog({
  open = false,
  onOpenChange = () => {},
  current = null,
  onPrint = () => {},
  onSendEmail = () => {},
}: Props) {
  if (!current) return null

  const expired = isExpired(current.dataValidade)
  const statusDisplay =
    expired && current.status !== "Aprovada" && current.status !== "Rejeitada" ? "Expirada" : current.status

  const primaryContact = current.clientContacts.find((c) => c.isPrimary) || current.clientContacts[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Detalhes da Cotação</DialogTitle>
          <DialogDescription>Consulta completa da proposta comercial e oportunidade.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com número e status */}
          <div className="rounded-lg border border-cyan-800/20 bg-cyan-800/5 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-cyan-800">{current.numero}</h3>
                <p className="text-sm text-muted-foreground mt-1">{current.jobTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Criada em {formatDate(current.dataCriacao)}
                  {current.dataEnvio && ` • Enviada em ${formatDate(current.dataEnvio)}`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Badge className={cn("px-3 py-1", getStatusColor(statusDisplay))}>{statusDisplay}</Badge>
                  <Badge className={cn("px-2 py-1", getLikelihoodColor(current.likelihoodOfConversion))}>
                    {current.likelihoodOfConversion}
                  </Badge>
                </div>
                <Badge variant="outline" className="border-cyan-800/30 text-cyan-800">
                  {current.currency}
                </Badge>
                {current.enquiryId && (
                  <Badge variant="outline" className="border-cyan-800/30 text-cyan-800">
                    Vinculada à Enquiry
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-cyan-800/30 text-cyan-800 hover:bg-cyan-800/10 bg-transparent"
              onClick={() => onPrint(current)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Imprimir / PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-cyan-800/30 text-cyan-800 hover:bg-cyan-800/10 bg-transparent"
              onClick={() => onSendEmail(current)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Enviar por E-mail
            </Button>
          </div>

          {/* Informações principais */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Cliente" icon={<Building className="h-4 w-4" />}>
              {current.clientName}
            </Info>
            <Info label="Local de Trabalho" icon={<MapPin className="h-4 w-4" />}>
              {current.workLocationName || "Não especificado"}
            </Info>
            <Info label="Vendedor/Responsável" icon={<User className="h-4 w-4" />}>
              {current.salesPersonName || "Não atribuído"}
            </Info>
            <Info label="Tipo de Serviço" icon={<FileText className="h-4 w-4" />}>
              <Badge className="bg-cyan-800 text-white">{current.tipoServico}</Badge>
            </Info>
          </div>

          {/* Contato Principal */}
          {primaryContact && (
            <Card className="border-cyan-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contato Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="font-medium">{primaryContact.name}</div>
                  <div className="text-sm text-muted-foreground">{primaryContact.position}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{primaryContact.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{primaryContact.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enquiry relacionada */}
          {current.enquiryId && (
            <Card className="border-cyan-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Enquiry Relacionada
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{current.enquiryTitulo}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-cyan-800 hover:bg-cyan-800/10"
                    onClick={() => {
                      console.log("Ver enquiry:", current.enquiryId)
                    }}
                  >
                    Ver Enquiry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Título e descrição */}
          <Info label="Título" icon={<FileText className="h-4 w-4" />}>
            {current.titulo}
          </Info>
          <Info label="Descrição" icon={<FileText className="h-4 w-4" />}>
            <div className="whitespace-pre-wrap text-sm">{current.descricao}</div>
          </Info>

          {/* Escopo de Trabalho */}
          <Info label="Escopo de Trabalho" icon={<FileText className="h-4 w-4" />}>
            <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-md">{current.scopeOfWork}</div>
          </Info>

          {/* Datas, prazos e probabilidade */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Info label="Data de Validade" icon={<Calendar className="h-4 w-4" />}>
              <div className="flex items-center gap-2">
                {formatDate(current.dataValidade)}
                {expired && current.status !== "Aprovada" && (
                  <Badge variant="outline" className="border-red-600/30 text-red-700">
                    Expirada
                  </Badge>
                )}
              </div>
            </Info>
            <Info label="Forma de Pagamento" icon={<CreditCard className="h-4 w-4" />}>
              {current.formaPagamento}
            </Info>
            <Info label="Prazo de Execução" icon={<Timer className="h-4 w-4" />}>
              {current.prazoExecucao}
            </Info>
            <Info label="Probabilidade" icon={<TrendingUp className="h-4 w-4" />}>
              <Badge className={getLikelihoodColor(current.likelihoodOfConversion)}>
                {current.likelihoodOfConversion}
              </Badge>
            </Info>
          </div>

          {/* Itens da cotação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-cyan-800">Itens da Cotação</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-cyan-800/5 text-cyan-800">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Descrição</th>
                      <th className="px-4 py-2 text-center font-medium">Qtd.</th>
                      <th className="px-4 py-2 text-center font-medium">Unidade</th>
                      <th className="px-4 py-2 text-right font-medium">Valor Unit.</th>
                      <th className="px-4 py-2 text-right font-medium">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.itens.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100">
                        <td className="px-4 py-2">
                          <div>
                            <div>{item.descricao}</div>
                            {item.observacao && <div className="text-xs text-muted-foreground">{item.observacao}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantidade}</td>
                        <td className="px-4 py-2 text-center">{item.unidade}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.valorUnitario, current.currency)}</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {formatCurrency(item.valorTotal, current.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Resumo financeiro */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Custo Estimado:</span>
                  <span className="text-muted-foreground">{formatCurrency(current.coast, current.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(current.subtotal, current.currency)}</span>
                </div>
                {current.descontoPercentual && current.descontoPercentual > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Desconto ({current.descontoPercentual}%):</span>
                    <span>- {formatCurrency(current.descontoValor, current.currency)}</span>
                  </div>
                )}
                {current.upliftPercentual && current.upliftPercentual > 0 && (
                  <div className="flex justify-between text-blue-700">
                    <span>Uplift ({current.upliftPercentual}%):</span>
                    <span>+ {formatCurrency(current.upliftValor, current.currency)}</span>
                  </div>
                )}
                {current.taxaPercentual && current.taxaPercentual > 0 && (
                  <div className="flex justify-between">
                    <span>Taxa ({current.taxaPercentual}%):</span>
                    <span>{formatCurrency(current.taxaValor, current.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                  <span>Valor Total:</span>
                  <span className="text-lg">{formatCurrency(current.valorTotal, current.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termos e condições */}
          {current.termos && (
            <Info label="Termos e Condições" icon={<FileText className="h-4 w-4" />}>
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-md">{current.termos}</div>
            </Info>
          )}

          {/* Observações */}
          {current.observacoes && (
            <Info label="Observações" icon={<FileText className="h-4 w-4" />}>
              <div className="whitespace-pre-wrap text-sm">{current.observacoes}</div>
            </Info>
          )}

          {/* Notas */}
          {current.notes && (
            <Info label="Notas Importantes" icon={<FileText className="h-4 w-4" />}>
              <div className="whitespace-pre-wrap text-sm bg-blue-50 p-3 rounded-md border border-blue-200">
                {current.notes}
              </div>
            </Info>
          )}

          {/* Anexos simulados */}
          {current.anexos && current.anexos > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Anexos ({current.anexos})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Proposta_Detalhada.pdf", "Especificações_Técnicas.pdf", "Termos_Contratuais.pdf"]
                    .slice(0, current.anexos)
                    .map((file, idx) => (
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
          )}

          {/* Timeline de Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline de Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 border border-gray-200">
                  <CheckCircle className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Rascunho</div>
                    <div className="text-xs text-muted-foreground">{formatDate(current.criadoEm)} - Sistema</div>
                  </div>
                </div>
                {current.dataEnvio && (
                  <div className="flex items-center gap-3 p-2 rounded-md bg-blue-50 border border-blue-200">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Enviada</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(current.dataEnvio)} - {current.salesPersonName || "Sistema"}
                      </div>
                    </div>
                  </div>
                )}
                {current.status === "Em Revisão" && (
                  <div className="flex items-center gap-3 p-2 rounded-md bg-yellow-50 border border-yellow-200">
                    <CheckCircle className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Em Revisão</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(current.atualizadoEm)} - {current.salesPersonName || "Sistema"}
                      </div>
                    </div>
                  </div>
                )}
                {current.status === "Aprovada" && current.dataAprovacao && (
                  <div className="flex items-center gap-3 p-2 rounded-md bg-green-50 border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Aprovada</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(current.dataAprovacao)} - {current.salesPersonName || "Sistema"}
                      </div>
                    </div>
                  </div>
                )}
                {current.status === "Rejeitada" && (
                  <div className="flex items-center gap-3 p-2 rounded-md bg-red-50 border border-red-200">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Rejeitada</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(current.atualizadoEm)} - {current.salesPersonName || "Sistema"}
                      </div>
                    </div>
                  </div>
                )}
                {current.status === "Arquivada" && current.arquivadoEm && (
                  <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 border border-gray-200">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Arquivada</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(current.arquivadoEm)} - {current.arquivadoPor || "Sistema"}
                      </div>
                    </div>
                  </div>
                )}
                {expired &&
                  current.status !== "Aprovada" &&
                  current.status !== "Rejeitada" &&
                  current.status !== "Arquivada" && (
                    <div className="flex items-center gap-3 p-2 rounded-md bg-orange-50 border border-orange-200">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Expirada</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(current.dataValidade)} - Sistema
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs text-muted-foreground">
            <div>Criado em: {formatDate(current.criadoEm)}</div>
            <div>Atualizado em: {formatDate(current.atualizadoEm)}</div>
          </div>
        </div>
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
