"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Client } from "@/types/customers"
import { ClientForm, type ClientFormValues } from "./form"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit"
  current?: Client | null
  onSubmit?: (values: ClientFormValues) => void
}
export function ClientCreateEditDialog({
  open = false,
  onOpenChange = () => {},
  mode = "create",
  current = null,
  onSubmit = () => {},
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">
            {mode === "create" ? "Cadastrar Cliente" : "Editar Cliente"}
          </DialogTitle>
          <DialogDescription>Informe os dados do cliente.</DialogDescription>
        </DialogHeader>
        <ClientForm
          initial={current ?? undefined}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
