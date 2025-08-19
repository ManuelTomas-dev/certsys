"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Download, Zap, CheckCircle, XCircle } from "lucide-react"
import { generateMockWeldingWork } from "@/lib/qhse-data"
import { useToast } from "@/hooks/use-toast"
import type { WeldingWorkRecord } from "@/types/qhse"

const statusColors = {
  planned: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  inspection: "bg-orange-100 text-orange-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const statusLabels = {
  planned: "Planejado",
  "in-progress": "Em Andamento",
  inspection: "Inspeção",
  approved: "Aprovado",
  rejected: "Rejeitado",
}

const weldingTypeLabels = {
  arc: "Eletrodo Revestido",
  mig: "MIG/MAG",
  tig: "TIG",
  "oxy-acetylene": "Oxi-acetilênica",
}

export function HSEWeldingWorkModule() {
  const { toast } = useToast()
  const [weldingWork, setWeldingWork] = useState<WeldingWorkRecord[]>(generateMockWeldingWork())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [weldingTypeFilter, setWeldingTypeFilter] = useState<string>("all")

  const filteredWeldingWork = useMemo(() => {
    return weldingWork.filter((work) => {
      const matchesSearch =
        work.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.welder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.material.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || work.status === statusFilter
      const matchesType = weldingTypeFilter === "all" || work.weldingType === weldingTypeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [weldingWork, searchTerm, statusFilter, weldingTypeFilter])

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar trabalhos de soldagem..."
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
              <SelectItem value="planned">Planejado</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="inspection">Inspeção</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={weldingTypeFilter} onValueChange={setWeldingTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Soldagem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="arc">Eletrodo Revestido</SelectItem>
              <SelectItem value="mig">MIG/MAG</SelectItem>
              <SelectItem value="tig">TIG</SelectItem>
              <SelectItem value="oxy-acetylene">Oxi-acetilênica</SelectItem>
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
            Novo Trabalho
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Trabalhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weldingWork.length}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {weldingWork.filter((w) => w.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Qualidade aprovada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Inspeção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {weldingWork.filter((w) => w.status === "inspection").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando inspeção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {weldingWork.filter((w) => w.status === "in-progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Sendo executados</p>
          </CardContent>
        </Card>
      </div>

      {/* Welding Work Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trabalhos de Soldagem</CardTitle>
          <CardDescription>
            Controle de qualidade e inspeção de soldas ({filteredWeldingWork.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem de Trabalho</TableHead>
                <TableHead>Tipo de Soldagem</TableHead>
                <TableHead>Soldador</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Inspeções</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWeldingWork.map((work) => (
                <TableRow key={work.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{work.workOrderNumber}</div>
                      <div className="text-sm text-muted-foreground">{work.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {weldingTypeLabels[work.weldingType]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{work.welder}</div>
                      <div className="text-xs text-muted-foreground">{work.welderCertification}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {work.material} - {work.thickness}mm
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {work.preWeldInspection ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs">Pré</span>
                      {work.postWeldInspection ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs">Pós</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[work.status]}>{statusLabels[work.status]}</Badge>
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
export { HSEWeldingWorkModule as WeldingWork }
