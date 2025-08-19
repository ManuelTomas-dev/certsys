"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Calendar, Download, Weight, Ruler } from "lucide-react"
import { generateMockLiftingOperations } from "@/lib/qhse-data"
import { LiftingCreateDialog, LiftingEditDialog, LiftingViewDialog } from "./lifting-dialogs"
import { useToast } from "@/hooks/use-toast"
import type { LiftingOperation } from "@/types/qhse"

const statusColors = {
  planned: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  planned: "Planejada",
  "in-progress": "Em Andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
}

export function QualityLiftingModule() {
  const { toast } = useToast()
  const [operations, setOperations] = useState<LiftingOperation[]>(generateMockLiftingOperations())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<LiftingOperation | null>(null)

  // Get unique locations for filter
  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(operations.map((op) => op.location)))
    return ["all", ...uniqueLocations]
  }, [operations])

  const filteredOperations = useMemo(() => {
    return operations.filter((operation) => {
      const matchesSearch =
        operation.operationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operation.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operation.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || operation.status === statusFilter
      const matchesLocation = locationFilter === "all" || operation.location === locationFilter

      return matchesSearch && matchesStatus && matchesLocation
    })
  }, [operations, searchTerm, statusFilter, locationFilter])

  const handleCreateOperation = (data: Partial<LiftingOperation>) => {
    const newOperation: LiftingOperation = {
      id: Date.now().toString(),
      operationName: data.operationName!,
      location: data.location!,
      liftingEquipment: data.liftingEquipment!,
      operator: data.operator!,
      supervisor: data.supervisor!,
      plannedDate: data.plannedDate!,
      actualDate: data.actualDate,
      weight: data.weight!,
      height: data.height!,
      status: data.status!,
      riskAssessment: data.riskAssessment!,
      safetyMeasures: data.safetyMeasures || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setOperations([newOperation, ...operations])
    setCreateDialogOpen(false)
    toast({
      title: "Operação criada",
      description: "A nova operação de elevação foi criada com sucesso.",
    })
  }

  const handleEditOperation = (data: Partial<LiftingOperation>) => {
    if (!selectedOperation) return

    const updatedOperation = {
      ...selectedOperation,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    setOperations(operations.map((op) => (op.id === selectedOperation.id ? updatedOperation : op)))
    setEditDialogOpen(false)
    setSelectedOperation(null)
    toast({
      title: "Operação atualizada",
      description: "As informações da operação foram atualizadas com sucesso.",
    })
  }

  const handleViewOperation = (operation: LiftingOperation) => {
    setSelectedOperation(operation)
    setViewDialogOpen(true)
  }

  const handleEditClick = (operation: LiftingOperation) => {
    setSelectedOperation(operation)
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
              placeholder="Buscar operações..."
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
              <SelectItem value="planned">Planejada</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Localizações</SelectItem>
              {locations.slice(1).map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
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
            Nova Operação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Operações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operations.length}</div>
            <p className="text-xs text-muted-foreground">+1 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {operations.filter((op) => op.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {operations.length > 0
                ? Math.round((operations.filter((op) => op.status === "completed").length / operations.length) * 100)
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {operations.filter((op) => op.status === "in-progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Planejadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {operations.filter((op) => op.status === "planned").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando execução</p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Operações de Elevação</CardTitle>
          <CardDescription>
            Gestão completa de operações de elevação e movimentação de cargas ({filteredOperations.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operação</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Data Planejada</TableHead>
                <TableHead>Peso/Altura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((operation) => (
                <TableRow key={operation.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{operation.operationName}</div>
                      <div className="text-sm text-muted-foreground">{operation.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{operation.liftingEquipment}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{operation.operator}</div>
                      <div className="text-xs text-muted-foreground">Sup: {operation.supervisor}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(operation.plannedDate).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Weight className="h-3 w-3 text-muted-foreground" />
                        {operation.weight.toLocaleString()}kg
                      </div>
                      <div className="flex items-center gap-1">
                        <Ruler className="h-3 w-3 text-muted-foreground" />
                        {operation.height}m
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[operation.status]}>{statusLabels[operation.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOperation(operation)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(operation)}>
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
      <LiftingCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateOperation}
      />

      {selectedOperation && (
        <LiftingEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          operation={selectedOperation}
          onSubmit={handleEditOperation}
        />
      )}

      <LiftingViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} operation={selectedOperation} />
    </div>
  )
}
export { QualityLiftingModule as Lifting }
