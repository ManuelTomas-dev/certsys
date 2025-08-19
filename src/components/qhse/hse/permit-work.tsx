"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Calendar, Download, Shield } from "lucide-react"
import { generateMockPermitWork } from "@/lib/qhse-data"
import { useToast } from "@/hooks/use-toast"
import type { PermitWorkRecord } from "@/types/qhse"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "Pendente",
  approved: "Aprovada",
  active: "Ativa",
  completed: "Concluída",
  cancelled: "Cancelada",
}

const workTypeLabels = {
  "hot-work": "Trabalho a Quente",
  "confined-space": "Espaço Confinado",
  electrical: "Elétrico",
  height: "Trabalho em Altura",
  excavation: "Escavação",
}

export function HSEPermitWorkModule() {
  const { toast } = useToast()
  const [permits, setPermits] = useState<PermitWorkRecord[]>(generateMockPermitWork())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("all")

  const filteredPermits = useMemo(() => {
    return permits.filter((permit) => {
      const matchesSearch =
        permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.workDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.requestor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || permit.status === statusFilter
      const matchesWorkType = workTypeFilter === "all" || permit.workType === workTypeFilter

      return matchesSearch && matchesStatus && matchesWorkType
    })
  }, [permits, searchTerm, statusFilter, workTypeFilter])

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar permissões..."
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
              <SelectItem value="approved">Aprovada</SelectItem>
              <SelectItem value="active">Ativa</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Trabalho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="hot-work">Trabalho a Quente</SelectItem>
              <SelectItem value="confined-space">Espaço Confinado</SelectItem>
              <SelectItem value="electrical">Elétrico</SelectItem>
              <SelectItem value="height">Trabalho em Altura</SelectItem>
              <SelectItem value="excavation">Escavação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Permissão
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permits.length}</div>
            <p className="text-xs text-muted-foreground">+1 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {permits.filter((p) => p.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Em execução</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {permits.filter((p) => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {permits.filter((p) => p.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Permits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Permissões de Trabalho</CardTitle>
          <CardDescription>
            Gestão de permissões para trabalhos de risco ({filteredPermits.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permissão</TableHead>
                <TableHead>Tipo de Trabalho</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermits.map((permit) => (
                <TableRow key={permit.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{permit.permitNumber}</div>
                      <div className="text-sm text-muted-foreground">{permit.workDescription}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {workTypeLabels[permit.workType]}
                    </Badge>
                  </TableCell>
                  <TableCell>{permit.requestor}</TableCell>
                  <TableCell>{permit.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(permit.startDate).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[permit.status]}>{statusLabels[permit.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
    </div>
  )
}
export { HSEPermitWorkModule as PermitWork }