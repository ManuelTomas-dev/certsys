"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Download, AlertTriangle, Users, Calendar } from "lucide-react"
import { generateMockJSA } from "@/lib/qhse-data"
import { useToast } from "@/hooks/use-toast"
import type { JSARecord } from "@/types/qhse"

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  approved: "bg-green-100 text-green-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-purple-100 text-purple-800",
}

const statusLabels = {
  draft: "Rascunho",
  approved: "Aprovada",
  active: "Ativa",
  completed: "Concluída",
}

const riskLevelColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

const riskLevelLabels = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
}

export function HSEJSAModule() {
  const { toast } = useToast()
  const [jsaRecords, setJsaRecords] = useState<JSARecord[]>(generateMockJSA())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all")

  const filteredJSARecords = useMemo(() => {
    return jsaRecords.filter((jsa) => {
      const matchesSearch =
        jsa.jsaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jsa.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jsa.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || jsa.status === statusFilter
      const matchesRiskLevel = riskLevelFilter === "all" || jsa.riskLevel === riskLevelFilter

      return matchesSearch && matchesStatus && matchesRiskLevel
    })
  }, [jsaRecords, searchTerm, statusFilter, riskLevelFilter])

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar JSA..."
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
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="approved">Aprovada</SelectItem>
              <SelectItem value="active">Ativa</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Nível de Risco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Níveis</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
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
            Nova JSA
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de JSAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jsaRecords.length}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {jsaRecords.filter((jsa) => jsa.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Em execução</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alto Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {jsaRecords.filter((jsa) => jsa.riskLevel === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Requer atenção especial</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jsaRecords.filter((jsa) => jsa.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Prontas para execução</p>
          </CardContent>
        </Card>
      </div>

      {/* JSA Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Safety Analysis (JSA)</CardTitle>
          <CardDescription>
            Análise de segurança do trabalho e controle de riscos ({filteredJSARecords.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JSA</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Trabalhadores</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Nível de Risco</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJSARecords.map((jsa) => (
                <TableRow key={jsa.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{jsa.jsaNumber}</div>
                      <div className="text-sm text-muted-foreground">{jsa.jobDescription}</div>
                    </div>
                  </TableCell>
                  <TableCell>{jsa.supervisor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{jsa.workers.length} trabalhadores</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(jsa.date).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={riskLevelColors[jsa.riskLevel]} variant="outline">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {riskLevelLabels[jsa.riskLevel]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[jsa.status]}>{statusLabels[jsa.status]}</Badge>
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

export { HSEJSAModule as JSA }
