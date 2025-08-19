"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import type { InspectionRecord } from "@/types/qhse"

interface InspectionFormProps {
  inspection?: InspectionRecord
  onSubmit: (data: Partial<InspectionRecord>) => void
  onCancel: () => void
}

export function InspectionForm({ inspection, onSubmit, onCancel }: InspectionFormProps) {
  const [formData, setFormData] = useState({
    equipmentId: inspection?.equipmentId || "",
    equipmentName: inspection?.equipmentName || "",
    inspectionType: inspection?.inspectionType || "routine",
    inspector: inspection?.inspector || "",
    date: inspection?.date || new Date().toISOString().split("T")[0],
    status: inspection?.status || "pending",
    riskAssessment: "",
    nextInspectionDate: inspection?.nextInspectionDate || "",
  })

  const [findings, setFindings] = useState<string[]>(inspection?.findings || [""])
  const [recommendations, setRecommendations] = useState<string[]>(inspection?.recommendations || [""])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      findings: findings.filter((f) => f.trim()),
      recommendations: recommendations.filter((r) => r.trim()),
    })
  }

  const addFinding = () => setFindings([...findings, ""])
  const removeFinding = (index: number) => setFindings(findings.filter((_, i) => i !== index))
  const updateFinding = (index: number, value: string) => {
    const updated = [...findings]
    updated[index] = value
    setFindings(updated)
  }

  const addRecommendation = () => setRecommendations([...recommendations, ""])
  const removeRecommendation = (index: number) => setRecommendations(recommendations.filter((_, i) => i !== index))
  const updateRecommendation = (index: number, value: string) => {
    const updated = [...recommendations]
    updated[index] = value
    setRecommendations(updated)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="equipmentId">ID do Equipamento</Label>
          <Input
            id="equipmentId"
            value={formData.equipmentId}
            onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
            placeholder="EQ001"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="equipmentName">Nome do Equipamento</Label>
          <Input
            id="equipmentName"
            value={formData.equipmentName}
            onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
            placeholder="Compressor Principal"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="inspectionType">Tipo de Inspeção</Label>
          <Select
            value={formData.inspectionType}
            onValueChange={(value) => setFormData({ ...formData, inspectionType: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="routine">Rotina</SelectItem>
              <SelectItem value="preventive">Preventiva</SelectItem>
              <SelectItem value="corrective">Corretiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="inspector">Inspetor</Label>
          <Input
            id="inspector"
            value={formData.inspector}
            onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
            placeholder="Nome do inspetor"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data da Inspeção</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="failed">Falhou</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextInspectionDate">Próxima Inspeção</Label>
          <Input
            id="nextInspectionDate"
            type="date"
            value={formData.nextInspectionDate}
            onChange={(e) => setFormData({ ...formData, nextInspectionDate: e.target.value })}
          />
        </div>
      </div>

      {/* Findings Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Constatações</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addFinding}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {findings.map((finding, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={finding}
                onChange={(e) => updateFinding(index, e.target.value)}
                placeholder="Descreva a constatação..."
                className="flex-1"
                rows={2}
              />
              {findings.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFinding(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recomendações</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addRecommendation}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={recommendation}
                onChange={(e) => updateRecommendation(index, e.target.value)}
                placeholder="Descreva a recomendação..."
                className="flex-1"
                rows={2}
              />
              {recommendations.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeRecommendation(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{inspection ? "Atualizar" : "Criar"} Inspeção</Button>
      </div>
    </form>
  )
}
