"use client"

import type React from "react"
import { useMemo, useState } from "react"
import type {
  Quote,
  QuoteStatus,
  PaymentTerm,
  QuoteItem,
  Currency,
  LikelihoodOfConversion,
  ClientContact,
  ClientPrerequisite,
  DeliverableProfessional,
  DeliverableService,
} from "@/types/quotes"
import type { Enquiry } from "@/types/enquiries"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { statusQuote, paymentTerms, currencies, likelihoodLevels, formatCurrency, uid } from "@/lib/mock-quotes"
import { Edit, Plus, Trash2, Calculator, User, Settings } from "lucide-react"

export type QuoteFormValues = {
  clientId: string
  clientLocationId?: string
  clientLocationName?: string
  workLocationId?: string
  enquiryId?: string
  salesPersonId?: string
  clientContacts: ClientContact[]
  primaryContactId?: string
  jobTitle: string
  tipoServico: string
  titulo: string
  descricao: string
  scopeOfWork: string
  likelihoodOfConversion: LikelihoodOfConversion
  status: QuoteStatus
  dataCriacao: string
  dataValidade: string
  currency: Currency
  formaPagamento: PaymentTerm
  prazoExecucao: string
  itens: QuoteItem[]
  coast: number
  subtotal: number
  descontoPercentual?: number
  descontoValor?: number
  upliftPercentual?: number
  upliftValor?: number
  taxaPercentual?: number
  taxaValor?: number
  valorTotal: number
  clientPrerequisites: ClientPrerequisite[]
  deliverableProfessionals: DeliverableProfessional[]
  deliverableServices: DeliverableService[]
  notes?: string
  observacoes?: string
  termos?: string
}

type Props = {
  initial?: Quote
  clients?: Client[]
  workLocations?: WorkLocation[]
  personnel?: Personnel[]
  enquiries?: Enquiry[]
  mode?: "create" | "edit"
  onSubmit?: (values: QuoteFormValues) => void
  onCancel?: () => void
}

