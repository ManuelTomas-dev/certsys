"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ISOForm } from "./iso-form"
import { ISODetails } from "./iso-details"
import type { ISODocument } from "@/types/qhse"

interface ISOCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<ISODocument>) => void
}

interface ISOEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: ISODocument
  onSubmit: (data: Partial<ISODocument>) => void
}

interface ISOViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: ISODocument | null
}

export function ISOCreateDialog({ open, onOpenChange, onSubmit }: ISOCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Documento ISO</DialogTitle>
        </DialogHeader>
        <ISOForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function ISOEditDialog({ open, onOpenChange, document, onSubmit }: ISOEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Documento ISO</DialogTitle>
        </DialogHeader>
        <ISOForm document={document} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function ISOViewDialog({ open, onOpenChange, document }: ISOViewDialogProps) {
  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Documento</DialogTitle>
        </DialogHeader>
        <ISODetails document={document} />
      </DialogContent>
    </Dialog>
  )
}
