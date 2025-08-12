"use client"

import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Inspection } from "@/types/inspections"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/mock-inspections"
import { Calendar, FileText, MapPin, User, Wrench, AlertTriangle } from "lucide-react"

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

function getResultColor(resultado?: string) {
  switch (resultado) {
    case "Conforme":
      return "border-green-600/30 text-green-700"
    case "Não Conforme":
      return "border-red-600/30 text-red-700"
    case "Condicional":
      return "border-yellow-600/30 text-yellow-700"
    default:
      return "border-gray-600/30 text-gray-700"
  }
}

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  current?: Inspection | null
}

export function InspectionViewDialog({ open = false, onOpenChange = () => {}, current = null }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Detalhes da Inspeção</DialogTitle>
          <DialogDescription>Consulta completa das informações da inspeção.</DialogDescription>
        </DialogHeader>
        {current && (
          <div className="space-y-6">
            {/* Header com equipamento e status */}
            <div className="rounded-lg border border-cyan-800/20 bg-cyan-800/5 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-800">{current.equipamento}</h3>
                  <p className="text-sm text-muted-foreground">Inspeção {current.tipo}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className={getStatusColor(current.status)}>
                    {current.status}
                  </Badge>
                  {current.resultado && (
                    <Badge variant="outline" className={getResultColor(current.resultado)}>
                      {current.resultado}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Informações principais */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Cliente" icon={<User className="h-4 w-4" />}>
                {current.clientName}
              </Info>
              <Info label="Local de Trabalho" icon={<MapPin className="h-4 w-4" />}>
                {current.workLocationName}
              </Info>
              <Info label="Inspetor" icon={<User className="h-4 w-4" />}>
                {current.inspectorName}
              </Info>
              <Info label="Tipo de Inspeção" icon={<Wrench className="h-4 w-4" />}>
                {current.tipo}
              </Info>
            </div>

            {/* Datas */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Info label="Data da Inspeção" icon={<Calendar className="h-4 w-4" />}>
                {formatDate(current.dataInspecao)}
              </Info>
              <Info label="Próxima Inspeção" icon={<Calendar className="h-4 w-4" />}>
                {current.proximaInspecao ? formatDate(current.proximaInspecao) : "-"}
              </Info>
              <Info label="Anexos" icon={<FileText className="h-4 w-4" />}>
                {current.anexos || 0} arquivo{(current.anexos || 0) === 1 ? "" : "s"}
              </Info>
            </div>

            {/* Normas e resultado */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Normas Aplicáveis" icon={<FileText className="h-4 w-4" />}>
                {current.normasAplicaveis}
              </Info>
              {current.resultado && (
                <Info label="Resultado da Inspeção" icon={<AlertTriangle className="h-4 w-4" />}>
                  <Badge variant="outline" className={getResultColor(current.resultado)}>
                    {current.resultado}
                  </Badge>
                </Info>
              )}
            </div>

            {/* Observações */}
            {current.observacoes && (
              <Info label="Observações" icon={<FileText className="h-4 w-4" />}>
                <div className="whitespace-pre-wrap text-sm">{current.observacoes}</div>
              </Info>
            )}

            {/* Metadados */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Criado em">{formatDate(current.criadoEm)}</Info>
              <Info label="Atualizado em">{formatDate(current.atualizadoEm)}</Info>
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
