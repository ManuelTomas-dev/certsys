"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import type { Enquiry, ServiceType, EnquiryStatus, Priority, EnquiryOrigin, Probability } from "@/types/enquiries"
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
import { tiposServico, statusEnquiry, prioridades, origens, probabilidades } from "@/lib/mock-enquiries"
import { Edit, Plus, Lightbulb, TrendingUp, Clock, Phone, MapPin, User } from "lucide-react"

export type EnquiryFormValues = {
  titulo: string
  origem: EnquiryOrigin
  data: string
  equipaVenda: string
  descricao: string
  notas?: string
  nomeCliente: string
  localizacaoCliente: string
  contactoCliente: string
  probabilidade: Probability

  // Campos adicionais
  tipoServico: ServiceType
  prioridade: Priority
  status: EnquiryStatus
  dataLimite?: string
  valorEstimado?: number
  responsavelId?: string
}

type Props = {
  initial?: Enquiry
  clients?: Client[]
  workLocations?: WorkLocation[]
  personnel?: Personnel[]
  mode?: "create" | "edit"
  onSubmit?: (values: EnquiryFormValues) => void
  onCancel?: () => void
}

const equipasVenda = [
  "Equipa Norte",
  "Equipa Sul",
  "Equipa Centro",
  "Equipa Offshore",
  "Equipa Industrial",
  "Equipa Comercial A",
  "Equipa Comercial B",
]

