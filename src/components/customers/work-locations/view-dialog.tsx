"use client"

import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { WorkLocation } from "@/types/work-locations"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/mock-work-locations"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  current?: WorkLocation | null
}
export function WorkLocationViewDialog({ open = false, onOpenChange = () => {}, current = null }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Detalhes do Local de Trabalho</DialogTitle>
          <DialogDescription>Consulta das informações cadastradas.</DialogDescription>
        </DialogHeader>
        {current && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Local">
                <div className="font-medium">{current.nome}</div>
                <div className="text-xs text-muted-foreground">{current.endereco}</div>
              </Info>
              <Info label="Cliente">{current.clientName}</Info>
              <Info label="Tipo">
                <Badge className="bg-cyan-800 text-white hover:bg-cyan-700">{current.tipo}</Badge>
              </Info>
              <Info label="Status">
                <Badge
                  variant="outline"
                  className={cn(
                    current.status === "Ativo"
                      ? "border-green-600/30 text-green-700"
                      : "border-amber-600/30 text-amber-700",
                  )}
                >
                  {current.status}
                </Badge>
              </Info>
              <Info label="Localização">
                {current.cidade}, {current.pais}
              </Info>
              <Info label="Coordenadas">
                {current.latitude}, {current.longitude}
              </Info>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Responsável">
                <div className="flex flex-col">
                  <span>{current.responsavelNome || "-"}</span>
                  <span className="text-xs text-muted-foreground">{current.responsavelTelefone || "-"}</span>
                </div>
              </Info>
              <Info label="E-mail">{current.responsavelEmail || "-"}</Info>
            </div>
            <Info label="Observações">
              <div className="whitespace-pre-wrap">{current.observacoes || "-"}</div>
            </Info>
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

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-cyan-800/10 p-3">
      <div className="text-xs font-medium text-cyan-800/90">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}
