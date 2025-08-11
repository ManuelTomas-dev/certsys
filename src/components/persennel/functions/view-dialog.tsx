"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Funcao } from "@/types/functions"
import { formatDate } from "@/lib/mock-functions"
import { cn } from "@/lib/utils"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  current?: Funcao | null
}
export function FuncaoViewDialog({ open = false, onOpenChange = () => {}, current = null }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Detalhes da Função</DialogTitle>
          <DialogDescription>Consulta das informações cadastradas da função.</DialogDescription>
        </DialogHeader>
        {current && (
          <div className="space-y-4">
            <div className="rounded-md border border-cyan-800/10 p-3">
              <div className="text-xs font-medium text-cyan-800/90">Designação</div>
              <div className="mt-1 text-sm font-medium">{current.designacao}</div>
            </div>
            <div className="rounded-md border border-cyan-800/10 p-3">
              <div className="text-xs font-medium text-cyan-800/90">Descrição</div>
              <div className="mt-1 text-sm whitespace-pre-wrap">{current.descricao}</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-cyan-800/10 p-3">
                <div className="text-xs font-medium text-cyan-800/90">Status</div>
                <div className="mt-1 text-sm">
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
                </div>
              </div>
              <div className="rounded-md border border-cyan-800/10 p-3">
                <div className="text-xs font-medium text-cyan-800/90">Criado em</div>
                <div className="mt-1 text-sm">{formatDate(current.criadoEm)}</div>
              </div>
              <div className="rounded-md border border-cyan-800/10 p-3">
                <div className="text-xs font-medium text-cyan-800/90">Atualizado em</div>
                <div className="mt-1 text-sm">{formatDate(current.atualizadoEm)}</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
