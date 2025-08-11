"use client"

import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Client } from "@/types/customers"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/mock-customers"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  current?: Client | null
}
export function ClientViewDialog({ open = false, onOpenChange = () => {}, current = null }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Detalhes do Cliente</DialogTitle>
          <DialogDescription>Consulta das informações cadastrais.</DialogDescription>
        </DialogHeader>
        {current && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Cliente">
                <div className="font-medium">{current.nome}</div>
                <div className="text-xs text-muted-foreground">NIF {current.nif}</div>
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
              <Info label="Contato">
                <div className="flex flex-col">
                  <span>{current.email}</span>
                  <span className="text-xs text-muted-foreground">{current.telefone}</span>
                </div>
              </Info>
              <Info label="Website">{current.website || "-"}</Info>
              <Info label="Local">
                {current.cidade}, {current.pais}
              </Info>
              <Info label="Segmento">{current.segmento || "-"}</Info>
            </div>
            <Info label="Endereço">{current.endereco}</Info>
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
