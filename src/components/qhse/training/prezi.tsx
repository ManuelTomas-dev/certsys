"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Monitor, Search, Plus, Eye, Edit, Trash2, Calendar, Users, Clock } from "lucide-react"
import { mockPreziRecords } from "@/lib/qhse-data"
import type { PreziRecord } from "@/types/qhse"

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  postponed: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  scheduled: "Agendado",
  "in-progress": "Em Andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
  postponed: "Adiado",
}

export default function PreziModule() {
  const [records, setRecords] = useState<PreziRecord[]>(mockPreziRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [selectedRecord, setSelectedRecord] = useState<PreziRecord | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.presenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const stats = {
    total: records.length,
    scheduled: records.filter((r) => r.status === "scheduled").length,
    completed: records.filter((r) => r.status === "completed").length,
    inProgress: records.filter((r) => r.status === "in-progress").length,
  }

  const departments = [...new Set(records.map((r) => r.department))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prezi</h2>
          <p className="text-muted-foreground">Apresentações de treinamento</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Apresentação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Apresentação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" placeholder="Título da apresentação" />
                </div>
                <div>
                  <Label htmlFor="topic">Tópico</Label>
                  <Input id="topic" placeholder="Tópico principal" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="presenter">Apresentador</Label>
                  <Input id="presenter" placeholder="Nome do apresentador" />
                </div>
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HSE">HSE</SelectItem>
                      <SelectItem value="Quality">Quality</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Input id="duration" type="number" placeholder="120" />
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Máx. Participantes</Label>
                  <Input id="maxAttendees" type="number" placeholder="30" />
                </div>
                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input id="location" placeholder="Sala A" />
                </div>
              </div>
              <div>
                <Label htmlFor="objectives">Objetivos</Label>
                <Textarea id="objectives" placeholder="Descreva os objetivos da apresentação" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Criar Apresentação</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
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
                  placeholder="Buscar por título, apresentador ou tópico..."
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
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="postponed">Adiado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Apresentador</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{record.presentationId}</TableCell>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell>{record.presenter}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{new Date(record.scheduledDate).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{record.duration}min</TableCell>
                  <TableCell>
                    {record.attendees.length}/{record.maxAttendees}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[record.status]}>{statusLabels[record.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRecord(record)
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Apresentação</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                  <p className="font-mono">{selectedRecord.presentationId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={statusColors[selectedRecord.status]}>{statusLabels[selectedRecord.status]}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Título</Label>
                <p className="font-medium">{selectedRecord.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Apresentador</Label>
                  <p>{selectedRecord.presenter}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Departamento</Label>
                  <p>{selectedRecord.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Duração</Label>
                  <p>{selectedRecord.duration} minutos</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Local</Label>
                  <p>{selectedRecord.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Participantes</Label>
                  <p>
                    {selectedRecord.attendees.length}/{selectedRecord.maxAttendees}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Objetivos</Label>
                <ul className="list-disc list-inside space-y-1">
                  {selectedRecord.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Materiais</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedRecord.feedback.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Feedback</Label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRecord.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { PreziModule as Prezi }
