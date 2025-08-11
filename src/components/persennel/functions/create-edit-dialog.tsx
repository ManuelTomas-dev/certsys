"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Funcao } from "@/types/functions"
import { FuncaoForm, type FuncaoFormValues } from "./form"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit"
  current?: Funcao | null
  onSubmit?: (values: FuncaoFormValues) => void
}
export function FuncaoCreateEditDialog({
  open = false,
  onOpenChange = () => {},
  mode = "create",
  current = null,
  onSubmit = () => {},
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">
            {mode === "create" ? "Cadastrar Função" : "Editar Função"}
          </DialogTitle>
          <DialogDescription>Informe a designação e a descrição da função.</DialogDescription>
        </DialogHeader>
        <FuncaoForm
          initial={current ?? undefined}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
