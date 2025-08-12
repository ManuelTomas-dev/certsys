"use client"
import type { Quote } from "@/types/quotes"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import type { Enquiry } from "@/types/enquiries"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QuoteForm, type QuoteFormValues } from "./form"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  current: Quote | null
  mode: "create" | "edit"
  clients: Client[]
  workLocations: WorkLocation[]
  personnel: Personnel[]
  enquiries: Enquiry[]
  onSubmit: (values: QuoteFormValues) => void
}

export function CreateEditQuoteDialog({
  open,
  onOpenChange,
  current,
  mode,
  clients,
  workLocations,
  personnel,
  enquiries,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{mode === "create" ? "Nova Cotação" : "Editar Cotação"}</DialogTitle>
        </DialogHeader>
        <QuoteForm
          initial={current || undefined}
          clients={clients}
          workLocations={workLocations}
          personnel={personnel}
          enquiries={enquiries}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
