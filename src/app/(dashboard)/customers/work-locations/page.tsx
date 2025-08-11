"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { ModuleHeader } from "@/components/module-header"
import { ClipboardCheck } from "lucide-react"
import type { WorkLocation } from "@/types/work-locations"
import type { Client } from "@/types/customers"
import { makeMockClients } from "@/lib/mock-customers"
import { makeMockWorkLocations, uid, tiposWorkLocation } from "@/lib/mock-work-locations"
import { WorkLocationFiltersBar, type WorkLocationFilters } from "@/components/customers/work-locations/filters"
import { WorkLocationsTable } from "@/components/customers/work-locations/table"
import { WorkLocationsMobileList } from "@/components/customers/work-locations/mobile-list"
import { WorkLocationCreateEditDialog } from "@/components/customers/work-locations/create-edit-dialog"
import { WorkLocationViewDialog } from "@/components/customers/work-locations/view-dialog"
import type { WorkLocationFormValues } from "@/components/customers/work-locations/form"
import { PaginationBar } from "@/components/pagination"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function WorkLocationsPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  // Mock clients to associate
  const [clients, setClients] = useState<Client[]>(() => makeMockClients(14))
  const [data, setData] = useState<WorkLocation[]>(() => makeMockWorkLocations(clients))

  const [filters, setFilters] = useState<WorkLocationFilters>({
    busca: "",
    status: "Todos",
    cliente: "Todos",
    pais: "Todos",
    cidade: "Todos",
    tipo: "Todos",
  })

  const [openForm, setOpenForm] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [current, setCurrent] = useState<WorkLocation | null>(null)
  const [openView, setOpenView] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    setPage(1)
  }, [filters, pageSize])

  // Derived options
  const clientes = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.clientName)))], [data])
  const paises = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.pais)))], [data])
  const cidadesAll = useMemo(() => Array.from(new Set(data.map((d) => d.cidade))), [data])
  const cidades = useMemo(() => {
    if (filters.pais === "Todos") return ["Todos", ...cidadesAll]
    const byPais = data.filter((d) => d.pais === filters.pais).map((d) => d.cidade)
    return ["Todos", ...Array.from(new Set(byPais))]
  }, [data, filters.pais, cidadesAll])
  const tipos = useMemo(() => ["Todos", ...tiposWorkLocation], [])

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.status !== "Todos" && item.status !== filters.status) return false
      if (filters.cliente !== "Todos" && item.clientName !== filters.cliente) return false
      if (filters.pais !== "Todos" && item.pais !== filters.pais) return false
      if (filters.cidade !== "Todos" && item.cidade !== filters.cidade) return false
      if (filters.tipo !== "Todos" && item.tipo !== (filters.tipo as any)) return false
      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase()
        const hay = [item.nome, item.clientName, item.cidade, item.pais, item.endereco].join(" ").toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data, filters])

  const total = filtered.length
  const pageStart = (page - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)

  // Handlers
  const openCreate = () => {
    setFormMode("create")
    setCurrent(null)
    setOpenForm(true)
  }
  const openEdit = (w: WorkLocation) => {
    setFormMode("edit")
    setCurrent(w)
    setOpenForm(true)
  }
  const openDetails = (w: WorkLocation) => {
    setCurrent(w)
    setOpenView(true)
  }

  function handleArchiveToggle(w: WorkLocation) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === w.id ? { ...item, status: item.status === "Ativo" ? "Arquivado" : "Ativo" } : item,
        ),
      )
      toast({
        title: w.status === "Ativo" ? "Local arquivado" : "Local restaurado",
        description: w.status === "Ativo" ? "Registo movido para Arquivados." : "Registo voltou para Ativos.",
      })
    })
  }

  function handleSubmitForm(values: WorkLocationFormValues) {
    const now = new Date().toISOString()
    const client = clients.find((c) => c.id === values.clientId)
    const clientName = client?.nome ?? "(Cliente)"
    if (formMode === "create") {
      const novo: WorkLocation = {
        id: uid(),
        clientId: values.clientId,
        clientName,
        nome: values.nome,
        tipo: values.tipo,
        pais: values.pais,
        cidade: values.cidade,
        endereco: values.endereco,
        latitude: values.latitude,
        longitude: values.longitude,
        responsavelNome: values.responsavelNome,
        responsavelEmail: values.responsavelEmail,
        responsavelTelefone: values.responsavelTelefone,
        observacoes: values.observacoes,
        status: "Ativo",
        criadoEm: now,
        atualizadoEm: now,
      }
      setData((prev) => [novo, ...prev])
      toast({ title: "Local cadastrado", description: "Local de trabalho registado com sucesso." })
    } else if (formMode === "edit" && current) {
      setData((prev) =>
        prev.map((item) =>
          item.id === current.id
            ? ({
                ...item,
                ...values,
                clientName,
                atualizadoEm: now,
              } as WorkLocation)
            : item,
        ),
      )
      toast({ title: "Local atualizado", description: "Dados do local atualizados com sucesso." })
    }
    setOpenForm(false)
  }

  // Entrance transition
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-dvh bg-white">
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <ModuleHeader
          icon={ClipboardCheck}
          title="Locais de Trabalho"
          subtitle="Gestão de Work Locations por cliente com design moderno e profissional."
          ctaLabel="Novo Local"
          onCtaClick={openCreate}
        />

        <div className={cn("transition-all", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          <WorkLocationFiltersBar
            filters={filters}
            onChange={setFilters}
            clientes={clientes}
            paises={paises}
            cidades={cidades}
            tipos={tipos}
            totalFiltered={filtered.length}
          />

          <div className="mt-6 grid gap-4 md:gap-6">
            <WorkLocationsMobileList
              rows={pageRows}
              onView={openDetails}
              onEdit={openEdit}
              onArchive={handleArchiveToggle}
            />
            <WorkLocationsTable
              rows={pageRows}
              onView={openDetails}
              onEdit={openEdit}
              onArchive={handleArchiveToggle}
            />
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

      <WorkLocationCreateEditDialog
        open={openForm}
        onOpenChange={setOpenForm}
        mode={formMode}
        current={current}
        clients={clients}
        onSubmit={handleSubmitForm}
      />

      <WorkLocationViewDialog open={openView} onOpenChange={setOpenView} current={current} />
    </main>
  )
}
