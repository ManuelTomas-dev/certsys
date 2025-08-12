"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import type { Quote } from "@/types/quotes"
import type { Enquiry } from "@/types/enquiries"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import { makeMockClients } from "@/lib/mock-customers"
import { makeMockWorkLocations } from "@/lib/mock-work-locations"
import { makeMockPersonnel } from "@/lib/mock-personnel"
import { makeMockEnquiries } from "@/lib/mock-enquiries"
import { makeMockQuotes, calculateQuoteStatistics, uid } from "@/lib/mock-quotes"
import { useToast } from "@/hooks/use-toast"
import { ModuleHeader } from "@/components/module-header"
import { QuoteFiltersBar, type QuoteFilters } from "@/components/crm/quotes/filters"
import { QuotesTable } from "@/components/crm/quotes/table"
import { QuotesMobileList } from "@/components/crm/quotes/mobile-list"
import { CreateEditQuoteDialog} from "@/components/crm/quotes/create-edit-dialog"
import { QuoteViewDialog } from "@/components/crm/quotes/view-dialog"
import { QuoteStatisticsCards, QuoteStatusBreakdown, TopSalesPersons } from "@/components/crm/quotes/statistics"
import type { QuoteFormValues } from "@/components/crm/quotes/form"
import { PaginationBar } from "@/components/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BarChart3, Archive } from "lucide-react"
import { cn } from "@/lib/utils"

