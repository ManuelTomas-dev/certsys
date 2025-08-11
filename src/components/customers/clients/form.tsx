"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Client } from "@/types/customers"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Edit, Plus } from "lucide-react"

export type ClientFormValues = {
  nome: string
  nif: string
  email: string
  telefone: string
  website?: string
  pais: string
  cidade: string
  endereco: string
  segmento?: string
  observacoes?: string
}

type Props = {
  initial?: Client
  mode?: "create" | "edit"
  onSubmit?: (values: ClientFormValues) => void
  onCancel?: () => void
}
export function ClientForm({ initial, mode = "create", onSubmit = () => {}, onCancel = () => {} }: Props) {
  const [values, setValues] = useState<ClientFormValues>(() => ({
    nome: initial?.nome ?? "",
    nif: initial?.nif ?? "",
    email: initial?.email ?? "",
    telefone: initial?.telefone ?? "",
    website: initial?.website ?? "",
    pais: initial?.pais ?? "",
    cidade: initial?.cidade ?? "",
    endereco: initial?.endereco ?? "",
    segmento: initial?.segmento ?? "",
    observacoes: initial?.observacoes ?? "",
  }))

  useEffect(() => {
    if (initial) {
      setValues({
        nome: initial.nome,
        nif: initial.nif,
        email: initial.email,
        telefone: initial.telefone,
        website: initial.website,
        pais: initial.pais,
        cidade: initial.cidade,
        endereco: initial.endereco,
        segmento: initial.segmento,
        observacoes: initial.observacoes,
      })
    }
  }, [initial])

  function update<K extends keyof ClientFormValues>(key: K, val: ClientFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nome">Cliente</Label>
          <Input id="nome" value={values.nome} onChange={(e) => update("nome", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nif">NIF</Label>
          <Input id="nif" value={values.nif} onChange={(e) => update("nif", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" value={values.telefone} onChange={(e) => update("telefone", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://..."
          />
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
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="segmento">Segmento</Label>
          <Input
            id="segmento"
            value={values.segmento}
            onChange={(e) => update("segmento", e.target.value)}
            placeholder="Oil & Gas, Engenharia..."
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="endereco">Endereço</Label>
        <Input id="endereco" value={values.endereco} onChange={(e) => update("endereco", e.target.value)} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={values.observacoes}
          onChange={(e) => update("observacoes", e.target.value)}
          placeholder="Notas, termos comerciais, particularidades..."
          className="min-h-[100px]"
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
