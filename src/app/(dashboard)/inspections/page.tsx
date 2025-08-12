"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import type { Inspection } from "@/types/inspections"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import { makeMockClients } from "@/lib/mock-customers"
import { makeMockWorkLocations } from "@/lib/mock-work-locations"
import { makeMockPersonnel } from "@/lib/mock-personnel"
import { makeMockInspections } from "@/lib/mock-inspections"
import { useToast } from "@/hooks/use-toast"
import { ModuleHeader } from "@/components/module-header"
import { InspectionFiltersBar, type InspectionFilters } from "@/components/inspections/filters"
import { InspectionsTable } from "@/components/inspections/table"
import { InspectionsMobileList } from "@/components/inspections/mobile-list"
import { PaginationBar } from "@/components/pagination"
import { ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { InspectionCreateEditDialog } from "@/components/inspections/create-edit-dialog"
import { InspectionViewDialog } from "@/components/inspections/view-dialog"
import type { InspectionFormValues } from "@/components/inspections/form"
import { uid } from "@/lib/mock-inspections"

export default function InspectionsPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  // Mock data dependencies
  const [clients] = useState<Client[]>(() => makeMockClients(12))
  const [personnel] = useState<Personnel[]>(() => makeMockPersonnel(18))
  const [workLocations] = useState<WorkLocation[]>(() => makeMockWorkLocations(clients, 20))
  const [data, setData] = useState<Inspection[]>(() => makeMockInspections(clients, workLocations, personnel))

  const [filters, setFilters] = useState<InspectionFilters>({
    busca: "",
    status: "Todos",
    tipo: "Todos",
    cliente: "Todos",
    local: "Todos",
    inspetor: "Todos",
  })

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    setPage(1)
  }, [filters, pageSize])

  // Derived options
  const clientes = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.clientName)))], [data])
  const locais = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.workLocationName)))], [data])
  const inspetores = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.inspectorName)))], [data])

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.status !== "Todos" && item.status !== filters.status) return false
      if (filters.tipo !== "Todos" && item.tipo !== filters.tipo) return false
      if (filters.cliente !== "Todos" && item.clientName !== filters.cliente) return false
      if (filters.local !== "Todos" && item.workLocationName !== filters.local) return false
      if (filters.inspetor !== "Todos" && item.inspectorName !== filters.inspetor) return false
      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase()
        const hay = [
          item.equipamento,
          item.normasAplicaveis,
          item.clientName,
          item.workLocationName,
          item.inspectorName,
          item.observacoes ?? "",
        ]
          .join(" ")
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data, filters])

  const total = filtered.length
  const pageStart = (page - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)

  // Handlers
  const [openForm, setOpenForm] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [current, setCurrent] = useState<Inspection | null>(null)
  const [openView, setOpenView] = useState(false)

  const openCreate = () => {
    setFormMode("create")
    setCurrent(null)
    setOpenForm(true)
  }

  const openEdit = (i: Inspection) => {
    setFormMode("edit")
    setCurrent(i)
    setOpenForm(true)
  }

  const openDetails = (i: Inspection) => {
    setCurrent(i)
    setOpenView(true)
  }

  function handleArchiveToggle(i: Inspection) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === i.id ? { ...item, status: item.status === "Arquivada" ? "Concluída" : "Arquivada" } : item,
        ),
      )
      toast({
        title: i.status === "Arquivada" ? "Inspeção restaurada" : "Inspeção arquivada",
        description: i.status === "Arquivada" ? "Registo voltou para Concluída." : "Registo movido para Arquivada.",
      })
    })
  }

  function handleSubmitForm(values: InspectionFormValues) {
    const now = new Date().toISOString()
    const client = clients.find((c) => c.id === values.clientId)
    const workLocation = workLocations.find((wl) => wl.id === values.workLocationId)
    const inspector = personnel.find((p) => p.id === values.inspectorId)

    if (formMode === "create") {
      const novo: Inspection = {
        id: uid(),
        clientId: values.clientId,
        clientName: client?.nome ?? "(Cliente)",
        workLocationId: values.workLocationId,
        workLocationName: workLocation?.nome ?? "(Local)",
        inspectorId: values.inspectorId,
        inspectorName: inspector ? `${inspector.nome} ${inspector.sobrenome}` : "(Inspetor)",
        tipo: values.tipo,
        equipamento: values.equipamento,
        dataInspecao: values.dataInspecao,
        proximaInspecao: values.proximaInspecao,
        status: values.status,
        normasAplicaveis: values.normasAplicaveis,
        resultado: values.resultado,
        observacoes: values.observacoes,
        anexos: 0,
        criadoEm: now,
        atualizadoEm: now,
      }
      setData((prev) => [novo, ...prev])
      toast({ title: "Inspeção cadastrada", description: "Nova inspeção registada com sucesso." })
    } else if (formMode === "edit" && current) {
      setData((prev) =>
        prev.map((item) =>
          item.id === current.id
            ? ({
                ...item,
                ...values,
                clientName: client?.nome ?? item.clientName,
                workLocationName: workLocation?.nome ?? item.workLocationName,
                inspectorName: inspector ? `${inspector.nome} ${inspector.sobrenome}` : item.inspectorName,
                atualizadoEm: now,
              } as Inspection)
            : item,
        ),
      )
      toast({ title: "Inspeção atualizada", description: "Dados da inspeção atualizados com sucesso." })
    }
    setOpenForm(false)
  }

  // Page entrance
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
          title="Módulo de Inspeções"
          subtitle="Assegure a integridade, conformidade e segurança dos equipamentos ao longo do tempo."
          ctaLabel="Nova Inspeção"
          onCtaClick={openCreate}
        />

        <div className={cn("transition-all", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          <InspectionFiltersBar
            filters={filters}
            onChange={setFilters}
            clientes={clientes}
            locais={locais}
            inspetores={inspetores}
            totalFiltered={filtered.length}
          />

          <div className="mt-6 grid gap-4 md:gap-6">
            <InspectionsMobileList
              rows={pageRows}
              onView={openDetails}
              onEdit={openEdit}
              onArchive={handleArchiveToggle}
            />
            <InspectionsTable rows={pageRows} onView={openDetails} onEdit={openEdit} onArchive={handleArchiveToggle} />
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
        <InspectionCreateEditDialog
          open={openForm}
          onOpenChange={setOpenForm}
          mode={formMode}
          current={current}
          clients={clients}
          workLocations={workLocations}
          personnel={personnel}
          onSubmit={handleSubmitForm}
        />

        <InspectionViewDialog open={openView} onOpenChange={setOpenView} current={current} />
      </section>
    </main>
  )
}
