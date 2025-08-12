"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import type { Client } from "@/types/customers"
import { makeMockClients, uid } from "@/lib/mock-customers"
import { useToast } from "@/hooks/use-toast"
import { ModuleHeader } from "@/components/module-header"
import { ClientsTable } from "@/components/customers/clients/table"
import { ClientsMobileList } from "@/components/customers/clients/mobile-list"
import { ClientCreateEditDialog } from "@/components/customers/clients/create-edit-dialog"
import { ClientViewDialog } from "@/components/customers/clients/view-dialog"
import type { ClientFormValues } from "@/components/customers/clients/form"
import { ClientFiltersBar, type ClientFilters } from "@/components/customers/clients/filters"
import { PaginationBar } from "@/components/pagination"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClientsPage() {
  const { toast } = useToast()
  const [
    // isPending
    , startTransition] = useTransition()
  const [data, setData] = useState<Client[]>(() => makeMockClients())
  const [filters, setFilters] = useState<ClientFilters>({ busca: "", status: "Todos", pais: "Todos", cidade: "Todos" })

  const [openForm, setOpenForm] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [current, setCurrent] = useState<Client | null>(null)
  const [openView, setOpenView] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    setPage(1)
  }, [filters, pageSize])

  // Derived options
  const paises = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.pais)))], [data])
  const cidadesAll = useMemo(() => Array.from(new Set(data.map((d) => d.cidade))), [data])
  const cidades = useMemo(() => {
    if (filters.pais === "Todos") return ["Todos", ...cidadesAll]
    const byPais = data.filter((d) => d.pais === filters.pais).map((d) => d.cidade)
    return ["Todos", ...Array.from(new Set(byPais))]
  }, [data, filters.pais, cidadesAll])

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.status !== "Todos" && item.status !== filters.status) return false
      if (filters.pais !== "Todos" && item.pais !== filters.pais) return false
      if (filters.cidade !== "Todos" && item.cidade !== filters.cidade) return false
      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase()
        const hay = [item.nome, item.nif, item.email, item.website ?? "", item.segmento ?? ""].join(" ").toLowerCase()
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
  const openEdit = (c: Client) => {
    setFormMode("edit")
    setCurrent(c)
    setOpenForm(true)
  }
  const openDetails = (c: Client) => {
    setCurrent(c)
    setOpenView(true)
  }

  function handleArchiveToggle(c: Client) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, status: item.status === "Ativo" ? "Arquivado" : "Ativo" } : item,
        ),
      )
      toast({
        title: c.status === "Ativo" ? "Cliente arquivado" : "Cliente restaurado",
        description: c.status === "Ativo" ? "Registo movido para Arquivados." : "Registo voltou para Ativos.",
      })
    })
  }

  function handleSubmitForm(values: ClientFormValues) {
    const now = new Date().toISOString()
    if (formMode === "create") {
      const novo: Client = {
        id: uid(),
        nome: values.nome,
        nif: values.nif,
        email: values.email,
        telefone: values.telefone,
        website: values.website,
        pais: values.pais,
        cidade: values.cidade,
        endereco: values.endereco,
        segmento: values.segmento,
        observacoes: values.observacoes,
        status: "Ativo",
        criadoEm: now,
        atualizadoEm: now,
      }
      setData((prev) => [novo, ...prev])
      toast({ title: "Cliente cadastrado", description: "Registo criado com sucesso." })
    } else if (formMode === "edit" && current) {
      setData((prev) =>
        prev.map((item) =>
          item.id === current.id
            ? ({
                ...item,
                ...values,
                atualizadoEm: now,
              } as Client)
            : item,
        ),
      )
      toast({ title: "Cliente atualizado", description: "Dados do cliente atualizados com sucesso." })
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
          icon={Users}
          title="Clientes"
          subtitle="Gestão de clientes e locais de trabalho com uma experiência séria e moderna."
          ctaLabel="Novo Cliente"
          onCtaClick={openCreate}
        />

        <div className={cn("transition-all", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          <ClientFiltersBar
            filters={filters}
            onChange={setFilters}
            paises={paises}
            cidades={cidades}
            totalFiltered={filtered.length}
          />

          <div className="mt-6 grid gap-4 md:gap-6">
            <ClientsMobileList rows={pageRows} onView={openDetails} onEdit={openEdit} onArchive={handleArchiveToggle} />
            <ClientsTable rows={pageRows} onView={openDetails} onEdit={openEdit} onArchive={handleArchiveToggle} />
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

      <ClientCreateEditDialog
        open={openForm}
        onOpenChange={setOpenForm}
        mode={formMode}
        current={current}
        onSubmit={handleSubmitForm}
      />

      <ClientViewDialog open={openView} onOpenChange={setOpenView} current={current} />
    </main>
  )
}
