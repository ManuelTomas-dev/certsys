"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Download, StopCircle, AlertTriangle, Calendar } from "lucide-react"
import { generateMockStopCards } from "@/lib/qhse-data"
import { useToast } from "@/hooks/use-toast"
import type { StopCardRecord } from "@/types/qhse"

const statusColors = {
  open: "bg-red-100 text-red-800",
  investigating: "bg-yellow-100 text-yellow-800",
  "corrective-action": "bg-blue-100 text-blue-800",
  closed: "bg-green-100 text-green-800",
}

const statusLabels = {
  open: "Aberto",
  investigating: "Investigando",
  "corrective-action": "Ação Corretiva",
  closed: "Fechado",
}

const categoryLabels = {
  "unsafe-act": "Ato Inseguro",
  "unsafe-condition": "Condição Insegura",
  "near-miss": "Quase Acidente",
  environmental: "Ambiental",
}

const severityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const severityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
}

export function HSEStopCardModule() {
  const { toast } = useToast()
  const [stopCards, setStopCards] = useState<StopCardRecord[]>(generateMockStopCards())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  const filteredStopCards = useMemo(() => {
    return stopCards.filter((card) => {
      const matchesSearch =
        card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || card.status === statusFilter
      const matchesCategory = categoryFilter === "all" || card.category === categoryFilter
      const matchesSeverity = severityFilter === "all" || card.severity === severityFilter

      return matchesSearch && matchesStatus && matchesCategory && matchesSeverity
    })
  }, [stopCards, searchTerm, statusFilter, categoryFilter, severityFilter])

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar stop cards..."
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
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="investigating">Investigando</SelectItem>
              <SelectItem value="corrective-action">Ação Corretiva</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="unsafe-act">Ato Inseguro</SelectItem>
              <SelectItem value="unsafe-condition">Condição Insegura</SelectItem>
              <SelectItem value="near-miss">Quase Acidente</SelectItem>
              <SelectItem value="environmental">Ambiental</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Severidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
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
            Novo Stop Card
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Stop Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stopCards.length}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stopCards.filter((card) => card.status === "open").length}
            </div>
            <p className="text-xs text-muted-foreground">Requer ação imediata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stopCards.filter((card) => card.severity === "critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Alta prioridade</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fechados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stopCards.filter((card) => card.status === "closed").length}
            </div>
            <p className="text-xs text-muted-foreground">Resolvidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Stop Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stop Cards</CardTitle>
          <CardDescription>
            Cartões de parada para situações inseguras e não conformidades ({filteredStopCards.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stop Card</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Reportado por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStopCards.map((card) => (
                <TableRow key={card.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <StopCircle className="h-4 w-4 text-red-500" />
                        {card.cardNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">{card.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryLabels[card.category]}</Badge>
                  </TableCell>
                  <TableCell>{card.reportedBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(card.dateReported).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={severityColors[card.severity]} variant="outline">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {severityLabels[card.severity]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[card.status]}>{statusLabels[card.status]}</Badge>
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
export { HSEStopCardModule as StopCard }