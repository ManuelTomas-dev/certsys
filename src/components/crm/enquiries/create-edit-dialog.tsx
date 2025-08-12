"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Enquiry } from "@/types/enquiries"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import { EnquiryForm, type EnquiryFormValues } from "./form"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit"
  current?: Enquiry | null
  clients?: Client[]
  workLocations?: WorkLocation[]
  personnel?: Personnel[]
  onSubmit?: (values: EnquiryFormValues) => void
}

export function EnquiryCreateEditDialog({
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
          <DialogTitle className="text-cyan-800">{mode === "create" ? "Nova Enquiry" : "Editar Enquiry"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Registre uma nova solicitação de serviço com sugestões inteligentes baseadas no cliente."
              : "Atualize os dados da solicitação e acompanhe o progresso."}
          </DialogDescription>
        </DialogHeader>
        <EnquiryForm
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
