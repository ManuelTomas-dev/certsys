"use client"
import { useEffect, useMemo, useState, useTransition } from "react"
import type { Personnel, Filters } from "@/types/personnel"
import { makeMockPersonnel, generateTempPassword, uid } from "@/lib/mock-personnel"
import { useToast } from "@/hooks/use-toast"
import { PersonnelHeader } from "@/components/persennel/personnel/header"
import { PersonnelFilters } from "@/components/persennel/personnel/filters"
import { PersonnelTable } from "@/components/persennel/personnel/table"
import { PersonnelMobileList } from "@/components/persennel/personnel/mobile-list"
import { PersonnelCreateEditDialog } from "@/components/persennel/personnel/create-edit-dialog"
import { PersonnelViewDialog } from "@/components/persennel/personnel/view-dialog"
import type { PersonnelFormValues } from "@/components/persennel/personnel/form"
import { PaginationBar } from "@/components/pagination"
import { cn } from "@/lib/utils"

type Status = "Ativo" | "Arquivado"

function formatDate(iso: string) {
  if (!iso) return "-"
  try {
    const d = new Date(iso)
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}

export default function PersonnelPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<Personnel[]>(() => makeMockPersonnel())
  const [filters, setFilters] = useState<Filters>({
    busca: "",
    funcao: "Todos",
    localidade: "Todos",
    supervisor: "Todos",
    status: "Todos",
  })
  const [openForm, setOpenForm] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [current, setCurrent] = useState<Personnel | null>(null)
  const [openView, setOpenView] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  useEffect(() => {
    setPage(1) // reset page when filters change
  }, [filters, pageSize])

  // Options derived from data set (include "Todos")
  const funcoes = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.funcao)))], [data])
  const localidades = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.localidade)))], [data])
  const supervisores = useMemo(() => ["Todos", ...Array.from(new Set(data.map((d) => d.supervisor)))], [data])

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.status !== "Todos" && item.status !== filters.status) return false
      if (filters.funcao !== "Todos" && item.funcao !== filters.funcao) return false
      if (filters.localidade !== "Todos" && item.localidade !== filters.localidade) return false
      if (filters.supervisor !== "Todos" && item.supervisor !== filters.supervisor) return false
      if (filters.busca.trim()) {
        const q = filters.busca.toLowerCase()
        const hay = [
          item.nome,
          item.sobrenome,
          item.email,
          item.funcao,
          item.localidade,
          item.supervisor,
          item.biNumero,
        ]
          .join(" ")
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [data, filters])

  // Page slice
  const total = filtered.length
  const pageStart = (page - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)

  const openCreate = () => {
    setFormMode("create")
    setCurrent(null)
    setOpenForm(true)
  }
  const openEdit = (p: Personnel) => {
    setFormMode("edit")
    setCurrent(p)
    setOpenForm(true)
  }
  const openDetails = (p: Personnel) => {
    setCurrent(p)
    setOpenView(true)
  }

  function handleArchiveToggle(p: Personnel) {
    startTransition(() => {
      setData((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, status: item.status === "Ativo" ? "Arquivado" : "Ativo" } : item,
        ),
      )
      toast({
        title: p.status === "Ativo" ? "Pessoal arquivado" : "Pessoal restaurado",
        description: p.status === "Ativo" ? "O registo foi movido para Arquivados." : "O registo voltou para Ativos.",
      })
    })
  }

  function handleSubmitForm(values: PersonnelFormValues) {
    if (formMode === "create") {
      const novo: Personnel = {
        id: uid(),
        nome: values.nome,
        sobrenome: values.sobrenome,
        titulo: values.titulo,
        dataNascimento: values.dataNascimento,
        localNascimento: values.localNascimento,
        biNumero: values.biNumero,
        inss: values.inss,
        validadeDocumento: values.validadeDocumento,
        nivelAcesso: values.nivelAcesso,
        supervisor: values.supervisor,
        funcao: values.funcao,
        nomePai: values.nomePai,
        nomeMae: values.nomeMae,
        telefonePessoal: values.telefonePessoal,
        telefoneTrabalho: values.telefoneTrabalho,
        email: values.email,
        localidade: values.localidade,
        status: "Ativo",
        criadoEm: new Date().toISOString(),
      }
      setData((prev) => [novo, ...prev])
      const tempPass = generateTempPassword()
      toast({
        title: "Pessoal cadastrado",
        description: "Acesso enviado por e-mail com senha temporária: " + tempPass,
      })
    } else if (formMode === "edit" && current) {
      setData((prev) => prev.map((item) => (item.id === current.id ? ({ ...item, ...values } as Personnel) : item)))
      toast({
        title: "Dados atualizados",
        description: "As informações do pessoal foram atualizadas com sucesso.",
      })
    }
    setOpenForm(false)
  }

  // Subtle page entrance
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-dvh bg-white">
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <PersonnelHeader onCreate={openCreate} />

        <div className={cn("transition-all", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          <PersonnelFilters
            filters={filters}
            onChange={(f) => setFilters(f)}
            funcoes={funcoes}
            localidades={localidades}
            supervisores={supervisores}
            totalFiltered={filtered.length}
          />

          <div className="mt-6 grid gap-4 md:gap-6">
            <PersonnelMobileList
              rows={pageRows}
              onView={openDetails}
              onEdit={openEdit}
              onArchive={handleArchiveToggle}
            />
            <PersonnelTable rows={pageRows} onView={openDetails} onEdit={openEdit} onArchive={handleArchiveToggle} />
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

      <PersonnelCreateEditDialog
        open={openForm}
        onOpenChange={setOpenForm}
        mode={formMode}
        current={current}
        onSubmit={handleSubmitForm}
      />

      <PersonnelViewDialog open={openView} onOpenChange={setOpenView} current={current} />
    </main>
  )
}
