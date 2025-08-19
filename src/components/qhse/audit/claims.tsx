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
import { AlertTriangle, DollarSign, Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import type { ClaimRecord } from "@/types/qhse"
import { mockClaimRecords } from "@/lib/qhse-data"

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimRecord[]>(mockClaimRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter
    const matchesType = typeFilter === "all" || claim.claimType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: ClaimRecord["status"]) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-800"
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "pending-approval":
        return "bg-orange-100 text-orange-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: ClaimRecord["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: claims.length,
    open: claims.filter((c) => ["received", "investigating", "pending-approval"].includes(c.status)).length,
    approved: claims.filter((c) => c.status === "approved").length,
    totalValue: claims.reduce((sum, c) => sum + c.value, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reclamações</h1>
          <p className="text-muted-foreground">Gestão de reclamações de clientes e fornecedores</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Reclamação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Reclamação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="claimNumber">Número da Reclamação</Label>
                  <Input id="claimNumber" placeholder="CLM-2024-001" />
                </div>
                <div>
                  <Label htmlFor="claimType">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Cliente</SelectItem>
                      <SelectItem value="supplier">Fornecedor</SelectItem>
                      <SelectItem value="internal">Interno</SelectItem>
                      <SelectItem value="warranty">Garantia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Título da reclamação" />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" placeholder="Descreva a reclamação detalhadamente" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product">Produto</Label>
                  <Input id="product" placeholder="Produto relacionado" />
                </div>
                <div>
                  <Label htmlFor="value">Valor (€)</Label>
                  <Input id="value" type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Criar Reclamação</Button>
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
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalValue.toLocaleString()}</div>
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
                  placeholder="Buscar reclamações..."
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
                <SelectItem value="received">Recebida</SelectItem>
                <SelectItem value="investigating">Investigando</SelectItem>
                <SelectItem value="pending-approval">Pendente Aprovação</SelectItem>
                <SelectItem value="approved">Aprovada</SelectItem>
                <SelectItem value="rejected">Rejeitada</SelectItem>
                <SelectItem value="closed">Fechada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="supplier">Fornecedor</SelectItem>
                <SelectItem value="internal">Interno</SelectItem>
                <SelectItem value="warranty">Garantia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reclamações ({filteredClaims.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Número</th>
                  <th className="text-left p-2">Título</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Prioridade</th>
                  <th className="text-left p-2">Valor</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{claim.claimNumber}</td>
                    <td className="p-2">{claim.title}</td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {claim.claimType === "customer"
                          ? "Cliente"
                          : claim.claimType === "supplier"
                            ? "Fornecedor"
                            : claim.claimType === "internal"
                              ? "Interno"
                              : "Garantia"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getPriorityColor(claim.priority)}>
                        {claim.priority === "critical"
                          ? "Crítica"
                          : claim.priority === "high"
                            ? "Alta"
                            : claim.priority === "medium"
                              ? "Média"
                              : "Baixa"}
                      </Badge>
                    </td>
                    <td className="p-2">€{claim.value.toLocaleString()}</td>
                    <td className="p-2">{new Date(claim.reportedDate).toLocaleDateString("pt-BR")}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status === "received"
                          ? "Recebida"
                          : claim.status === "investigating"
                            ? "Investigando"
                            : claim.status === "pending-approval"
                              ? "Pendente"
                              : claim.status === "approved"
                                ? "Aprovada"
                                : claim.status === "rejected"
                                  ? "Rejeitada"
                                  : "Fechada"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedClaim(claim)
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
            <DialogTitle>Detalhes da Reclamação</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Número</Label>
                  <p className="text-sm text-muted-foreground">{selectedClaim.claimNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm text-muted-foreground">{selectedClaim.claimType}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <p className="text-sm text-muted-foreground">{selectedClaim.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <p className="text-sm text-muted-foreground">{selectedClaim.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Produto</Label>
                  <p className="text-sm text-muted-foreground">{selectedClaim.product}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valor</Label>
                  <p className="text-sm text-muted-foreground">€{selectedClaim.value.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Ações Corretivas</Label>
                <ul className="text-sm text-muted-foreground mt-1">
                  {selectedClaim.correctiveActions.map((action, index) => (
                    <li key={index} className="list-disc list-inside">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label className="text-sm font-medium">Resolução</Label>
                <p className="text-sm text-muted-foreground">{selectedClaim.resolution}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