export default function QuotesPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  // Mock data dependencies
  const [clients] = useState<Client[]>(() => makeMockClients(15))
  const [personnel] = useState<Personnel[]>(() => makeMockPersonnel(25))
  const [workLocations] = useState<WorkLocation[]>(() => makeMockWorkLocations(clients, 30))
  const [enquiries] = useState<Enquiry[]>(() => makeMockEnquiries(clients, workLocations, personnel, 40))
  const [data, setData] = useState<Quote[]>(() => makeMockQuotes(enquiries, clients, workLocations, personnel, 50))

  const [filters, setFilters] = useState<QuoteFilters>({
    busca: "",
    status: "Todos",
    tipoServico: "Todos",
    currency: "Todos",
    likelihood: "Todos",
    formaPagamento: "Todos",
    cliente: "Todos",
    salesPerson: "Todos",
    workLocation: "Todos",
  })

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeTab, setActiveTab] = useState("quotes")
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [filters, pageSize, showArchived])

  // Derived options
  const tiposServico = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.tipoServico)))], [data])
  const clientes = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.clientName)))], [data])
  const salesPersons = useMemo(() => {
    const names = data.map((d) => d.salesPersonName).filter(Boolean) as string[]
    return ["Todos", ...Array.from(new Set(names))]
  }, [data])
  const workLocationNames = useMemo(() => {
    const names = data.map((d) => d.workLocationName).filter(Boolean) as string[]
    return ["Todos", ...Array.from(new Set(names))]
  }, [data])

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      // Filtro de arquivamento
      if (showArchived && item.status !== "Arquivada") return false
      if (!showArchived && item.status === "Arquivada") return false

      if (filters.status !== "Todos" && item.status !== filters.status) return false
      if (filters.tipoServico !== "Todos" && item.tipoServico !== filters.tipoServico) return false
      if (filters.currency !== "Todos" && item.currency !== filters.currency) return false
      if (filters.likelihood !== "Todos" && item.likelihoodOfConversion !== filters.likelihood) return false
      if (filters.formaPagamento !== "Todos" && item.formaPagamento !== filters.formaPagamento) return false
      if (filters.cliente !== "Todos" && item.clientName !== filters.cliente) return false
      if (filters.salesPerson !== "Todos" && item.salesPersonName !== filters.salesPerson) return false
      if (filters.workLocation !== "Todos" && item.workLocationName !== filters.workLocation) return false

      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase()
        const hay = [
          item.numero,
          item.titulo,
          item.jobTitle,
          item.descricao,
          item.scopeOfWork,
          item.clientName,
          item.workLocationName ?? "",
          item.salesPersonName ?? "",
          item.notes ?? "",
          item.observacoes ?? "",
          ...item.clientContacts.map((c) => `${c.name} ${c.email} ${c.position}`),
        ]
          .join(" ")
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data, filters, showArchived])

  const total = filtered.length
  const pageStart = (page - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)

  // Statistics
  const statistics = useMemo(() => calculateQuoteStatistics(data), [data])

  // Handlers
  const [openForm, setOpenForm] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [current, setCurrent] = useState<Quote | null>(null)
  const [openView, setOpenView] = useState(false)

  const openCreate = () => {
    setFormMode("create")
    setCurrent(null)
    setOpenForm(true)
  }

  const openEdit = (q: Quote) => {
    setFormMode("edit")
    setCurrent(q)
    setOpenForm(true)
  }

  const openDetails = (q: Quote) => {
    setCurrent(q)
    setOpenView(true)
  }

  function handleArchiveToggle(q: Quote) {
    startTransition(() => {
      const now = new Date().toISOString()
      setData((prev) =>
        prev.map((item) =>
          item.id === q.id
            ? {
                ...item,
                status: item.status === "Arquivada" ? "Rascunho" : "Arquivada",
                dataArquivamento: item.status === "Arquivada" ? undefined : now.slice(0, 10),
                arquivadoEm: item.status === "Arquivada" ? undefined : now,
                arquivadoPor: item.status === "Arquivada" ? undefined : item.salesPersonName || "Sistema",
                atualizadoEm: now,
              }
            : item,
        ),
      )
      toast({
        title: q.status === "Arquivada" ? "Cotação restaurada" : "Cotação arquivada",
        description: q.status === "Arquivada" ? "Registo voltou para Rascunho." : "Registo arquivado com sucesso.",
      })
    })
  }

  function handlePrintQuote(q: Quote) {
    toast({
      title: "Impressão iniciada",
      description: `Preparando PDF da cotação ${q.numero} para impressão.`,
    })
  }

  function handleSendEmail(q: Quote) {
    toast({
      title: "E-mail preparado",
      description: `Preparando e-mail com a cotação ${q.numero} para envio ao cliente.`,
    })
  }

  function handleSubmitForm(values: QuoteFormValues) {
    const now = new Date().toISOString()
    const client = clients.find((c) => c.id === values.clientId)
    const workLocation = workLocations.find((wl) => wl.id === values.workLocationId)
    const salesPerson = personnel.find((p) => p.id === values.salesPersonId)
    const enquiry = enquiries.find((e) => e.id === values.enquiryId)

    if (formMode === "create") {
      // Gerar número sequencial
      const nextNumber = `COT-${new Date().getFullYear()}-${String(data.length + 1).padStart(4, "0")}`

      const novo: Quote = {
        id: uid(),
        numero: nextNumber,
        enquiryId: values.enquiryId,
        enquiryTitulo: enquiry?.titulo,
        clientId: values.clientId,
        clientName: client?.nome ?? "(Cliente)",
        clientLocationId: values.clientLocationId,
        clientLocationName: values.clientLocationName,
        workLocationId: values.workLocationId,
        workLocationName: workLocation?.nome,
        salesPersonId: values.salesPersonId,
        salesPersonName: salesPerson ? `${salesPerson.nome} ${salesPerson.sobrenome}` : undefined,
        clientContacts: values.clientContacts,
        primaryContactId: values.primaryContactId,
        jobTitle: values.jobTitle,
        tipoServico: values.tipoServico,
        titulo: values.titulo,
        descricao: values.descricao,
        scopeOfWork: values.scopeOfWork,
        likelihoodOfConversion: values.likelihoodOfConversion,
        status: values.status,
        dataCriacao: values.dataCriacao,
        dataValidade: values.dataValidade,
        dataEnvio: values.status !== "Rascunho" ? now.slice(0, 10) : undefined,
        dataAprovacao: values.status === "Aprovada" ? now.slice(0, 10) : undefined,
        currency: values.currency,
        formaPagamento: values.formaPagamento,
        prazoExecucao: values.prazoExecucao,
        itens: values.itens,
        coast: values.coast,
        subtotal: values.subtotal,
        descontoPercentual: values.descontoPercentual,
        descontoValor: values.descontoValor,
        upliftPercentual: values.upliftPercentual,
        upliftValor: values.upliftValor,
        taxaPercentual: values.taxaPercentual,
        taxaValor: values.taxaValor,
        valorTotal: values.valorTotal,
        clientPrerequisites: values.clientPrerequisites,
        deliverableProfessionals: values.deliverableProfessionals,
        deliverableServices: values.deliverableServices,
        notes: values.notes,
        observacoes: values.observacoes,
        termos: values.termos,
        criadoEm: now,
        atualizadoEm: now,
      }
      setData((prev) => [novo, ...prev])
      toast({
        title: "Cotação criada",
        description: `Cotação ${nextNumber} criada com sucesso.`,
      })
    } else if (formMode === "edit" && current) {
      // Verificar se o status mudou para atualizar datas
      let dataEnvio = current.dataEnvio
      let dataAprovacao = current.dataAprovacao

      if (current.status === "Rascunho" && values.status !== "Rascunho") {
        dataEnvio = now.slice(0, 10)
      }

      if (values.status === "Aprovada" && current.status !== "Aprovada") {
        dataAprovacao = now.slice(0, 10)
      }

      setData((prev) =>
        prev.map((item) =>
          item.id === current.id
            ? ({
                ...item,
                enquiryId: values.enquiryId,
                enquiryTitulo: enquiry?.titulo,
                clientId: values.clientId,
                clientName: client?.nome ?? item.clientName,
                clientLocationId: values.clientLocationId,
                clientLocationName: values.clientLocationName,
                workLocationId: values.workLocationId,
                workLocationName: workLocation?.nome ?? item.workLocationName,
                salesPersonId: values.salesPersonId,
                salesPersonName: salesPerson ? `${salesPerson.nome} ${salesPerson.sobrenome}` : item.salesPersonName,
                clientContacts: values.clientContacts,
                primaryContactId: values.primaryContactId,
                jobTitle: values.jobTitle,
                tipoServico: values.tipoServico,
                titulo: values.titulo,
                descricao: values.descricao,
                scopeOfWork: values.scopeOfWork,
                likelihoodOfConversion: values.likelihoodOfConversion,
                status: values.status,
                dataCriacao: values.dataCriacao,
                dataValidade: values.dataValidade,
                dataEnvio,
                dataAprovacao,
                currency: values.currency,
                formaPagamento: values.formaPagamento,
                prazoExecucao: values.prazoExecucao,
                itens: values.itens,
                coast: values.coast,
                subtotal: values.subtotal,
                descontoPercentual: values.descontoPercentual,
                descontoValor: values.descontoValor,
                upliftPercentual: values.upliftPercentual,
                upliftValor: values.upliftValor,
                taxaPercentual: values.taxaPercentual,
                taxaValor: values.taxaValor,
                valorTotal: values.valorTotal,
                clientPrerequisites: values.clientPrerequisites,
                deliverableProfessionals: values.deliverableProfessionals,
                deliverableServices: values.deliverableServices,
                notes: values.notes,
                observacoes: values.observacoes,
                termos: values.termos,
                atualizadoEm: now,
              } as Quote)
            : item,
        ),
      )
      toast({
        title: "Cotação atualizada",
        description: `Cotação ${current.numero} atualizada com sucesso.`,
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
          icon={FileText}
          title="CRM - Gestão de Oportunidades"
          subtitle="Sistema completo de gestão de cotações e oportunidades comerciais com análise de probabilidade de conversão."
          ctaLabel="Nova Cotação"
          onCtaClick={openCreate}
        />

        <div className={cn("transition-all", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Cotações
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Arquivadas ({statistics.quotesArquivadas})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quotes" className="space-y-6">
              <QuoteFiltersBar
                filters={filters}
                onChange={setFilters}
                tiposServico={tiposServico}
                clientes={clientes}
                salesPersons={salesPersons}
                workLocations={workLocationNames}
                totalFiltered={filtered.length}
              />

              <div className="grid gap-4 md:gap-6">
                <QuotesMobileList
                  rows={pageRows}
                  onView={openDetails}
                  onEdit={openEdit}
                  onArchive={handleArchiveToggle}
                />
                <QuotesTable rows={pageRows} onView={openDetails} onEdit={openEdit} onArchive={handleArchiveToggle} />
                <PaginationBar
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <QuoteStatisticsCards statistics={statistics} />
              <QuoteStatusBreakdown statistics={statistics} />
              <TopSalesPersons statistics={statistics} />
            </TabsContent>

            <TabsContent value="archived" className="space-y-6">
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <Archive className="h-4 w-4" />
                  <span className="font-medium">Cotações Arquivadas</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Visualize e gerencie cotações arquivadas. Você pode restaurar cotações arquivadas se necessário.
                </p>
              </div>

              <QuoteFiltersBar
                filters={{ ...filters, status: "Todos" }}
                onChange={(newFilters) => {
                  setFilters(newFilters)
                  setShowArchived(true)
                }}
                tiposServico={tiposServico}
                clientes={clientes}
                salesPersons={salesPersons}
                workLocations={workLocationNames}
                totalFiltered={data.filter((q) => q.status === "Arquivada").length}
              />

              <div className="grid gap-4 md:gap-6">
                <QuotesMobileList
                  rows={data.filter((q) => q.status === "Arquivada").slice(pageStart, pageStart + pageSize)}
                  onView={openDetails}
                  onEdit={openEdit}
                  onArchive={handleArchiveToggle}
                />
                <QuotesTable
                  rows={data.filter((q) => q.status === "Arquivada").slice(pageStart, pageStart + pageSize)}
                  onView={openDetails}
                  onEdit={openEdit}
                  onArchive={handleArchiveToggle}
                />
                <PaginationBar
                  page={page}
                  pageSize={pageSize}
                  total={data.filter((q) => q.status === "Arquivada").length}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <CreateEditQuoteDialog
          open={openForm}
          onOpenChange={setOpenForm}
          mode={formMode}
          current={current}
          clients={clients}
          workLocations={workLocations}
          personnel={personnel}
          enquiries={enquiries}
          onSubmit={handleSubmitForm}
        />

        <QuoteViewDialog
          open={openView}
          onOpenChange={setOpenView}
          current={current}
          onPrint={handlePrintQuote}
          onSendEmail={handleSendEmail}
        />
      </section>
    </main>
  )
}