export function EnquiryForm({
  initial,
  clients = [],
  workLocations = [],
  personnel = [],
  mode = "create",
  onSubmit = () => {},
  onCancel = () => {},
}: Props) {
  const [values, setValues] = useState<EnquiryFormValues>(() => ({
    titulo: initial?.titulo ?? "",
    origem: initial?.origem ?? "Website",
    data: initial?.data ?? new Date().toISOString().slice(0, 10),
    equipaVenda: initial?.equipaVenda ?? equipasVenda[0],
    descricao: initial?.descricao ?? "",
    notas: initial?.notas ?? "",
    nomeCliente: initial?.nomeCliente ?? "",
    localizacaoCliente: initial?.localizacaoCliente ?? "",
    contactoCliente: initial?.contactoCliente ?? "",
    probabilidade: initial?.probabilidade ?? 50,

    tipoServico: initial?.tipoServico ?? "Inspeção",
    prioridade: initial?.prioridade ?? "Média",
    status: initial?.status ?? "Nova",
    dataLimite: initial?.dataLimite ?? "",
    valorEstimado: initial?.valorEstimado ?? undefined,
    responsavelId: initial?.responsavelId ?? "default-responsavel-id",
  }))

  useEffect(() => {
    if (initial) {
      setValues({
        titulo: initial.titulo,
        origem: initial.origem,
        data: initial.data,
        equipaVenda: initial.equipaVenda,
        descricao: initial.descricao,
        notas: initial.notas,
        nomeCliente: initial.nomeCliente,
        localizacaoCliente: initial.localizacaoCliente,
        contactoCliente: initial.contactoCliente,
        probabilidade: initial.probabilidade,

        tipoServico: initial.tipoServico,
        prioridade: initial.prioridade,
        status: initial.status,
        dataLimite: initial.dataLimite,
        valorEstimado: initial.valorEstimado,
        responsavelId: initial.responsavelId ?? "default-responsavel-id",
      })
    }
  }, [initial])

  function update<K extends keyof EnquiryFormValues>(key: K, val: EnquiryFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  // Filtrar responsáveis (pessoal comercial/técnico)
  const responsaveis = useMemo(() => {
    return personnel.filter(
      (p) =>
        p.funcao.toLowerCase().includes("coordenador") ||
        p.funcao.toLowerCase().includes("supervisor") ||
        p.funcao.toLowerCase().includes("engenheiro") ||
        p.funcao.toLowerCase().includes("gestor") ||
        p.funcao.toLowerCase().includes("comercial"),
    )
  }, [personnel])

  // Sugestões inteligentes baseadas na origem
  const suggestions = useMemo(() => {
    const suggestions = []

    if (values.origem === "Website") {
      suggestions.push("Solicitação de Cotação Online")
      suggestions.push("Consulta sobre Certificação")
    }
    if (values.origem === "Telefone") {
      suggestions.push("Consulta Telefónica - Inspeção")
      suggestions.push("Pedido de Informações")
    }
    if (values.origem === "Email") {
      suggestions.push("Solicitação por Email")
      suggestions.push("Proposta de Parceria")
    }
    if (values.origem === "Referência") {
      suggestions.push("Indicação de Cliente")
      suggestions.push("Recomendação de Parceiro")
    }

    return suggestions
  }, [values.origem])

  // Cálculo automático de valor estimado baseado no tipo de serviço
  const estimatedValue = useMemo(() => {
    const baseValues = {
      Inspeção: 75000,
      Certificação: 200000,
      Auditoria: 150000,
      Consultoria: 300000,
      Treinamento: 120000,
    }
    return baseValues[values.tipoServico]
  }, [values.tipoServico])

  // Auto-sugerir valor quando tipo de serviço muda
  useEffect(() => {
    if (mode === "create" && !values.valorEstimado) {
      setValues((prev) => ({ ...prev, valorEstimado: estimatedValue }))
    }
  }, [values.tipoServico, estimatedValue, mode, values.valorEstimado])

  // Calcular data limite sugerida baseada na prioridade
  const suggestedDeadline = useMemo(() => {
    const today = new Date()
    const days = {
      Crítica: 7,
      Alta: 14,
      Média: 30,
      Baixa: 60,
    }
    const deadline = new Date(today.getTime() + days[values.prioridade] * 24 * 60 * 60 * 1000)
    return deadline.toISOString().slice(0, 10)
  }, [values.prioridade])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Sugestões Inteligentes */}
      {suggestions.length > 0 && (
        <Card className="border-cyan-800/20 bg-cyan-800/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Sugestões de Título
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-cyan-800/10 border-cyan-800/30 text-cyan-800"
                  onClick={() => update("titulo", suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações Básicas da Enquiry */}
      <Card className="border-cyan-800/10">
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800">Informações da Enquiry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={values.titulo}
                onChange={(e) => update("titulo", e.target.value)}
                placeholder="Ex.: Inspeção de Vasos de Pressão"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="origem">Origem *</Label>
              <Select value={values.origem} onValueChange={(v: EnquiryOrigin) => update("origem", v)}>
                <SelectTrigger id="origem" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  {origens.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={values.data}
                onChange={(e) => update("data", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="equipaVenda">Equipa de Venda *</Label>
              <Select value={values.equipaVenda} onValueChange={(v) => update("equipaVenda", v)}>
                <SelectTrigger id="equipaVenda" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Selecione a equipa" />
                </SelectTrigger>
                <SelectContent>
                  {equipasVenda.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição da Enquiry *</Label>
            <Textarea
              id="descricao"
              value={values.descricao}
              onChange={(e) => update("descricao", e.target.value)}
              placeholder="Descreva detalhadamente a solicitação do cliente..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notas">Notas Internas</Label>
            <Textarea
              id="notas"
              value={values.notas}
              onChange={(e) => update("notas", e.target.value)}
              placeholder="Observações internas, histórico de contatos..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações do Cliente */}
      <Card className="border-cyan-800/10">
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <User className="h-4 w-4" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
            <Input
              id="nomeCliente"
              value={values.nomeCliente}
              onChange={(e) => update("nomeCliente", e.target.value)}
              placeholder="Ex.: Sonangol EP"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="localizacaoCliente" className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Localização do Cliente *
              </Label>
              <Input
                id="localizacaoCliente"
                value={values.localizacaoCliente}
                onChange={(e) => update("localizacaoCliente", e.target.value)}
                placeholder="Ex.: Luanda, Angola"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactoCliente" className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                Contacto do Cliente *
              </Label>
              <Input
                id="contactoCliente"
                value={values.contactoCliente}
                onChange={(e) => update("contactoCliente", e.target.value)}
                placeholder="Ex.: +244 923 456 789 ou email@cliente.ao"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes Técnicos e Comerciais */}
      <Card className="border-cyan-800/10">
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Detalhes Técnicos e Comerciais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="tipoServico">Tipo de Serviço *</Label>
              <Select value={values.tipoServico} onValueChange={(v: ServiceType) => update("tipoServico", v)}>
                <SelectTrigger id="tipoServico" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServico.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prioridade">Prioridade *</Label>
              <Select value={values.prioridade} onValueChange={(v: Priority) => update("prioridade", v)}>
                <SelectTrigger id="prioridade" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {prioridades.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="probabilidade">Probabilidade *</Label>
              <Select
                value={values.probabilidade.toString()}
                onValueChange={(v) => update("probabilidade", Number(v) as Probability)}
              >
                <SelectTrigger id="probabilidade" className="focus:ring-cyan-700">
                  <SelectValue placeholder="%" />
                </SelectTrigger>
                <SelectContent>
                  {probabilidades.map((p) => (
                    <SelectItem key={p} value={p.toString()}>
                      {p}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={values.status} onValueChange={(v: EnquiryStatus) => update("status", v)}>
                <SelectTrigger id="status" className="focus:ring-cyan-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusEnquiry.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dataLimite" className="flex items-center gap-2">
                Data Limite
                <Clock className="h-3 w-3 text-cyan-800/70" />
              </Label>
              <Input
                id="dataLimite"
                type="date"
                value={values.dataLimite}
                onChange={(e) => update("dataLimite", e.target.value)}
                placeholder={suggestedDeadline}
              />
              <p className="text-xs text-muted-foreground">
                Sugerido: {new Date(suggestedDeadline).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="valorEstimado">Valor Estimado (AOA)</Label>
              <Input
                id="valorEstimado"
                type="number"
                value={values.valorEstimado || ""}
                onChange={(e) => update("valorEstimado", e.target.value ? Number(e.target.value) : undefined)}
                placeholder={estimatedValue.toString()}
              />
              <p className="text-xs text-muted-foreground">Sugerido: {estimatedValue.toLocaleString()} AOA</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="responsavelId">Responsável</Label>
            <Select value={values.responsavelId} onValueChange={(v) => update("responsavelId", v)}>
              <SelectTrigger id="responsavelId" className="focus:ring-cyan-700">
                <SelectValue placeholder="Atribuir responsável (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default-responsavel-id">Sem responsável definido</SelectItem>
                {responsaveis.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome} {p.sobrenome} - {p.funcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-cyan-800 hover:bg-cyan-800/10">
          Cancelar
        </Button>
        <Button type="submit" className="bg-cyan-800 text-white hover:bg-cyan-700">
          {mode === "create" ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Enquiry
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
