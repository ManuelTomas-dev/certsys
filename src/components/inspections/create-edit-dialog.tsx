"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Inspection } from "@/types/inspections"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import { InspectionForm, type InspectionFormValues } from "./form"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit"
  current?: Inspection | null
  clients?: Client[]
  workLocations?: WorkLocation[]
  personnel?: Personnel[]
  onSubmit?: (values: InspectionFormValues) => void
}

export function InspectionCreateEditDialog({
  open = false,
  onOpenChange = () => {},
  mode = "create",
  current = null,
  clients = [],
  workLocations = [],
  personnel = [],
  onSubmit = () => {},
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">
            {mode === "create" ? "Cadastrar Inspeção" : "Editar Inspeção"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Registre uma nova inspeção associando cliente, local e inspetor."
              : "Atualize os dados da inspeção."}
          </DialogDescription>
        </DialogHeader>
        <InspectionForm
          initial={current ?? undefined}
          clients={clients}
          workLocations={workLocations}
          personnel={personnel}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
