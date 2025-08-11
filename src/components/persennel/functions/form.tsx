"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { Funcao } from "@/types/functions"
import { Edit, Plus } from "lucide-react"

export type FuncaoFormValues = {
  designacao: string
  descricao: string
}

type Props = {
  initial?: Funcao
  mode?: "create" | "edit"
  onSubmit?: (values: FuncaoFormValues) => void
  onCancel?: () => void
}
export function FuncaoForm({ initial, mode = "create", onSubmit = () => {}, onCancel = () => {} }: Props) {
  const [values, setValues] = useState<FuncaoFormValues>(() => ({
    designacao: initial?.designacao ?? "",
    descricao: initial?.descricao ?? "",
  }))

  useEffect(() => {
    if (initial) {
      setValues({ designacao: initial.designacao, descricao: initial.descricao })
    }
  }, [initial])

  function update<K extends keyof FuncaoFormValues>(key: K, val: FuncaoFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-1">
        <div className="space-y-1.5">
          <Label htmlFor="designacao">Designação da Função</Label>
          <Input
            id="designacao"
            value={values.designacao}
            onChange={(e) => update("designacao", e.target.value)}
            placeholder="Ex.: Especialista NDT"
            required
            className="focus-visible:ring-cyan-700"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={values.descricao}
            onChange={(e) => update("descricao", e.target.value)}
            placeholder="Resuma a responsabilidade e escopo da função..."
            required
            className="min-h-[120px] focus-visible:ring-cyan-700"
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
