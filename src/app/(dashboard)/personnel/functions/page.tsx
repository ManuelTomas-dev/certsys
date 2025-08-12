"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import type { Funcao } from "@/types/functions"
import { makeMockFunctions, uid } from "@/lib/mock-functions"
import { useToast } from "@/hooks/use-toast"
import { ModuleHeader } from "@/components/module-header"
import { FuncoesTable } from "@/components/persennel/functions/table"
import { FuncoesMobileList } from "@/components/persennel/functions/mobile-list"
import { FuncaoCreateEditDialog } from "@/components/persennel/functions/create-edit-dialog"
import { FuncaoViewDialog } from "@/components/persennel/functions/view-dialog"
import type { FuncaoFormValues } from "@/components/persennel/functions/form"
import { PaginationBar } from "@/components/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, X, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Filters = {
  busca: string
  status: "Todos" | "Ativo" | "Arquivado"
}

const defaultFilters: Filters = { busca: "", status: "Todos" }

export default function FuncoesPage() {
  const { toast } = useToast()
  const [
    // isPending
    , startTransition] = useTransition()
  const [data, setData] = useState<Funcao[]>(() => makeMockFunctions())
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const [openForm, setOpenForm] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [current, setCurrent] = useState<Funcao | null>(null)
  const [openView, setOpenView] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    setPage(1)
  }, [filters, pageSize])

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.status !== "Todos" && item.status !== filters.status) return false
      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase()
        const hay = [item.designacao, item.descricao].join(" ").toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data, filters])

  const total = filtered.length
  const pageStart = (page - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)

  const openCreate = () => {
    setFormMode("create")
    setCurrent(null)
    setOpenForm(true)
  }
  const openEdit = (f: Funcao) => {
    setFormMode("edit")
    setCurrent(f)
    setOpenForm(true)
  }
  const openDetails = (f: Funcao) => {
    setCurrent(f)
    setOpenView(true)
  }

  function handleArchiveToggle(f: Funcao) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === f.id ? { ...item, status: item.status === "Ativo" ? "Arquivado" : "Ativo" } : item,
        ),
      )
      toast({
        title: f.status === "Ativo" ? "Função arquivada" : "Função restaurada",
        description: f.status === "Ativo" ? "O registo foi movido para Arquivados." : "O registo voltou para Ativos.",
      })
    })
  }

  function handleSubmitForm(values: FuncaoFormValues) {
    const now = new Date().toISOString()
    if (formMode === "create") {
      const novo: Funcao = {
        id: uid(),
        designacao: values.designacao,
        descricao: values.descricao,
        status: "Ativo",
        criadoEm: now,
        atualizadoEm: now,
      }
      setData((prev) => [novo, ...prev])
      toast({
        title: "Função cadastrada",
        description: "A função foi registada com sucesso.",
      })
    } else if (formMode === "edit" && current) {
      setData((prev) =>
        prev.map((item) =>
          item.id === current.id
            ? ({
                ...item,
                designacao: values.designacao,
                descricao: values.descricao,
                atualizadoEm: now,
              } as Funcao)
            : item,
        ),
      )
      toast({
        title: "Função atualizada",
        description: "As informações da função foram atualizadas com sucesso.",
      })
    }
    setOpenForm(false)
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-dvh bg-white">
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <ModuleHeader
          icon={ClipboardList}
          title="Módulo de Funções"
          subtitle="Cadastre, edite, arquive e consulte as funções com design moderno e profissional."
          ctaLabel="Nova Função"
          onCtaClick={openCreate}
        />

        <div className={cn("transition-all", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          <Card className="border-cyan-800/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-cyan-800">Consulta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div className="sm:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-800/70" />
                    <Input
                      aria-label="Buscar função"
                      placeholder="Buscar por designação ou descrição..."
                      className="pl-8 focus-visible:ring-cyan-700"
                      value={filters.busca}
                      onChange={(e) => setFilters({ ...filters, busca: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="f-status" className="sr-only">
                    Filtrar por status
                  </Label>
                  <Select
                    value={filters.status}
                    onValueChange={(v: Filters["status"]) => setFilters({ ...filters, status: v })}
                  >
                    <SelectTrigger id="f-status" className="focus:ring-cyan-700">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Ativo">Ativos</SelectItem>
                      <SelectItem value="Arquivado">Arquivados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Filter className="h-3.5 w-3.5 text-cyan-800/80" />
                  <span>
                    {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(defaultFilters)}
                  className="text-cyan-800 hover:bg-cyan-800/10"
                >
                  <X className="mr-2 h-3.5 w-3.5" />
                  Limpar filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-4 md:gap-6">
            <FuncoesMobileList rows={pageRows} onView={openDetails} onEdit={openEdit} onArchive={handleArchiveToggle} />
            <FuncoesTable rows={pageRows} onView={openDetails} onEdit={openEdit} onArchive={handleArchiveToggle} />
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </section>

      <FuncaoCreateEditDialog
        open={openForm}
        onOpenChange={setOpenForm}
        mode={formMode}
        current={current}
        onSubmit={handleSubmitForm}
      />

      <FuncaoViewDialog open={openView} onOpenChange={setOpenView} current={current} />
    </main>
  )
}
