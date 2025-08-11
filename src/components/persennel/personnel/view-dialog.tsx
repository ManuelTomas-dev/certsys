"use client"

import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Personnel } from "@/types/personnel"
import { cn } from "@/lib/utils"
import { Mail } from "lucide-react"
import { formatDate } from "@/lib/mock-personnel"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  current?: Personnel | null
}
export function PersonnelViewDialog({ open = false, onOpenChange = () => {}, current = null }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Detalhes do Pessoal</DialogTitle>
          <DialogDescription>Consulta rápida das informações do colaborador.</DialogDescription>
        </DialogHeader>
        {current && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Nome">
                {current.titulo} {current.nome} {current.sobrenome}
              </InfoRow>
              <InfoRow label="Função">{current.funcao}</InfoRow>
              <InfoRow label="Supervisor">{current.supervisor}</InfoRow>
              <InfoRow label="Localidade">{current.localidade}</InfoRow>
              <InfoRow label="Nível de Acesso">{current.nivelAcesso}</InfoRow>
              <InfoRow label="Status">
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
              </InfoRow>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Data de Nascimento">{formatDate(current.dataNascimento)}</InfoRow>
              <InfoRow label="Local de Nascimento">{current.localNascimento}</InfoRow>
              <InfoRow label="BI/Passaporte">{current.biNumero}</InfoRow>
              <InfoRow label="Validade do Documento">{formatDate(current.validadeDocumento)}</InfoRow>
              <InfoRow label="INSS">{current.inss}</InfoRow>
              <InfoRow label="Criado em">{formatDate(current.criadoEm)}</InfoRow>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Nome do Pai">{current.nomePai}</InfoRow>
              <InfoRow label="Nome da Mãe">{current.nomeMae}</InfoRow>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="E-mail">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-800/80" />
                  {current.email}
                </span>
              </InfoRow>
              <InfoRow label="Telefones">
                <span className="flex flex-col">
                  <span>Pessoal: {current.telefonePessoal}</span>
                  <span>Trabalho: {current.telefoneTrabalho}</span>
                </span>
              </InfoRow>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function InfoRow(props: { label: string; children: React.ReactNode }) {
  const { label, children } = props
  return (
    <div className="rounded-md border border-cyan-800/10 p-3">
      <div className="text-xs font-medium text-cyan-800/90">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}
