"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Archive, Edit, Eye, MoreVertical, RotateCcw } from "lucide-react"

type Props = {
  onView?: () => void
  onEdit?: () => void
  onArchive?: () => void
  isArchived?: boolean
}
export function PersonnelActionsMenu({
  onView = () => {},
  onEdit = () => {},
  onArchive = () => {},
  isArchived = false,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-cyan-800 hover:bg-cyan-800/10" aria-label="Abrir ações">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onView} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onEdit} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onArchive} className="cursor-pointer">
          {isArchived ? (
            <>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurar
            </>
          ) : (
            <>
              <Archive className="mr-2 h-4 w-4" />
              Arquivar
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
