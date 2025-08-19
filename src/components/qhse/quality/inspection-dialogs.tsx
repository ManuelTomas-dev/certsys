"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InspectionForm } from "./inspection-form"
import { InspectionDetails } from "./inspection-details"
import type { InspectionRecord } from "@/types/qhse"

interface InspectionCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<InspectionRecord>) => void
}

interface InspectionEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inspection: InspectionRecord
  onSubmit: (data: Partial<InspectionRecord>) => void
}

interface InspectionViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inspection: InspectionRecord | null
}

export function InspectionCreateDialog({ open, onOpenChange, onSubmit }: InspectionCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Inspeção</DialogTitle>
        </DialogHeader>
        <InspectionForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function InspectionEditDialog({ open, onOpenChange, inspection, onSubmit }: InspectionEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Inspeção</DialogTitle>
        </DialogHeader>
        <InspectionForm inspection={inspection} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function InspectionViewDialog({ open, onOpenChange, inspection }: InspectionViewDialogProps) {
  if (!inspection) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Inspeção</DialogTitle>
        </DialogHeader>
        <InspectionDetails inspection={inspection} />
      </DialogContent>
    </Dialog>
  )
}
