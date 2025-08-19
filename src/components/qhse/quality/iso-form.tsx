"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import type { ISODocument } from "@/types/qhse"

interface ISOFormProps {
  document?: ISODocument
  onSubmit: (data: Partial<ISODocument>) => void
  onCancel: () => void
}

export function ISOForm({ document, onSubmit, onCancel }: ISOFormProps) {
  const [formData, setFormData] = useState({
    documentNumber: document?.documentNumber || "",
    title: document?.title || "",
    version: document?.version || "1.0",
    category: document?.category || "procedure",
    department: document?.department || "",
    owner: document?.owner || "",
    approver: document?.approver || "",
    effectiveDate: document?.effectiveDate || new Date().toISOString().split("T")[0],
    reviewDate: document?.reviewDate || "",
    status: document?.status || "draft",
    filePath: document?.filePath || "",
  })

  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to a server
      // For now, we'll just store the file name
      setFormData({ ...formData, filePath: file.name })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="documentNumber">Número do Documento</Label>
          <Input
            id="documentNumber"
            value={formData.documentNumber}
            onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
            placeholder="ISO-QUA-001"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="version">Versão</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            placeholder="1.0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título do Documento</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Procedimento de Controle de Qualidade"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="procedure">Procedimento</SelectItem>
              <SelectItem value="policy">Política</SelectItem>
              <SelectItem value="form">Formulário</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Qualidade"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="owner">Responsável</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            placeholder="Nome do responsável"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="approver">Aprovador</Label>
          <Input
            id="approver"
            value={formData.approver}
            onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
            placeholder="Nome do aprovador"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="effectiveDate">Data de Vigência</Label>
          <Input
            id="effectiveDate"
            type="date"
            value={formData.effectiveDate}
            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewDate">Data de Revisão</Label>
          <Input
            id="reviewDate"
            type="date"
            value={formData.reviewDate}
            onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="under-review">Em Revisão</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="obsolete">Obsoleto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o propósito e escopo do documento..."
          rows={4}
        />
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Arquivo do Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
            {formData.filePath && (
              <div className="text-sm text-green-600">Arquivo selecionado: {formData.filePath}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{document ? "Atualizar" : "Criar"} Documento</Button>
      </div>
    </form>
  )
}
