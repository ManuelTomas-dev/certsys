"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import type { WorkLocation, WorkLocationType } from "@/types/work-locations"
import type { Client } from "@/types/customers"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tiposWorkLocation } from "@/lib/mock-work-locations"
import { Edit, Plus } from "lucide-react"

export type WorkLocationFormValues = {
  clientId: string
  nome: string
  tipo: WorkLocationType
  pais: string
  cidade: string
  endereco: string
  latitude?: string
  longitude?: string
  responsavelNome?: string
  responsavelEmail?: string
  responsavelTelefone?: string
  observacoes?: string
}

type Props = {
  initial?: WorkLocation
  clients?: Client[]
  mode?: "create" | "edit"
  onSubmit?: (values: WorkLocationFormValues) => void
  onCancel?: () => void
}
export function WorkLocationForm({
  initial,
  clients = [],
  mode = "create",
  onSubmit = () => {},
  onCancel = () => {},
}: Props) {
  const [values, setValues] = useState<WorkLocationFormValues>(() => ({
    clientId: initial?.clientId ?? clients[0]?.id ?? "",
    nome: initial?.nome ?? "",
    tipo: initial?.tipo ?? "Onshore",
    pais: initial?.pais ?? "",
    cidade: initial?.cidade ?? "",
    endereco: initial?.endereco ?? "",
    latitude: initial?.latitude ?? "",
    longitude: initial?.longitude ?? "",
    responsavelNome: initial?.responsavelNome ?? "",
    responsavelEmail: initial?.responsavelEmail ?? "",
    responsavelTelefone: initial?.responsavelTelefone ?? "",
    observacoes: initial?.observacoes ?? "",
  }))

  useEffect(() => {
    if (initial) {
      setValues({
        clientId: initial.clientId,
        nome: initial.nome,
        tipo: initial.tipo,
        pais: initial.pais,
        cidade: initial.cidade,
        endereco: initial.endereco,
        latitude: initial.latitude,
        longitude: initial.longitude,
        responsavelNome: initial.responsavelNome,
        responsavelEmail: initial.responsavelEmail,
        responsavelTelefone: initial.responsavelTelefone,
        observacoes: initial.observacoes,
      })
    }
  }, [initial])

  function update<K extends keyof WorkLocationFormValues>(key: K, val: WorkLocationFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const clientName = useMemo(
    () => clients.find((c) => c.id === values.clientId)?.nome ?? "",
    [clients, values.clientId],
  )

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
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
          <Label htmlFor="tipo">Tipo</Label>
          <Select value={values.tipo} onValueChange={(v: WorkLocationType) => update("tipo", v)}>
            <SelectTrigger id="tipo" className="focus:ring-cyan-700">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposWorkLocation.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome do Local</Label>
          <Input id="nome" value={values.nome} onChange={(e) => update("nome", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" value={values.endereco} onChange={(e) => update("endereco", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="pais">País</Label>
          <Input id="pais" value={values.pais} onChange={(e) => update("pais", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" value={values.cidade} onChange={(e) => update("cidade", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" value={values.latitude} onChange={(e) => update("latitude", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" value={values.longitude} onChange={(e) => update("longitude", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="responsavelNome">Responsável</Label>
          <Input
            id="responsavelNome"
            value={values.responsavelNome}
            onChange={(e) => update("responsavelNome", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="responsavelTelefone">Telefone</Label>
          <Input
            id="responsavelTelefone"
            value={values.responsavelTelefone}
            onChange={(e) => update("responsavelTelefone", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="responsavelEmail">E-mail</Label>
          <Input
            id="responsavelEmail"
            type="email"
            value={values.responsavelEmail}
            onChange={(e) => update("responsavelEmail", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            value={values.observacoes}
            onChange={(e) => update("observacoes", e.target.value)}
            className="min-h-[96px]"
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
