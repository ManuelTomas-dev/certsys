"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LiftingForm } from "./lifting-form"
import { LiftingDetails } from "./lifting-details"
import type { LiftingOperation } from "@/types/qhse"

interface LiftingCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<LiftingOperation>) => void
}

interface LiftingEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  operation: LiftingOperation
  onSubmit: (data: Partial<LiftingOperation>) => void
}

interface LiftingViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  operation: LiftingOperation | null
}

export function LiftingCreateDialog({ open, onOpenChange, onSubmit }: LiftingCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Operação de Elevação</DialogTitle>
        </DialogHeader>
        <LiftingForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function LiftingEditDialog({ open, onOpenChange, operation, onSubmit }: LiftingEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Operação de Elevação</DialogTitle>
        </DialogHeader>
        <LiftingForm operation={operation} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function LiftingViewDialog({ open, onOpenChange, operation }: LiftingViewDialogProps) {
  if (!operation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Operação</DialogTitle>
        </DialogHeader>
        <LiftingDetails operation={operation} />
      </DialogContent>
    </Dialog>
  )
}