export function QuoteForm({
  initial,
  clients = [],
  workLocations = [],
  personnel = [],
  enquiries = [],
  mode = "create",
  onSubmit = () => {},
  onCancel = () => {},
}: Props) {
  const [values, setValues] = useState<QuoteFormValues>(() => ({
    clientId: initial?.clientId ?? clients[0]?.id ?? "",
    clientLocationId: initial?.clientLocationId,
    clientLocationName: initial?.clientLocationName,
    workLocationId: initial?.workLocationId,
    enquiryId: initial?.enquiryId,
    salesPersonId: initial?.salesPersonId,
    clientContacts: initial?.clientContacts ?? [],
    primaryContactId: initial?.primaryContactId,
    jobTitle: initial?.jobTitle ?? "",
    tipoServico: initial?.tipoServico ?? "Inspeção",
    titulo: initial?.titulo ?? "",
    descricao: initial?.descricao ?? "",
    scopeOfWork: initial?.scopeOfWork ?? "",
    likelihoodOfConversion: initial?.likelihoodOfConversion ?? "Média",
    status: initial?.status ?? "Rascunho",
    dataCriacao: initial?.dataCriacao ?? new Date().toISOString().slice(0, 10),
    dataValidade: initial?.dataValidade ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currency: initial?.currency ?? "AOA",
    formaPagamento: initial?.formaPagamento ?? "30 Dias",
    prazoExecucao: initial?.prazoExecucao ?? "30 dias",
    itens: initial?.itens ?? [],
    coast: initial?.coast ?? 0,
    subtotal: initial?.subtotal ?? 0,
    descontoPercentual: initial?.descontoPercentual ?? 0,
    descontoValor: initial?.descontoValor ?? 0,
    upliftPercentual: initial?.upliftPercentual ?? 0,
    upliftValor: initial?.upliftValor ?? 0,
    taxaPercentual: initial?.taxaPercentual ?? 14,
    taxaValor: initial?.taxaValor ?? 0,
    valorTotal: initial?.valorTotal ?? 0,
    clientPrerequisites: initial?.clientPrerequisites ?? [],
    deliverableProfessionals: initial?.deliverableProfessionals ?? [],
    deliverableServices: initial?.deliverableServices ?? [],
    notes: initial?.notes ?? "",
    observacoes: initial?.observacoes ?? "",
    termos:
      initial?.termos ??
      "1. Validade conforme data indicada.\n2. Pagamento conforme condições acordadas.\n3. Execução após aprovação formal.",
  }))

  function update<K extends keyof QuoteFormValues>(key: K, val: QuoteFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  // Filtrar locais de trabalho pelo cliente selecionado
  const availableWorkLocations = useMemo(() => {
    if (!values.clientId) return workLocations
    return workLocations.filter((wl) => wl.clientId === values.clientId)
  }, [workLocations, values.clientId])

  // Filtrar enquiries pelo cliente selecionado
  const availableEnquiries = useMemo(() => {
    if (!values.clientId) return enquiries
    return enquiries.filter((e) => e.clientId === values.clientId)
  }, [enquiries, values.clientId])

  // Filtrar vendedores (pessoal comercial/técnico)
  const salesPersons = useMemo(() => {
    return personnel.filter(
      (p) =>
        p.funcao.toLowerCase().includes("coordenador") ||
        p.funcao.toLowerCase().includes("supervisor") ||
        p.funcao.toLowerCase().includes("engenheiro") ||
        p.funcao.toLowerCase().includes("gestor") ||
        p.funcao.toLowerCase().includes("comercial"),
    )
  }, [personnel])

  // Enquiry selecionada
  const selectedEnquiry = useMemo(() => {
    return enquiries.find((e) => e.id === values.enquiryId)
  }, [enquiries, values.enquiryId])

  // Recalcular valores totais
  function recalculateValues(items: QuoteItem[], descontoPerc = 0, upliftPerc = 0, taxaPerc = 14) {
    const subtotal = items.reduce((sum, item) => sum + (item.valorTotal || 0), 0)
    const coast = subtotal * 0.6 // 60% como custo estimado
    const descontoValor = (subtotal * descontoPerc) / 100
    const upliftValor = (subtotal * upliftPerc) / 100
    const baseForTax = subtotal - descontoValor + upliftValor
    const taxaValor = (baseForTax * taxaPerc) / 100
    const valorTotal = baseForTax + taxaValor

    update("subtotal", subtotal)
    update("coast", coast)
    update("descontoValor", descontoValor)
    update("upliftValor", upliftValor)
    update("taxaValor", taxaValor)
    update("valorTotal", valorTotal)
  }

  // Adicionar item à cotação
  function addItem() {
    const newItem: QuoteItem = {
      id: uid(),
      descricao: "",
      quantidade: 1,
      unidade: "Unidade",
      valorUnitario: 0,
      valorTotal: 0,
    }
    const newItems = [...values.itens, newItem]
    update("itens", newItems)
    recalculateValues(newItems, values.descontoPercentual, values.upliftPercentual, values.taxaPercentual)
  }

  // Remover item da cotação
  function removeItem(id: string) {
    const newItems = values.itens.filter((item) => item.id !== id)
    update("itens", newItems)
    recalculateValues(newItems, values.descontoPercentual, values.upliftPercentual, values.taxaPercentual)
  }

  // Atualizar item da cotação
  function updateItem(id: string, field: keyof QuoteItem, value: any) {
    const newItems = values.itens.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantidade" || field === "valorUnitario") {
          updatedItem.valorTotal = Number(updatedItem.quantidade) * Number(updatedItem.valorUnitario)
        }
        return updatedItem
      }
      return item
    })
    update("itens", newItems)
    recalculateValues(newItems, values.descontoPercentual, values.upliftPercentual, values.taxaPercentual)
  }

  // Adicionar contato
  function addContact() {
    const newContact: ClientContact = {
      id: uid(),
      name: "",
      email: "",
      phone: "",
      position: "",
      isPrimary: values.clientContacts.length === 0,
    }
    update("clientContacts", [...values.clientContacts, newContact])
  }

  // Remover contato
  function removeContact(id: string) {
    const newContacts = values.clientContacts.filter((c) => c.id !== id)
    // Se removemos o contato primário, tornar o primeiro como primário
    if (newContacts.length > 0 && !newContacts.some((c) => c.isPrimary)) {
      newContacts[0].isPrimary = true
      update("primaryContactId", newContacts[0].id)
    }
    update("clientContacts", newContacts)
  }

  // Atualizar contato
  function updateContact(id: string, field: keyof ClientContact, value: any) {
    const newContacts = values.clientContacts.map((contact) => {
      if (contact.id === id) {
        const updated = { ...contact, [field]: value }
        if (field === "isPrimary" && value) {
          // Apenas um pode ser primário
          return updated
        }
        return updated
      }
      // Se estamos definindo outro como primário, remover dos outros
      if (field === "isPrimary" && value) {
        return { ...contact, isPrimary: false }
      }
      return contact
    })

    if (field === "isPrimary" && value) {
      update("primaryContactId", id)
    }

    update("clientContacts", newContacts)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="items">Itens & Valores</TabsTrigger>
          <TabsTrigger value="deliverables">Entregáveis</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Cliente e Enquiry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="clientId">Cliente *</Label>
              <Select value={values.clientId} onValueChange={(v) => update("clientId", v)}>
                <SelectTrigger id="clientId" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="workLocationId">Local de Trabalho</Label>
              <Select
                value={values.workLocationId || "none"}
                onValueChange={(v) => update("workLocationId", v === "none" ? undefined : v)}
              >
                <SelectTrigger id="workLocationId" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Selecione o local (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum local específico</SelectItem>
                  {availableWorkLocations.map((wl) => (
                    <SelectItem key={wl.id} value={wl.id}>
                      {wl.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enquiry e Vendedor */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="enquiryId">Enquiry Relacionada</Label>
              <Select
                value={values.enquiryId || "none"}
                onValueChange={(v) => update("enquiryId", v === "none" ? undefined : v)}
              >
                <SelectTrigger id="enquiryId" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Selecione uma enquiry (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma enquiry</SelectItem>
                  {availableEnquiries.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salesPersonId">Vendedor/Responsável</Label>
              <Select
                value={values.salesPersonId || "none"}
                onValueChange={(v) => update("salesPersonId", v === "none" ? undefined : v)}
              >
                <SelectTrigger id="salesPersonId" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Selecione o vendedor (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem vendedor definido</SelectItem>
                  {salesPersons.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome} {p.sobrenome} - {p.funcao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Detalhes da Oportunidade */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle">Título do Trabalho *</Label>
              <Input
                id="jobTitle"
                value={values.jobTitle}
                onChange={(e) => update("jobTitle", e.target.value)}
                placeholder="Ex.: Inspeção de Vasos de Pressão"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tipoServico">Tipo de Serviço *</Label>
              <Select value={values.tipoServico} onValueChange={(v) => update("tipoServico", v)}>
                <SelectTrigger id="tipoServico" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inspeção">Inspeção</SelectItem>
                  <SelectItem value="Certificação">Certificação</SelectItem>
                  <SelectItem value="Auditoria">Auditoria</SelectItem>
                  <SelectItem value="Consultoria">Consultoria</SelectItem>
                  <SelectItem value="Treinamento">Treinamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="likelihoodOfConversion">Probabilidade de Conversão *</Label>
              <Select
                value={values.likelihoodOfConversion}
                onValueChange={(v: LikelihoodOfConversion) => update("likelihoodOfConversion", v)}
              >
                <SelectTrigger id="likelihoodOfConversion" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Probabilidade" />
                </SelectTrigger>
                <SelectContent>
                  {likelihoodLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Título e Descrição */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="titulo">Título da Cotação *</Label>
              <Input
                id="titulo"
                value={values.titulo}
                onChange={(e) => update("titulo", e.target.value)}
                placeholder="Ex.: Cotação: Inspeção de Vasos de Pressão"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={values.descricao}
                onChange={(e) => update("descricao", e.target.value)}
                placeholder="Descreva a proposta comercial..."
                className="min-h-[80px]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scopeOfWork">Escopo de Trabalho *</Label>
              <Textarea
                id="scopeOfWork"
                value={values.scopeOfWork}
                onChange={(e) => update("scopeOfWork", e.target.value)}
                placeholder="Descreva detalhadamente o escopo do trabalho a ser executado..."
                className="min-h-[120px]"
                required
              />
            </div>
          </div>

          {/* Status e Datas */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status *</Label>
              <Select value={values.status} onValueChange={(v: QuoteStatus) => update("status", v)}>
                <SelectTrigger id="status" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusQuote.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dataCriacao">Data de Criação *</Label>
              <Input
                id="dataCriacao"
                type="date"
                value={values.dataCriacao}
                onChange={(e) => update("dataCriacao", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dataValidade">Data de Validade *</Label>
              <Input
                id="dataValidade"
                type="date"
                value={values.dataValidade}
                onChange={(e) => update("dataValidade", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Moeda *</Label>
              <Select value={values.currency} onValueChange={(v: Currency) => update("currency", v)}>
                <SelectTrigger id="currency" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Moeda" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Condições Comerciais */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
              <Select value={values.formaPagamento} onValueChange={(v: PaymentTerm) => update("formaPagamento", v)}>
                <SelectTrigger id="formaPagamento" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTerms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazoExecucao">Prazo de Execução *</Label>
              <Input
                id="prazoExecucao"
                value={values.prazoExecucao}
                onChange={(e) => update("prazoExecucao", e.target.value)}
                placeholder="Ex.: 30 dias"
                required
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={values.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Notas importantes sobre a oportunidade..."
              className="min-h-[80px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                <User className="h-4 w-4" />
                Contatos do Cliente
              </CardTitle>
              <Button type="button" onClick={addContact} size="sm" className="bg-cyan-800 text-white hover:bg-cyan-700">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Contato
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.clientContacts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum contato adicionado. Clique em "Adicionar Contato" para começar.
                </p>
              ) : (
                values.clientContacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="primaryContact"
                          checked={contact.isPrimary}
                          onChange={(e) => updateContact(contact.id, "isPrimary", e.target.checked)}
                        />
                        <label className="text-sm font-medium">Contato Principal</label>
                        {contact.isPrimary && <Badge variant="secondary">Principal</Badge>}
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeContact(contact.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm">Nome *</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Cargo</Label>
                        <Input
                          value={contact.position}
                          onChange={(e) => updateContact(contact.id, "position", e.target.value)}
                          placeholder="Cargo/Função"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">E-mail *</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                          placeholder="email@empresa.com"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Telefone</Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                          placeholder="+244 9XX XXX XXX"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Itens da Cotação */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium text-cyan-800">Itens da Cotação</CardTitle>
              <Button type="button" onClick={addItem} size="sm" className="bg-cyan-800 text-white hover:bg-cyan-700">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-cyan-800/5 text-cyan-800">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Descrição</th>
                      <th className="px-4 py-2 text-center font-medium w-20">Qtd.</th>
                      <th className="px-4 py-2 text-center font-medium w-24">Unidade</th>
                      <th className="px-4 py-2 text-right font-medium w-32">Valor Unit.</th>
                      <th className="px-4 py-2 text-right font-medium w-32">Valor Total</th>
                      <th className="px-4 py-2 text-center font-medium w-16">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.itens.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                          Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                        </td>
                      </tr>
                    ) : (
                      values.itens.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100">
                          <td className="px-4 py-2">
                            <Input
                              value={item.descricao}
                              onChange={(e) => updateItem(item.id, "descricao", e.target.value)}
                              placeholder="Descrição do item"
                              className="border-0 focus-visible:ring-0 p-0 h-auto"
                            />
                            <Input
                              value={item.observacao || ""}
                              onChange={(e) => updateItem(item.id, "observacao", e.target.value)}
                              placeholder="Observação (opcional)"
                              className="border-0 focus-visible:ring-0 p-0 h-auto text-xs text-muted-foreground mt-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantidade}
                              onChange={(e) => updateItem(item.id, "quantidade", Number(e.target.value))}
                              className="text-center"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Select value={item.unidade} onValueChange={(v) => updateItem(item.id, "unidade", v)}>
                              <SelectTrigger className="focus:ring-cyan-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Unidade">Unidade</SelectItem>
                                <SelectItem value="Hora">Hora</SelectItem>
                                <SelectItem value="Dia">Dia</SelectItem>
                                <SelectItem value="Mês">Mês</SelectItem>
                                <SelectItem value="Serviço">Serviço</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              min="0"
                              value={item.valorUnitario}
                              onChange={(e) => updateItem(item.id, "valorUnitario", Number(e.target.value))}
                              className="text-right"
                            />
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {formatCurrency(item.valorTotal, values.currency)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remover item</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="descontoPercentual">Desconto (%)</Label>
                    <Input
                      id="descontoPercentual"
                      type="number"
                      min="0"
                      max="100"
                      value={values.descontoPercentual}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        update("descontoPercentual", val)
                        recalculateValues(values.itens, val, values.upliftPercentual, values.taxaPercentual)
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="upliftPercentual">Uplift/Margem (%)</Label>
                    <Input
                      id="upliftPercentual"
                      type="number"
                      min="0"
                      max="100"
                      value={values.upliftPercentual}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        update("upliftPercentual", val)
                        recalculateValues(values.itens, values.descontoPercentual, val, values.taxaPercentual)
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="taxaPercentual">Taxa/IVA (%)</Label>
                    <Input
                      id="taxaPercentual"
                      type="number"
                      min="0"
                      max="100"
                      value={values.taxaPercentual}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        update("taxaPercentual", val)
                        recalculateValues(values.itens, values.descontoPercentual, values.upliftPercentual, val)
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between">
                    <span>Custo Estimado:</span>
                    <span>{formatCurrency(values.coast, values.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(values.subtotal, values.currency)}</span>
                  </div>
                  {values.descontoPercentual && values.descontoPercentual > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Desconto ({values.descontoPercentual}%):</span>
                      <span>- {formatCurrency(values.descontoValor, values.currency)}</span>
                    </div>
                  )}
                  {values.upliftPercentual && values.upliftPercentual > 0 && (
                    <div className="flex justify-between text-blue-700">
                      <span>Uplift ({values.upliftPercentual}%):</span>
                      <span>+ {formatCurrency(values.upliftValor, values.currency)}</span>
                    </div>
                  )}
                  {values.taxaPercentual && values.taxaPercentual > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa ({values.taxaPercentual}%):</span>
                      <span>{formatCurrency(values.taxaValor, values.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                    <span>Valor Total:</span>
                    <span className="text-lg">{formatCurrency(values.valorTotal, values.currency)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-6">
          <div className="text-center text-muted-foreground">
            <Settings className="mx-auto h-12 w-12 mb-2" />
            <p>Gestão de pré-requisitos e entregáveis será implementada em versões futuras.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Termos e Observações */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="termos">Termos e Condições</Label>
          <Textarea
            id="termos"
            value={values.termos}
            onChange={(e) => update("termos", e.target.value)}
            placeholder="Termos e condições da cotação..."
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            value={values.observacoes}
            onChange={(e) => update("observacoes", e.target.value)}
            placeholder="Observações adicionais..."
            className="min-h-[120px]"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-cyan-800 hover:bg-cyan-800/10">
          Cancelar
        </Button>
        <Button type="submit" className="bg-cyan-800 text-white hover:bg-cyan-700">
          {mode === "create" ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Criar Cotação
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Guardar Alterações
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
