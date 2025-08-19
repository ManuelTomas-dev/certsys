"use client"
import { useState } from "react"
import type React from "react"

import type { SQMRecord } from "@/types/qhse"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface SQMFormProps {
  record?: SQMRecord
  onSubmit: (data: Partial<SQMRecord>) => void
  onCancel: () => void
}

export function SQMForm({ record, onSubmit, onCancel }: SQMFormProps) {
  const [formData, setFormData] = useState({
    supplierName: record?.supplierName || "",
    supplierCode: record?.supplierCode || "",
    category: record?.category || "",
    evaluationDate: record?.evaluationDate || new Date().toISOString().split("T")[0],
    evaluator: record?.evaluator || "",
    status: record?.status || "under-review",
    comments: record?.comments || "",
    nextEvaluationDate: record?.nextEvaluationDate || "",
  })

  const [qualityScore, setQualityScore] = useState([record?.qualityScore || 75])
  const [deliveryScore, setDeliveryScore] = useState([record?.deliveryScore || 75])
  const [serviceScore, setServiceScore] = useState([record?.serviceScore || 75])

  const overallScore = Math.round((qualityScore[0] + deliveryScore[0] + serviceScore[0]) / 3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      qualityScore: qualityScore[0],
      deliveryScore: deliveryScore[0],
      serviceScore: serviceScore[0],
      overallScore,
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusFromScore = (score: number) => {
    if (score >= 80) return "approved"
    if (score >= 60) return "conditional"
    return "rejected"
  }

  // Auto-update status based on overall score
  const { useEffect } = require("react")
  useEffect(() => {
    const suggestedStatus = getStatusFromScore(overallScore)
    if (formData.status === "under-review") {
      setFormData({ ...formData, status: suggestedStatus })
    }
  }, [overallScore])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="supplierName">Nome do Fornecedor</Label>
          <Input
            id="supplierName"
            value={formData.supplierName}
            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
            placeholder="Fornecedor ABC Ltda"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplierCode">Código do Fornecedor</Label>
          <Input
            id="supplierCode"
            value={formData.supplierCode}
            onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
            placeholder="SUP001"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Matéria Prima"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="evaluator">Avaliador</Label>
          <Input
            id="evaluator"
            value={formData.evaluator}
            onChange={(e) => setFormData({ ...formData, evaluator: e.target.value })}
            placeholder="Equipe de Qualidade"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="evaluationDate">Data da Avaliação</Label>
          <Input
            id="evaluationDate"
            type="date"
            value={formData.evaluationDate}
            onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextEvaluationDate">Próxima Avaliação</Label>
          <Input
            id="nextEvaluationDate"
            type="date"
            value={formData.nextEvaluationDate}
            onChange={(e) => setFormData({ ...formData, nextEvaluationDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Scoring Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliação de Desempenho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quality Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Qualidade</Label>
              <span className={`text-lg font-bold ${getScoreColor(qualityScore[0])}`}>{qualityScore[0]}</span>
            </div>
            <Slider
              value={qualityScore}
              onValueChange={setQualityScore}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Delivery Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Entrega</Label>
              <span className={`text-lg font-bold ${getScoreColor(deliveryScore[0])}`}>{deliveryScore[0]}</span>
            </div>
            <Slider
              value={deliveryScore}
              onValueChange={setDeliveryScore}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Service Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Atendimento</Label>
              <span className={`text-lg font-bold ${getScoreColor(serviceScore[0])}`}>{serviceScore[0]}</span>
            </div>
            <Slider
              value={serviceScore}
              onValueChange={setServiceScore}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Overall Score */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Pontuação Geral</Label>
              <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="conditional">Condicional</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
            <SelectItem value="under-review">Em Revisão</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comentários</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="Observações sobre o desempenho do fornecedor..."
          rows={4}
          required
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{record ? "Atualizar" : "Criar"} Avaliação</Button>
      </div>
    </form>
  )
}
