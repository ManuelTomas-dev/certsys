"use client"

import type { Quote } from "@/types/quotes"
import { Badge } from "@/components/ui/badge"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"
import { formatDate, formatCurrency } from "@/lib/mock-quotes"
import { Building, MapPin, User, Calendar, DollarSign, TrendingUp, FileText, Phone, Mail } from "lucide-react"

type Props = {
  rows?: Quote[]
  onView?: (q: Quote) => void
  onEdit?: (q: Quote) => void
  onArchive?: (q: Quote) => void
}

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

export function QuotesMobileList({ rows = [], onView = () => {}, onEdit = () => {}, onArchive = () => {} }: Props) {
  if (rows.length === 0) {
    return (
      <div className="block rounded-lg border border-cyan-800/10 p-8 text-center sm:hidden">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Nenhuma cotação encontrada.</p>
      </div>
    )
  }

  return (
    <div className="block space-y-3 sm:hidden">
      {rows.map((quote) => {
        const primaryContact = quote.clientContacts.find((c) => c.isPrimary) || quote.clientContacts[0]

        return (
          <div
            key={quote.id}
            className={cn(
              "rounded-lg border border-cyan-800/10 bg-white p-4 shadow-sm transition-all",
              "animate-in fade-in slide-in-from-bottom-2",
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-cyan-800">{quote.numero}</span>
                  <Badge className={cn("text-xs", getStatusColor(quote.status))}>{quote.status}</Badge>
                </div>
                <h3 className="font-medium text-sm line-clamp-2">{quote.titulo}</h3>
                <p className="text-xs text-muted-foreground mt-1">{quote.jobTitle}</p>
              </div>
              <PersonnelActionsMenu
                onView={() => onView(quote)}
                onEdit={() => onEdit(quote)}
                onArchive={() => onArchive(quote)}
                isArchived={quote.status === "Arquivada"}
              />
            </div>

            {/* Cliente e Localização */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{quote.clientName}</span>
              </div>
              {quote.workLocationName && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate text-muted-foreground">{quote.workLocationName}</span>
                </div>
              )}
              {quote.salesPersonName && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate text-muted-foreground">{quote.salesPersonName}</span>
                </div>
              )}
            </div>

            {/* Contato Principal */}
            {primaryContact && (
              <div className="bg-gray-50 rounded-md p-2 mb-3">
                <div className="text-xs font-medium text-gray-700 mb-1">Contato Principal</div>
                <div className="text-sm font-medium">{primaryContact.name}</div>
                <div className="text-xs text-muted-foreground">{primaryContact.position}</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">{primaryContact.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{primaryContact.phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Valor e Probabilidade */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-semibold text-sm">{formatCurrency(quote.valorTotal, quote.currency)}</div>
                  <div className="text-xs text-muted-foreground">
                    Custo: {formatCurrency(quote.coast, quote.currency)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <Badge className={cn("text-xs", getLikelihoodColor(quote.likelihoodOfConversion))}>
                  {quote.likelihoodOfConversion}
                </Badge>
              </div>
            </div>

            {/* Datas */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Criada: {formatDate(quote.dataCriacao)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Validade: {formatDate(quote.dataValidade)}</span>
              </div>
            </div>

            {/* Tipo de Serviço e Moeda */}
            <div className="flex items-center justify-between mt-2">
              <Badge className="bg-cyan-800 text-white text-xs">{quote.tipoServico}</Badge>
              <Badge variant="outline" className="text-xs">
                {quote.currency}
              </Badge>
            </div>

            {/* Escopo (resumido) */}
            {quote.scopeOfWork && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <div className="text-xs font-medium text-gray-700 mb-1">Escopo</div>
                <p className="text-xs text-muted-foreground line-clamp-2">{quote.scopeOfWork}</p>
              </div>
            )}

            {/* Notas */}
            {quote.notes && (
              <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="text-xs font-medium text-blue-700 mb-1">Notas</div>
                <p className="text-xs text-blue-600 line-clamp-2">{quote.notes}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
