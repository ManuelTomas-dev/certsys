"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Calendar, Download } from "lucide-react"
import { generateMockInspections } from "@/lib/qhse-data"
import { InspectionCreateDialog, InspectionEditDialog, InspectionViewDialog } from "./inspection-dialogs"
import { useToast } from "@/hooks/use-toast"
import type { InspectionRecord } from "@/types/qhse"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "Pendente",
  "in-progress": "Em Andamento",
  completed: "Concluída",
  failed: "Falhou",
}

export function QualityInspectionModule() {
  const { toast } = useToast()
  const [inspections, setInspections] = useState<InspectionRecord[]>(generateMockInspections())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null)

  const filteredInspections = useMemo(() => {
    return inspections.filter((inspection) => {
      const matchesSearch =
        inspection.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || inspection.status === statusFilter
      const matchesType = typeFilter === "all" || inspection.inspectionType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [inspections, searchTerm, statusFilter, typeFilter])

  const handleCreateInspection = (data: Partial<InspectionRecord>) => {
    const newInspection: InspectionRecord = {
      id: Date.now().toString(),
      equipmentId: data.equipmentId!,
      equipmentName: data.equipmentName!,
      inspectionType: data.inspectionType!,
      inspector: data.inspector!,
      date: data.date!,
      status: data.status!,
      findings: data.findings || [],
      recommendations: data.recommendations || [],
      nextInspectionDate: data.nextInspectionDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setInspections([newInspection, ...inspections])
    setCreateDialogOpen(false)
    toast({
      title: "Inspeção criada",
      description: "A nova inspeção foi criada com sucesso.",
    })
  }

  const handleEditInspection = (data: Partial<InspectionRecord>) => {
    if (!selectedInspection) return

    const updatedInspection = {
      ...selectedInspection,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    setInspections(inspections.map((i) => (i.id === selectedInspection.id ? updatedInspection : i)))
    setEditDialogOpen(false)
    setSelectedInspection(null)
    toast({
      title: "Inspeção atualizada",
      description: "As informações da inspeção foram atualizadas com sucesso.",
    })
  }

  const handleViewInspection = (inspection: InspectionRecord) => {
    setSelectedInspection(inspection)
    setViewDialogOpen(true)
  }

  const handleEditClick = (inspection: InspectionRecord) => {
    setSelectedInspection(inspection)
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar inspeções..."
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
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="failed">Falhou</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="routine">Rotina</SelectItem>
              <SelectItem value="preventive">Preventiva</SelectItem>
              <SelectItem value="corrective">Corretiva</SelectItem>
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
            Nova Inspeção
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspections.length}</div>
            <p className="text-xs text-muted-foreground">+2 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inspections.filter((i) => i.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((inspections.filter((i) => i.status === "completed").length / inspections.length) * 100)}% do
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inspections.filter((i) => i.status === "in-progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inspections.filter((i) => i.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando início</p>
          </CardContent>
        </Card>
      </div>

      {/* Inspections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inspeções</CardTitle>
          <CardDescription>
            Gestão completa de inspeções de equipamentos e instalações ({filteredInspections.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Inspetor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Próxima Inspeção</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => (
                <TableRow key={inspection.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{inspection.equipmentName}</div>
                      <div className="text-sm text-muted-foreground">{inspection.equipmentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {inspection.inspectionType === "routine"
                        ? "Rotina"
                        : inspection.inspectionType === "preventive"
                          ? "Preventiva"
                          : "Corretiva"}
                    </Badge>
                  </TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(inspection.date).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[inspection.status]}>{statusLabels[inspection.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {inspection.nextInspectionDate
                      ? new Date(inspection.nextInspectionDate).toLocaleDateString("pt-BR")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewInspection(inspection)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(inspection)}>
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
      <InspectionCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateInspection}
      />

      {selectedInspection && (
        <InspectionEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          inspection={selectedInspection}
          onSubmit={handleEditInspection}
        />
      )}

      <InspectionViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} inspection={selectedInspection} />
    </div>
  )
}

export { QualityInspectionModule as Inspection }
