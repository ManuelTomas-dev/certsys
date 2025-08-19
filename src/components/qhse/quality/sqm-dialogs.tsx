"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SQMForm } from "./sqm-form"
import { SQMDetails } from "./sqm-details"
import type { SQMRecord } from "@/types/qhse"

interface SQMCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<SQMRecord>) => void
}

interface SQMEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: SQMRecord
  onSubmit: (data: Partial<SQMRecord>) => void
}

interface SQMViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: SQMRecord | null
}

export function SQMCreateDialog({ open, onOpenChange, onSubmit }: SQMCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação de Fornecedor</DialogTitle>
        </DialogHeader>
        <SQMForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function SQMEditDialog({ open, onOpenChange, record, onSubmit }: SQMEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Avaliação de Fornecedor</DialogTitle>
        </DialogHeader>
        <SQMForm record={record} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function SQMViewDialog({ open, onOpenChange, record }: SQMViewDialogProps) {
  if (!record) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Avaliação</DialogTitle>
        </DialogHeader>
        <SQMDetails record={record} />
      </DialogContent>
    </Dialog>
  )
}
