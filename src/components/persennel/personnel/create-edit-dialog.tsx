"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Personnel } from "@/types/personnel"
import { PersonnelForm, type PersonnelFormValues } from "./form"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit"
  current?: Personnel | null
  onSubmit?: (values: PersonnelFormValues) => void
}
export function PersonnelCreateEditDialog({
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
            {mode === "create" ? "Cadastrar Pessoal" : "Editar Pessoal"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos obrigatórios. O acesso será enviado por e-mail com senha temporária.
          </DialogDescription>
        </DialogHeader>
        <PersonnelForm
          initial={current ?? undefined}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
