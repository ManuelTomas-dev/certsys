"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}
export function PaginationBar({
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-cyan-800/10 bg-white p-3 sm:flex-row">
      <div className="text-sm text-muted-foreground">
        Mostrando {start}–{end} de {total}
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={String(pageSize)}
          onValueChange={(v) => {
            onPageSizeChange(Number(v))
          }}
        >
          <SelectTrigger className="h-9 w-[110px] focus:ring-cyan-700">
            <SelectValue placeholder="Itens/página" />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50].map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="border-cyan-800/30 text-cyan-800 hover:bg-cyan-800/10 bg-transparent"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[60px] text-center text-sm">
            {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-cyan-800/30 text-cyan-800 hover:bg-cyan-800/10 bg-transparent"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
