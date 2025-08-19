"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, TrendingUp, Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import type { NonConformRecord } from "@/types/qhse"
import { mockNonConformRecords } from "@/lib/qhse-data"

export default function NonConformPage() {
  const [nonConforms, setNonConforms] = useState<NonConformRecord[]>(mockNonConformRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [selectedNC, setSelectedNC] = useState<NonConformRecord | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredNCs = nonConforms.filter((nc) => {
    const matchesSearch =
      nc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.ncNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.detectedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || nc.status === statusFilter
    const matchesSeverity = severityFilter === "all" || nc.severity === severityFilter
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const getStatusColor = (status: NonConformRecord["status"]) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "corrective-action":
        return "bg-blue-100 text-blue-800"
      case "verification":
        return "bg-purple-100 text-purple-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: NonConformRecord["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "major":
        return "bg-orange-100 text-orange-800"
      case "minor":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEffectivenessColor = (effectiveness: NonConformRecord["effectiveness"]) => {
    switch (effectiveness) {
      case "effective":
        return "bg-green-100 text-green-800"
      case "partially-effective":
        return "bg-yellow-100 text-yellow-800"
      case "not-effective":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: nonConforms.length,
    open: nonConforms.filter((nc) => ["open", "investigating", "corrective-action"].includes(nc.status)).length,
    critical: nonConforms.filter((nc) => nc.severity === "critical").length,
    closed: nonConforms.filter((nc) => nc.status === "closed").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Não Conformidades</h1>
          <p className="text-muted-foreground">Gestão de não conformidades e ações corretivas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Não Conformidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Não Conformidade</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ncNumber">Número da NC</Label>
                  <Input id="ncNumber" placeholder="NC-2024-001" />
                </div>
                <div>
                  <Label htmlFor="severity">Severidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a severidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Menor</SelectItem>
                      <SelectItem value="major">Maior</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Título da não conformidade" />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" placeholder="Descreva a não conformidade detalhadamente" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input id="location" placeholder="Local onde foi detectada" />
                </div>
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" placeholder="Departamento responsável" />
                </div>
              </div>
              <div>
                <Label htmlFor="immediateAction">Ação Imediata</Label>
                <Textarea id="immediateAction" placeholder="Ação imediata tomada" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Criar NC</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar não conformidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="open">Aberta</SelectItem>
                <SelectItem value="investigating">Investigando</SelectItem>
                <SelectItem value="corrective-action">Ação Corretiva</SelectItem>
                <SelectItem value="verification">Verificação</SelectItem>
                <SelectItem value="closed">Fechada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Severidades</SelectItem>
                <SelectItem value="minor">Menor</SelectItem>
                <SelectItem value="major">Maior</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Non-Conformities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Não Conformidades ({filteredNCs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Número</th>
                  <th className="text-left p-2">Título</th>
                  <th className="text-left p-2">Severidade</th>
                  <th className="text-left p-2">Departamento</th>
                  <th className="text-left p-2">Data Detecção</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Eficácia</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredNCs.map((nc) => (
                  <tr key={nc.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{nc.ncNumber}</td>
                    <td className="p-2">{nc.title}</td>
                    <td className="p-2">
                      <Badge className={getSeverityColor(nc.severity)}>
                        {nc.severity === "critical" ? "Crítica" : nc.severity === "major" ? "Maior" : "Menor"}
                      </Badge>
                    </td>
                    <td className="p-2">{nc.department}</td>
                    <td className="p-2">{new Date(nc.detectionDate).toLocaleDateString("pt-BR")}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(nc.status)}>
                        {nc.status === "open"
                          ? "Aberta"
                          : nc.status === "investigating"
                            ? "Investigando"
                            : nc.status === "corrective-action"
                              ? "Ação Corretiva"
                              : nc.status === "verification"
                                ? "Verificação"
                                : "Fechada"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getEffectivenessColor(nc.effectiveness)}>
                        {nc.effectiveness === "effective"
                          ? "Eficaz"
                          : nc.effectiveness === "partially-effective"
                            ? "Parcialmente"
                            : nc.effectiveness === "not-effective"
                              ? "Não Eficaz"
                              : "Pendente"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedNC(nc)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Não Conformidade</DialogTitle>
          </DialogHeader>
          {selectedNC && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Número</Label>
                  <p className="text-sm text-muted-foreground">{selectedNC.ncNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Severidade</Label>
                  <Badge className={getSeverityColor(selectedNC.severity)}>
                    {selectedNC.severity === "critical"
                      ? "Crítica"
                      : selectedNC.severity === "major"
                        ? "Maior"
                        : "Menor"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <p className="text-sm text-muted-foreground">{selectedNC.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <p className="text-sm text-muted-foreground">{selectedNC.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Análise de Causa Raiz</Label>
                <div className="mt-2 p-3 border rounded">
                  <p className="text-sm">
                    <strong>Método:</strong> {selectedNC.rootCauseAnalysis.method}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Análise:</strong> {selectedNC.rootCauseAnalysis.analysis}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Causa Raiz:</strong> {selectedNC.rootCauseAnalysis.rootCause}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Ações Corretivas ({selectedNC.correctiveActions.length})</Label>
                <div className="space-y-2 mt-2">
                  {selectedNC.correctiveActions.map((action, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium">{action.action}</p>
                        <Badge
                          className={
                            action.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : action.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {action.status === "completed"
                            ? "Concluída"
                            : action.status === "in-progress"
                              ? "Em Andamento"
                              : "Planejada"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Responsável: {action.responsible}</p>
                      <p className="text-sm text-muted-foreground">
                        Data Alvo: {new Date(action.targetDate).toLocaleDateString("pt-BR")}
                      </p>
                      {action.completionDate && (
                        <p className="text-sm text-muted-foreground">
                          Data Conclusão: {new Date(action.completionDate).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { NonConformPage as NonConform }
