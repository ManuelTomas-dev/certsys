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
import { Calendar, FileText, Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import type { AuditRecord } from "@/types/qhse"
import { mockAuditRecords } from "@/lib/qhse-data"

export default function AuditPage() {
  const [audits, setAudits] = useState<AuditRecord[]>(mockAuditRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.auditNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.leadAuditor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter
    const matchesType = typeFilter === "all" || audit.auditType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: AuditRecord["status"]) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "draft-report":
        return "bg-orange-100 text-orange-800"
      case "final-report":
        return "bg-purple-100 text-purple-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: AuditRecord["auditType"]) => {
    switch (type) {
      case "internal":
        return "bg-blue-100 text-blue-800"
      case "external":
        return "bg-green-100 text-green-800"
      case "supplier":
        return "bg-orange-100 text-orange-800"
      case "regulatory":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRatingColor = (rating: AuditRecord["overallRating"]) => {
    switch (rating) {
      case "satisfactory":
        return "bg-green-100 text-green-800"
      case "needs-improvement":
        return "bg-yellow-100 text-yellow-800"
      case "unsatisfactory":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: audits.length,
    planned: audits.filter((a) => a.status === "planned").length,
    inProgress: audits.filter((a) => a.status === "in-progress").length,
    completed: audits.filter((a) => a.status === "closed").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Auditorias</h1>
          <p className="text-muted-foreground">Gestão de auditorias internas e externas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Auditoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Auditoria</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="auditNumber">Número da Auditoria</Label>
                  <Input id="auditNumber" placeholder="AUD-2024-001" />
                </div>
                <div>
                  <Label htmlFor="auditType">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Interna</SelectItem>
                      <SelectItem value="external">Externa</SelectItem>
                      <SelectItem value="supplier">Fornecedor</SelectItem>
                      <SelectItem value="regulatory">Regulatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Título da auditoria" />
              </div>
              <div>
                <Label htmlFor="scope">Escopo</Label>
                <Textarea id="scope" placeholder="Descreva o escopo da auditoria" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadAuditor">Auditor Líder</Label>
                  <Input id="leadAuditor" placeholder="Nome do auditor líder" />
                </div>
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" placeholder="Departamento auditado" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Criar Auditoria</Button>
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
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planejadas</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.planned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
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
                  placeholder="Buscar auditorias..."
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
                <SelectItem value="planned">Planejada</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="draft-report">Relatório Rascunho</SelectItem>
                <SelectItem value="final-report">Relatório Final</SelectItem>
                <SelectItem value="closed">Fechada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="internal">Interna</SelectItem>
                <SelectItem value="external">Externa</SelectItem>
                <SelectItem value="supplier">Fornecedor</SelectItem>
                <SelectItem value="regulatory">Regulatória</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Auditorias ({filteredAudits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Número</th>
                  <th className="text-left p-2">Título</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Auditor Líder</th>
                  <th className="text-left p-2">Data Início</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Avaliação</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.map((audit) => (
                  <tr key={audit.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{audit.auditNumber}</td>
                    <td className="p-2">{audit.title}</td>
                    <td className="p-2">
                      <Badge className={getTypeColor(audit.auditType)}>
                        {audit.auditType === "internal"
                          ? "Interna"
                          : audit.auditType === "external"
                            ? "Externa"
                            : audit.auditType === "supplier"
                              ? "Fornecedor"
                              : "Regulatória"}
                      </Badge>
                    </td>
                    <td className="p-2">{audit.leadAuditor}</td>
                    <td className="p-2">{new Date(audit.plannedStartDate).toLocaleDateString("pt-BR")}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(audit.status)}>
                        {audit.status === "planned"
                          ? "Planejada"
                          : audit.status === "in-progress"
                            ? "Em Andamento"
                            : audit.status === "draft-report"
                              ? "Rascunho"
                              : audit.status === "final-report"
                                ? "Relatório Final"
                                : "Fechada"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getRatingColor(audit.overallRating)}>
                        {audit.overallRating === "satisfactory"
                          ? "Satisfatória"
                          : audit.overallRating === "needs-improvement"
                            ? "Precisa Melhorar"
                            : "Insatisfatória"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAudit(audit)
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
            <DialogTitle>Detalhes da Auditoria</DialogTitle>
          </DialogHeader>
          {selectedAudit && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Número</Label>
                  <p className="text-sm text-muted-foreground">{selectedAudit.auditNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm text-muted-foreground">{selectedAudit.auditType}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <p className="text-sm text-muted-foreground">{selectedAudit.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Escopo</Label>
                <p className="text-sm text-muted-foreground">{selectedAudit.scope}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Auditor Líder</Label>
                  <p className="text-sm text-muted-foreground">{selectedAudit.leadAuditor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departamento</Label>
                  <p className="text-sm text-muted-foreground">{selectedAudit.department}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Achados ({selectedAudit.findings.length})</Label>
                <div className="space-y-2 mt-2">
                  {selectedAudit.findings.map((finding) => (
                    <div key={finding.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          className={
                            finding.type === "major"
                              ? "bg-red-100 text-red-800"
                              : finding.type === "minor"
                                ? "bg-yellow-100 text-yellow-800"
                                : finding.type === "observation"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                          }
                        >
                          {finding.type === "major"
                            ? "Maior"
                            : finding.type === "minor"
                              ? "Menor"
                              : finding.type === "observation"
                                ? "Observação"
                                : "Oportunidade"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Cláusula {finding.clause}</span>
                      </div>
                      <p className="text-sm">{finding.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">Evidência: {finding.evidence}</p>
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

export { AuditPage as Audit }
