"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Calendar, Download, Star, AlertTriangle } from "lucide-react"
import { generateMockSQMRecords } from "@/lib/qhse-data"
import { SQMCreateDialog, SQMEditDialog, SQMViewDialog } from "./sqm-dialogs"
import { useToast } from "@/hooks/use-toast"
import type { SQMRecord } from "@/types/qhse"

const statusColors = {
  approved: "bg-green-100 text-green-800",
  conditional: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  "under-review": "bg-blue-100 text-blue-800",
}

const statusLabels = {
  approved: "Aprovado",
  conditional: "Condicional",
  rejected: "Rejeitado",
  "under-review": "Em Revisão",
}

export function QualitySQMModule() {
  const { toast } = useToast()
  const [records, setRecords] = useState<SQMRecord[]>(generateMockSQMRecords())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<SQMRecord | null>(null)

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(records.map((record) => record.category)))
    return ["all", ...uniqueCategories]
  }, [records])

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.evaluator.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      const matchesCategory = categoryFilter === "all" || record.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [records, searchTerm, statusFilter, categoryFilter])

  // Check for evaluations due soon
  const evaluationsDueSoon = useMemo(() => {
    const today = new Date()
    return records.filter((record) => {
      const nextEvalDate = new Date(record.nextEvaluationDate)
      const daysUntilEval = Math.ceil((nextEvalDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
      return daysUntilEval <= 30 && daysUntilEval > 0
    })
  }, [records])

  const handleCreateRecord = (data: Partial<SQMRecord>) => {
    const newRecord: SQMRecord = {
      id: Date.now().toString(),
      supplierName: data.supplierName!,
      supplierCode: data.supplierCode!,
      category: data.category!,
      evaluationDate: data.evaluationDate!,
      evaluator: data.evaluator!,
      overallScore: data.overallScore!,
      qualityScore: data.qualityScore!,
      deliveryScore: data.deliveryScore!,
      serviceScore: data.serviceScore!,
      status: data.status!,
      comments: data.comments!,
      nextEvaluationDate: data.nextEvaluationDate!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setRecords([newRecord, ...records])
    setCreateDialogOpen(false)
    toast({
      title: "Avaliação criada",
      description: "A nova avaliação de fornecedor foi criada com sucesso.",
    })
  }

  const handleEditRecord = (data: Partial<SQMRecord>) => {
    if (!selectedRecord) return

    const updatedRecord = {
      ...selectedRecord,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    setRecords(records.map((record) => (record.id === selectedRecord.id ? updatedRecord : record)))
    setEditDialogOpen(false)
    setSelectedRecord(null)
    toast({
      title: "Avaliação atualizada",
      description: "As informações da avaliação foram atualizadas com sucesso.",
    })
  }

  const handleViewRecord = (record: SQMRecord) => {
    setSelectedRecord(record)
    setViewDialogOpen(true)
  }

  const handleEditClick = (record: SQMRecord) => {
    setSelectedRecord(record)
    setEditDialogOpen(true)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const isEvaluationDue = (record: SQMRecord) => {
    const nextEvalDate = new Date(record.nextEvaluationDate)
    const today = new Date()
    const daysUntilEval = Math.ceil((nextEvalDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysUntilEval <= 30 && daysUntilEval > 0
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="conditional">Condicional</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
              <SelectItem value="under-review">Em Revisão</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Avaliação
          </Button>
        </div>
      </div>

      {/* Alert for evaluations due soon */}
      {evaluationsDueSoon.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">Avaliações próximas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              {evaluationsDueSoon.length} fornecedor(es) precisam de reavaliação nos próximos 30 dias.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground">+1 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {records.filter((record) => record.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {records.length > 0
                ? Math.round((records.filter((record) => record.status === "approved").length / records.length) * 100)
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {records.length > 0
                ? Math.round(records.reduce((sum, record) => sum + record.overallScore, 0) / records.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Desempenho geral</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Próximas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{evaluationsDueSoon.length}</div>
            <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* SQM Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliações de Fornecedores</CardTitle>
          <CardDescription>
            Gestão da qualidade de fornecedores (SQM) - ({filteredRecords.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Avaliador</TableHead>
                <TableHead>Próxima Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.supplierName}</div>
                      <div className="text-sm text-muted-foreground">{record.supplierCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`font-bold ${getScoreColor(record.overallScore)}`}>{record.overallScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>{record.evaluator}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar
                        className={`h-4 w-4 ${isEvaluationDue(record) ? "text-orange-500" : "text-muted-foreground"}`}
                      />
                      <span className={isEvaluationDue(record) ? "text-orange-600" : ""}>
                        {new Date(record.nextEvaluationDate).toLocaleDateString("pt-BR")}
                      </span>
                      {isEvaluationDue(record) && <AlertTriangle className="h-3 w-3 text-orange-500 ml-1" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[record.status]}>{statusLabels[record.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <SQMCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSubmit={handleCreateRecord} />

      {selectedRecord && (
        <SQMEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          record={selectedRecord}
          onSubmit={handleEditRecord}
        />
      )}

      <SQMViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} record={selectedRecord} />
    </div>
  )
}
export { QualitySQMModule as SQM }