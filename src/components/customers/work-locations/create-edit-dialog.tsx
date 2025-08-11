"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { WorkLocation } from "@/types/work-locations"
import type { Client } from "@/types/customers"
import { WorkLocationForm, type WorkLocationFormValues } from "./form"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit"
  current?: WorkLocation | null
  clients?: Client[]
  onSubmit?: (values: WorkLocationFormValues) => void
}
export function WorkLocationCreateEditDialog({
  open = false,
  onOpenChange = () => {},
  mode = "create",
  current = null,
  clients = [],
  onSubmit = () => {},
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">
            {mode === "create" ? "Cadastrar Local de Trabalho" : "Editar Local de Trabalho"}
          </DialogTitle>
          <DialogDescription>Associe a um cliente e informe os dados do local.</DialogDescription>
        </DialogHeader>
        <WorkLocationForm
          initial={current ?? undefined}
          clients={clients}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
