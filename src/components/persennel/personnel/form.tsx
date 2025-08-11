"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { Personnel, AccessLevel } from "@/types/personnel"
import { funcoesSeed, localidadesSeed, nivelAcessoOptions, supervisoresSeed } from "@/lib/mock-personnel"
import { Edit, Plus } from "lucide-react"

export type PersonnelFormValues = {
  nome: string
  sobrenome: string
  titulo: string
  dataNascimento: string
  localNascimento: string
  biNumero: string
  inss: string
  validadeDocumento: string
  nivelAcesso: AccessLevel
  supervisor: string
  funcao: string
  nomePai: string
  nomeMae: string
  telefonePessoal: string
  telefoneTrabalho: string
  email: string
  localidade: string
}

type Props = {
  initial?: Personnel
  mode?: "create" | "edit"
  onSubmit?: (values: PersonnelFormValues) => void
  onCancel?: () => void
}
export function PersonnelForm({ initial, mode = "create", onSubmit = () => {}, onCancel = () => {} }: Props) {
  const [values, setValues] = useState<PersonnelFormValues>(() => ({
    nome: initial?.nome ?? "",
    sobrenome: initial?.sobrenome ?? "",
    titulo: initial?.titulo ?? "Sr.",
    dataNascimento: initial?.dataNascimento ?? "",
    localNascimento: initial?.localNascimento ?? "",
    biNumero: initial?.biNumero ?? "",
    inss: initial?.inss ?? "",
    validadeDocumento: initial?.validadeDocumento ?? "",
    nivelAcesso: initial?.nivelAcesso ?? "Leitor",
    supervisor: initial?.supervisor ?? supervisoresSeed[0],
    funcao: initial?.funcao ?? funcoesSeed[0],
    nomePai: initial?.nomePai ?? "",
    nomeMae: initial?.nomeMae ?? "",
    telefonePessoal: initial?.telefonePessoal ?? "",
    telefoneTrabalho: initial?.telefoneTrabalho ?? "",
    email: initial?.email ?? "",
    localidade: initial?.localidade ?? localidadesSeed[0],
  }))

  useEffect(() => {
    if (initial) {
      setValues({
        nome: initial.nome,
        sobrenome: initial.sobrenome,
        titulo: initial.titulo,
        dataNascimento: initial.dataNascimento,
        localNascimento: initial.localNascimento,
        biNumero: initial.biNumero,
        inss: initial.inss,
        validadeDocumento: initial.validadeDocumento,
        nivelAcesso: initial.nivelAcesso,
        supervisor: initial.supervisor,
        funcao: initial.funcao,
        nomePai: initial.nomePai,
        nomeMae: initial.nomeMae,
        telefonePessoal: initial.telefonePessoal,
        telefoneTrabalho: initial.telefoneTrabalho,
        email: initial.email,
        localidade: initial.localidade,
      })
    }
  }, [initial])

  function update<K extends keyof PersonnelFormValues>(key: K, val: PersonnelFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="titulo">Título</Label>
          <Select value={values.titulo} onValueChange={(v) => update("titulo", v)}>
            <SelectTrigger id="titulo" className="focus:ring-cyan-700">
              <SelectValue placeholder="Título" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sr.">Sr.</SelectItem>
              <SelectItem value="Sra.">Sra.</SelectItem>
              <SelectItem value="Dr.">Dr.</SelectItem>
              <SelectItem value="Eng.">Eng.</SelectItem>
              <SelectItem value="Tec.">Tec.</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" value={values.nome} onChange={(e) => update("nome", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sobrenome">Sobrenome</Label>
          <Input
            id="sobrenome"
            value={values.sobrenome}
            onChange={(e) => update("sobrenome", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="dataNascimento">Data de Nascimento</Label>
          <Input
            id="dataNascimento"
            type="date"
            value={values.dataNascimento}
            onChange={(e) => update("dataNascimento", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="localNascimento">Local de Nascimento</Label>
          <Input
            id="localNascimento"
            value={values.localNascimento}
            onChange={(e) => update("localNascimento", e.target.value)}
            placeholder="Luanda"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="localidade">Localidade</Label>
          <Select value={values.localidade} onValueChange={(v) => update("localidade", v)}>
            <SelectTrigger id="localidade" className="focus:ring-cyan-700">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {localidadesSeed.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="biNumero">Nº do BI/Passaporte</Label>
          <Input
            id="biNumero"
            value={values.biNumero}
            onChange={(e) => update("biNumero", e.target.value)}
            placeholder="AO123456"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="validadeDocumento">Validade do Documento</Label>
          <Input
            id="validadeDocumento"
            type="date"
            value={values.validadeDocumento}
            onChange={(e) => update("validadeDocumento", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="inss">INSS</Label>
          <Input id="inss" value={values.inss} onChange={(e) => update("inss", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="nivelAcesso">Nível de Acesso</Label>
          <Select value={values.nivelAcesso} onValueChange={(v: AccessLevel) => update("nivelAcesso", v)}>
            <SelectTrigger id="nivelAcesso" className="focus:ring-cyan-700">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {nivelAcessoOptions.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="supervisor">Supervisor</Label>
          <Select value={values.supervisor} onValueChange={(v) => update("supervisor", v)}>
            <SelectTrigger id="supervisor" className="focus:ring-cyan-700">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {supervisoresSeed.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="funcao">Função</Label>
          <Select value={values.funcao} onValueChange={(v) => update("funcao", v)}>
            <SelectTrigger id="funcao" className="focus:ring-cyan-700">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {funcoesSeed.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nomePai">Nome do Pai</Label>
          <Input id="nomePai" value={values.nomePai} onChange={(e) => update("nomePai", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nomeMae">Nome da Mãe</Label>
          <Input id="nomeMae" value={values.nomeMae} onChange={(e) => update("nomeMae", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="telefonePessoal">Telefone Pessoal</Label>
          <Input
            id="telefonePessoal"
            value={values.telefonePessoal}
            onChange={(e) => update("telefonePessoal", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefoneTrabalho">Telefone de Trabalho</Label>
          <Input
            id="telefoneTrabalho"
            value={values.telefoneTrabalho}
            onChange={(e) => update("telefoneTrabalho", e.target.value)}
          />
        </div>
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
