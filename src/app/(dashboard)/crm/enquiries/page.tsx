"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import type { Enquiry } from "@/types/enquiries"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import { makeMockClients } from "@/lib/mock-customers"
import { makeMockWorkLocations } from "@/lib/mock-work-locations"
import { makeMockPersonnel } from "@/lib/mock-personnel"
import { makeMockEnquiries, uid } from "@/lib/mock-enquiries"
import { useToast } from "@/hooks/use-toast"
import { ModuleHeader } from "@/components/module-header"
import { EnquiryFiltersBar, type EnquiryFilters } from "@/components/crm/enquiries/filters"
import { EnquiriesTable } from "@/components/crm/enquiries/table"
import { EnquiriesMobileList } from "@/components/crm/enquiries/mobile-list"
import { EnquiryCreateEditDialog } from "@/components/crm/enquiries/create-edit-dialog"
import { EnquiryViewDialog } from "@/components/crm/enquiries/view-dialog"
import { EnquiriesStatistics } from "@/components/crm/enquiries/statistics"
import type { EnquiryFormValues } from "@/components/crm/enquiries/form"
import { PaginationBar } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BarChart3, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EnquiriesPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  // Mock data dependencies
  const [clients] = useState<Client[]>(() => makeMockClients(12))
  const [personnel] = useState<Personnel[]>(() => makeMockPersonnel(18))
  const [workLocations] = useState<WorkLocation[]>(() => makeMockWorkLocations(clients, 20))
  const [data, setData] = useState<Enquiry[]>(() => makeMockEnquiries(clients, workLocations, personnel))

  const [filters, setFilters] = useState<EnquiryFilters>({
    busca: "",
    status: "Todos",
    tipoServico: "Todos",
    prioridade: "Todos",
    cliente: "Todos",
    responsavel: "Todos",
  })

  // View state
  const [showStatistics, setShowStatistics] = useState(true)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    setPage(1)
  }, [filters, pageSize])

  // Derived options
  const clientes = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.nomeCliente)))], [data])
  const responsaveis = useMemo(() => {
    const names = data.map((d) => d.responsavelName).filter(Boolean) as string[]
    return ["Todos", ...Array.from(new Set(names))]
  }, [data])

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.status !== "Todos" && item.status !== filters.status) return false
      if (filters.tipoServico !== "Todos" && item.tipoServico !== filters.tipoServico) return false
      if (filters.prioridade !== "Todos" && item.prioridade !== filters.prioridade) return false
      if (filters.cliente !== "Todos" && item.nomeCliente !== filters.cliente) return false
      if (filters.responsavel !== "Todos" && item.responsavelName !== filters.responsavel) return false
      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase()
        const hay = [
          item.titulo,
          item.descricao,
          item.nomeCliente,
          item.localizacaoCliente,
          item.contactoCliente,
          item.equipaVenda,
          item.origem,
          item.notas ?? "",
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
  const [current, setCurrent] = useState<Enquiry | null>(null)
  const [openView, setOpenView] = useState(false)

  const openCreate = () => {
    setFormMode("create")
    setCurrent(null)
    setOpenForm(true)
  }

  const openEdit = (e: Enquiry) => {
    setFormMode("edit")
    setCurrent(e)
    setOpenForm(true)
  }

  const openDetails = (e: Enquiry) => {
    setCurrent(e)
    setOpenView(true)
  }

  function handleArchiveToggle(e: Enquiry) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === e.id ? { ...item, status: item.status === "Arquivada" ? "Nova" : "Arquivada" } : item,
        ),
      )
      toast({
        title: e.status === "Arquivada" ? "Enquiry restaurada" : "Enquiry arquivada",
        description: e.status === "Arquivada" ? "Registo voltou para Nova." : "Registo movido para Arquivada.",
      })
    })
  }

  function handleConvert(e: Enquiry) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === e.id
            ? {
                ...item,
                status: "Convertida" as const,
                atualizadoEm: new Date().toISOString(),
              }
            : item,
        ),
      )
      toast({
        title: "Enquiry convertida",
        description: `A enquiry "${e.titulo}" foi convertida com sucesso em projeto ativo.`,
      })
    })
  }

  function handleClose(e: Enquiry) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === e.id
            ? {
                ...item,
                status: "Fechada" as const,
                atualizadoEm: new Date().toISOString(),
              }
            : item,
        ),
      )
      toast({
        title: "Enquiry fechada",
        description: `A enquiry "${e.titulo}" foi fechada.`,
      })
    })
  }

  function handleSubmitForm(values: EnquiryFormValues) {
    const now = new Date().toISOString()
    const responsavel = personnel.find((p) => p.id === values.responsavelId)

    if (formMode === "create") {
      const novo: Enquiry = {
        id: uid(),
        titulo: values.titulo,
        origem: values.origem,
        data: values.data,
        equipaVenda: values.equipaVenda,
        descricao: values.descricao,
        notas: values.notas,
        nomeCliente: values.nomeCliente,
        localizacaoCliente: values.localizacaoCliente,
        contactoCliente: values.contactoCliente,
        probabilidade: values.probabilidade,

        // Campos de compatibilidade
        clientName: values.nomeCliente,
        responsavelId: values.responsavelId,
        responsavelName: responsavel ? `${responsavel.nome} ${responsavel.sobrenome}` : undefined,
        tipoServico: values.tipoServico,
        prioridade: values.prioridade,
        status: values.status,
        dataSolicitacao: values.data,
        dataLimite: values.dataLimite,
        valorEstimado: values.valorEstimado,
        observacoes: values.notas,
        criadoEm: now,
        atualizadoEm: now,
      }
      setData((prev) => [novo, ...prev])
      toast({
        title: "Enquiry cadastrada",
        description: `Nova enquiry "${values.titulo}" registada com sucesso.`,
      })
    } else if (formMode === "edit" && current) {
      setData((prev) =>
        prev.map((item) =>
          item.id === current.id
            ? ({
                ...item,
                titulo: values.titulo,
                origem: values.origem,
                data: values.data,
                equipaVenda: values.equipaVenda,
                descricao: values.descricao,
                notas: values.notas,
                nomeCliente: values.nomeCliente,
                localizacaoCliente: values.localizacaoCliente,
                contactoCliente: values.contactoCliente,
                probabilidade: values.probabilidade,
                clientName: values.nomeCliente,
                responsavelId: values.responsavelId,
                responsavelName: responsavel ? `${responsavel.nome} ${responsavel.sobrenome}` : undefined,
                tipoServico: values.tipoServico,
                prioridade: values.prioridade,
                status: values.status,
                dataLimite: values.dataLimite,
                valorEstimado: values.valorEstimado,
                atualizadoEm: now,
              } as Enquiry)
            : item,
        ),
      )
      toast({
        title: "Enquiry atualizada",
        description: "Dados da enquiry atualizados com sucesso.",
      })
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
          icon={MessageSquare}
          title="CRM - Enquiries"
          subtitle="Gestão completa de enquiries com cadastro, conversão, fechamento e análise estatística."
          ctaLabel="Nova Enquiry"
          onCtaClick={openCreate}
        />

        <div className={cn("transition-all", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          {/* Controles de visualização */}
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatistics(!showStatistics)}
              className="text-cyan-800 border-cyan-800/20 hover:bg-cyan-800/10"
            >
              {showStatistics ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ocultar Estatísticas
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Mostrar Estatísticas
                </>
              )}
            </Button>
          </div>

          {/* Estatísticas */}
          {showStatistics && (
            <Card className="mb-6 border-cyan-800/10">
              <CardHeader>
                <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Estatísticas das Enquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnquiriesStatistics enquiries={filtered} />
              </CardContent>
            </Card>
          )}

          <EnquiryFiltersBar
            filters={filters}
            onChange={setFilters}
            clientes={clientes}
            responsaveis={responsaveis}
            totalFiltered={filtered.length}
          />

          <div className="mt-6 grid gap-4 md:gap-6">
            <EnquiriesMobileList
              rows={pageRows}
              onView={openDetails}
              onEdit={openEdit}
              onArchive={handleArchiveToggle}
              onConvert={handleConvert}
              onClose={handleClose}
            />
            <EnquiriesTable
              rows={pageRows}
              onView={openDetails}
              onEdit={openEdit}
              onArchive={handleArchiveToggle}
              onConvert={handleConvert}
              onClose={handleClose}
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

        <EnquiryCreateEditDialog
          open={openForm}
          onOpenChange={setOpenForm}
          mode={formMode}
          current={current}
          clients={clients}
          workLocations={workLocations}
          personnel={personnel}
          onSubmit={handleSubmitForm}
        />

        <EnquiryViewDialog open={openView} onOpenChange={setOpenView} current={current} />
      </section>
    </main>
  )
}
