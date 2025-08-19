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
import type { LiftingOperation } from "@/types/qhse"

interface LiftingFormProps {
  operation?: LiftingOperation
  onSubmit: (data: Partial<LiftingOperation>) => void
  onCancel: () => void
}

export function LiftingForm({ operation, onSubmit, onCancel }: LiftingFormProps) {
  const [formData, setFormData] = useState({
    operationName: operation?.operationName || "",
    location: operation?.location || "",
    liftingEquipment: operation?.liftingEquipment || "",
    operator: operation?.operator || "",
    supervisor: operation?.supervisor || "",
    plannedDate: operation?.plannedDate || new Date().toISOString().split("T")[0],
    actualDate: operation?.actualDate || "",
    weight: operation?.weight || 0,
    height: operation?.height || 0,
    status: operation?.status || "planned",
    riskAssessment: operation?.riskAssessment || "",
  })

  const [safetyMeasures, setSafetyMeasures] = useState<string[]>(operation?.safetyMeasures || [""])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      safetyMeasures: safetyMeasures.filter((m) => m.trim()),
    })
  }

  const addSafetyMeasure = () => setSafetyMeasures([...safetyMeasures, ""])
  const removeSafetyMeasure = (index: number) => setSafetyMeasures(safetyMeasures.filter((_, i) => i !== index))
  const updateSafetyMeasure = (index: number, value: string) => {
    const updated = [...safetyMeasures]
    updated[index] = value
    setSafetyMeasures(updated)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="operationName">Nome da Operação</Label>
          <Input
            id="operationName"
            value={formData.operationName}
            onChange={(e) => setFormData({ ...formData, operationName: e.target.value })}
            placeholder="Instalação de Estrutura Metálica"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Área de Produção A"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="liftingEquipment">Equipamento de Elevação</Label>
          <Input
            id="liftingEquipment"
            value={formData.liftingEquipment}
            onChange={(e) => setFormData({ ...formData, liftingEquipment: e.target.value })}
            placeholder="Guindaste 50T"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planejada</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="operator">Operador</Label>
          <Input
            id="operator"
            value={formData.operator}
            onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
            placeholder="Nome do operador"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supervisor">Supervisor</Label>
          <Input
            id="supervisor"
            value={formData.supervisor}
            onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
            placeholder="Nome do supervisor"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plannedDate">Data Planejada</Label>
          <Input
            id="plannedDate"
            type="date"
            value={formData.plannedDate}
            onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="actualDate">Data Real</Label>
          <Input
            id="actualDate"
            type="date"
            value={formData.actualDate}
            onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
            placeholder="2500"
            min="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Altura (m)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
            placeholder="15"
            min="0"
            step="0.1"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="riskAssessment">Avaliação de Risco</Label>
        <Textarea
          id="riskAssessment"
          value={formData.riskAssessment}
          onChange={(e) => setFormData({ ...formData, riskAssessment: e.target.value })}
          placeholder="Descreva a avaliação de risco da operação..."
          rows={3}
          required
        />
      </div>

      {/* Safety Measures Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Medidas de Segurança</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addSafetyMeasure}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {safetyMeasures.map((measure, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={measure}
                onChange={(e) => updateSafetyMeasure(index, e.target.value)}
                placeholder="Descreva a medida de segurança..."
                className="flex-1"
              />
              {safetyMeasures.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSafetyMeasure(index)}>
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
        <Button type="submit">{operation ? "Atualizar" : "Criar"} Operação</Button>
      </div>
    </form>
  )
}
