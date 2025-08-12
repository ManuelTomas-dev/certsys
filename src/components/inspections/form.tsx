"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import type { Inspection, InspectionType, InspectionStatus, InspectionResult } from "@/types/inspections"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tiposInspection, statusInspection, resultadosInspection } from "@/lib/mock-inspections"
import { Edit, Plus } from "lucide-react"

export type InspectionFormValues = {
  clientId: string
  workLocationId: string
  inspectorId: string
  tipo: InspectionType
  equipamento: string
  dataInspecao: string
  proximaInspecao?: string
  status: InspectionStatus
  normasAplicaveis: string
  resultado?: InspectionResult
  observacoes?: string
}

type Props = {
  initial?: Inspection
  clients?: Client[]
  workLocations?: WorkLocation[]
  personnel?: Personnel[]
  mode?: "create" | "edit"
  onSubmit?: (values: InspectionFormValues) => void
  onCancel?: () => void
}

export function InspectionForm({
  initial,
  clients = [],
  workLocations = [],
  personnel = [],
  mode = "create",
  onSubmit = () => {},
  onCancel = () => {},
}: Props) {
  const [values, setValues] = useState<InspectionFormValues>(() => ({
    clientId: initial?.clientId ?? clients[0]?.id ?? "",
    workLocationId: initial?.workLocationId ?? "",
    inspectorId: initial?.inspectorId ?? "",
    tipo: initial?.tipo ?? "Visual",
    equipamento: initial?.equipamento ?? "",
    dataInspecao: initial?.dataInspecao ?? new Date().toISOString().slice(0, 10),
    proximaInspecao: initial?.proximaInspecao ?? "",
    status: initial?.status ?? "Agendada",
    normasAplicaveis: initial?.normasAplicaveis ?? "",
    resultado: initial?.resultado,
    observacoes: initial?.observacoes ?? "",
  }))

  useEffect(() => {
    if (initial) {
      setValues({
        clientId: initial.clientId,
        workLocationId: initial.workLocationId,
        inspectorId: initial.inspectorId,
        tipo: initial.tipo,
        equipamento: initial.equipamento,
        dataInspecao: initial.dataInspecao,
        proximaInspecao: initial.proximaInspecao,
        status: initial.status,
        normasAplicaveis: initial.normasAplicaveis,
        resultado: initial.resultado,
        observacoes: initial.observacoes,
      })
    }
  }, [initial])

  function update<K extends keyof InspectionFormValues>(key: K, val: InspectionFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  // Filtrar locais de trabalho pelo cliente selecionado
  const availableWorkLocations = useMemo(() => {
    if (!values.clientId) return workLocations
    return workLocations.filter((wl) => wl.clientId === values.clientId)
  }, [workLocations, values.clientId])

  // Filtrar inspetores (pessoal com função relacionada a inspeção)
  const inspectors = useMemo(() => {
    return personnel.filter(
      (p) =>
        p.funcao.toLowerCase().includes("inspe") ||
        p.funcao.toLowerCase().includes("técnico") ||
        p.funcao.toLowerCase().includes("ndt") ||
        p.funcao.toLowerCase().includes("engenheiro"),
    )
  }, [personnel])

  // Auto-ajustar work location quando cliente muda
  useEffect(() => {
    if (values.clientId && availableWorkLocations.length > 0) {
      const currentLocationValid = availableWorkLocations.some((wl) => wl.id === values.workLocationId)
      if (!currentLocationValid) {
        setValues((prev) => ({ ...prev, workLocationId: availableWorkLocations[0].id }))
      }
    }
  }, [values.clientId, availableWorkLocations, values.workLocationId])

  // Mostrar campo resultado apenas para status que precisam
  const showResultado = ["Concluída", "Aprovada", "Rejeitada"].includes(values.status)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="clientId">Cliente</Label>
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
          <Select value={values.workLocationId} onValueChange={(v) => update("workLocationId", v)}>
            <SelectTrigger id="workLocationId" className="focus:ring-cyan-700">
              <SelectValue placeholder="Selecione o local" />
            </SelectTrigger>
            <SelectContent>
              {availableWorkLocations.map((wl) => (
                <SelectItem key={wl.id} value={wl.id}>
                  {wl.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="inspectorId">Inspetor</Label>
          <Select value={values.inspectorId} onValueChange={(v) => update("inspectorId", v)}>
            <SelectTrigger id="inspectorId" className="focus:ring-cyan-700">
              <SelectValue placeholder="Selecione o inspetor" />
            </SelectTrigger>
            <SelectContent>
              {inspectors.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nome} {p.sobrenome} - {p.funcao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tipo">Tipo de Inspeção</Label>
          <Select value={values.tipo} onValueChange={(v: InspectionType) => update("tipo", v)}>
            <SelectTrigger id="tipo" className="focus:ring-cyan-700">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposInspection.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={values.status} onValueChange={(v: InspectionStatus) => update("status", v)}>
            <SelectTrigger id="status" className="focus:ring-cyan-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusInspection.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="equipamento">Equipamento</Label>
          <Input
            id="equipamento"
            value={values.equipamento}
            onChange={(e) => update("equipamento", e.target.value)}
            placeholder="Ex.: Vaso de Pressão VP-001"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="normasAplicaveis">Normas Aplicáveis</Label>
          <Input
            id="normasAplicaveis"
            value={values.normasAplicaveis}
            onChange={(e) => update("normasAplicaveis", e.target.value)}
            placeholder="Ex.: API 510, ASME VIII"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="dataInspecao">Data da Inspeção</Label>
          <Input
            id="dataInspecao"
            type="date"
            value={values.dataInspecao}
            onChange={(e) => update("dataInspecao", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="proximaInspecao">Próxima Inspeção</Label>
          <Input
            id="proximaInspecao"
            type="date"
            value={values.proximaInspecao}
            onChange={(e) => update("proximaInspecao", e.target.value)}
          />
        </div>
        {showResultado && (
          <div className="space-y-1.5">
            <Label htmlFor="resultado">Resultado</Label>
            <Select value={values.resultado} onValueChange={(v: InspectionResult) => update("resultado", v)}>
              <SelectTrigger id="resultado" className="focus:ring-cyan-700">
                <SelectValue placeholder="Resultado" />
              </SelectTrigger>
              <SelectContent>
                {resultadosInspection.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={values.observacoes}
          onChange={(e) => update("observacoes", e.target.value)}
          placeholder="Detalhes da inspeção, não conformidades encontradas, ações recomendadas..."
          className="min-h-[120px]"
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-cyan-800 hover:bg-cyan-800/10">
          Cancelar
        </Button>
        <Button type="submit" className="bg-cyan-800 text-white hover:bg-cyan-700">
          {mode === "create" ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar
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
