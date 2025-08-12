"use client"

import type { Enquiry } from "@/types/enquiries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PersonnelActionsMenu } from "@/components/persennel/personnel/actions-menu"
import { cn } from "@/lib/utils"
import { formatDate, formatCurrency } from "@/lib/mock-enquiries"
import { Calendar, DollarSign, Building, Phone, MapPin, CheckCircle, X, Percent } from "lucide-react"

function getStatusColor(status: string) {
  switch (status) {
    case "Nova":
      return "border-blue-600/30 text-blue-700"
    case "Em Análise":
      return "border-yellow-600/30 text-yellow-700"
    case "Cotação Enviada":
      return "border-purple-600/30 text-purple-700"
    case "Aprovada":
      return "border-green-600/30 text-green-700"
    case "Convertida":
      return "border-emerald-600/30 text-emerald-700 bg-emerald-50"
    case "Fechada":
      return "border-gray-600/30 text-gray-700"
    case "Rejeitada":
      return "border-red-600/30 text-red-700"
    case "Arquivada":
      return "border-gray-600/30 text-gray-700"
    default:
      return "border-gray-600/30 text-gray-700"
  }
}

function getProbabilityColor(probabilidade: number) {
  if (probabilidade >= 80) return "border-green-600/30 text-green-700 bg-green-50"
  if (probabilidade >= 60) return "border-blue-600/30 text-blue-700 bg-blue-50"
  if (probabilidade >= 40) return "border-yellow-600/30 text-yellow-700 bg-yellow-50"
  if (probabilidade >= 20) return "border-orange-600/30 text-orange-700 bg-orange-50"
  return "border-red-600/30 text-red-700 bg-red-50"
}

type Props = {
  rows?: Enquiry[]
  onView?: (e: Enquiry) => void
  onEdit?: (e: Enquiry) => void
  onArchive?: (e: Enquiry) => void
  onConvert?: (e: Enquiry) => void
  onClose?: (e: Enquiry) => void
}

export function EnquiriesMobileList({
  rows = [],
  onView = () => {},
  onEdit = () => {},
  onArchive = () => {},
  onConvert = () => {},
  onClose = () => {},
}: Props) {
  return (
    <div className="grid gap-3 sm:hidden">
      {rows.map((e) => (
        <Card
          key={e.id}
          className={cn(
            "border-cyan-800/10 transition-all hover:shadow-md",
            "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{e.titulo}</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {e.origem}
                  </Badge>
                  <Badge variant="outline" className={getProbabilityColor(e.probabilidade)}>
                    <Percent className="h-3 w-3 mr-1" />
                    {e.probabilidade}%
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(e.status)}>
                    {e.status}
                  </Badge>
                </div>
              </div>
              <PersonnelActionsMenu
                onView={() => onView(e)}
                onEdit={() => onEdit(e)}
                onArchive={() => onArchive(e)}
                isArchived={e.status === "Arquivada"}
              />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-cyan-800/80" />
                <span className="truncate">{e.nomeCliente}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-800/80" />
                <span className="truncate">{e.localizacaoCliente}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-800/80" />
                <span className="truncate">{e.contactoCliente}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-800/80" />
                <span>{formatDate(e.data)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-cyan-800/80" />
                <span>{formatCurrency(e.valorEstimado)}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-3">
              <span className="font-medium">Equipa:</span> {e.equipaVenda}
            </div>

            {/* Botões de ação rápida */}
            <div className="flex gap-2">
              {e.status === "Aprovada" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onConvert(e)}
                  className="flex-1 h-8 text-xs text-green-700 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Converter
                </Button>
              )}
              {(e.status === "Rejeitada" || e.status === "Em Análise") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClose(e)}
                  className="flex-1 h-8 text-xs text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  <X className="h-3 w-3 mr-1" />
                  Fechar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
