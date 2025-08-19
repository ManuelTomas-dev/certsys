"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GraduationCap, Search, Plus, Eye, Edit, Trash2, BookOpen, Clock, Award, Users } from "lucide-react"
import { mockOnlineTrainingRecords } from "@/lib/qhse-data"
import type { OnlineTrainingRecord } from "@/types/qhse"

const statusColors = {
  enrolled: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  enrolled: "Inscrito",
  "in-progress": "Em Progresso",
  completed: "Concluído",
  failed: "Reprovado",
  expired: "Expirado",
}

const categoryColors = {
  safety: "bg-red-100 text-red-800",
  quality: "bg-blue-100 text-blue-800",
  technical: "bg-purple-100 text-purple-800",
  compliance: "bg-orange-100 text-orange-800",
  "soft-skills": "bg-green-100 text-green-800",
}

const categoryLabels = {
  safety: "Segurança",
  quality: "Qualidade",
  technical: "Técnico",
  compliance: "Compliance",
  "soft-skills": "Soft Skills",
}

export default function OnlineModule() {
  const [records, setRecords] = useState<OnlineTrainingRecord[]>(mockOnlineTrainingRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedRecord, setSelectedRecord] = useState<OnlineTrainingRecord | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesCategory = categoryFilter === "all" || record.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: records.length,
    enrolled: records.filter((r) => r.status === "enrolled").length,
    inProgress: records.filter((r) => r.status === "in-progress").length,
    completed: records.filter((r) => r.status === "completed").length,
    avgProgress: Math.round(records.reduce((acc, r) => acc + r.progress, 0) / records.length),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Online</h2>
          <p className="text-muted-foreground">Treinamentos online</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Curso Online</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseName">Nome do Curso</Label>
                  <Input id="courseName" placeholder="Nome do curso" />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Segurança</SelectItem>
                      <SelectItem value="quality">Qualidade</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="soft-skills">Soft Skills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructor">Instrutor</Label>
                  <Input id="instructor" placeholder="Nome do instrutor" />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (horas)</Label>
                  <Input id="duration" type="number" placeholder="20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passingScore">Nota Mínima</Label>
                  <Input id="passingScore" type="number" placeholder="70" />
                </div>
                <div>
                  <Label htmlFor="maxAttempts">Máx. Tentativas</Label>
                  <Input id="maxAttempts" type="number" placeholder="3" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Criar Curso</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscritos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enrolled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</div>
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
                  placeholder="Buscar por curso ou instrutor..."
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
                <SelectItem value="enrolled">Inscrito</SelectItem>
                <SelectItem value="in-progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="failed">Reprovado</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="safety">Segurança</SelectItem>
                <SelectItem value="quality">Qualidade</SelectItem>
                <SelectItem value="technical">Técnico</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="soft-skills">Soft Skills</SelectItem>
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
                <TableHead>Curso</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Instrutor</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Nota Final</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">{record.courseId}</TableCell>
                  <TableCell className="font-medium">{record.courseName}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[record.category]}>{categoryLabels[record.category]}</Badge>
                  </TableCell>
                  <TableCell>{record.instructor}</TableCell>
                  <TableCell>{record.duration}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={record.progress} className="w-16" />
                      <span className="text-sm">{record.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{record.finalScore ? `${record.finalScore}%` : "-"}</TableCell>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Curso</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID do Curso</Label>
                  <p className="font-mono">{selectedRecord.courseId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={statusColors[selectedRecord.status]}>{statusLabels[selectedRecord.status]}</Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nome do Curso</Label>
                <p className="font-medium">{selectedRecord.courseName}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                  <Badge className={categoryColors[selectedRecord.category]}>
                    {categoryLabels[selectedRecord.category]}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Instrutor</Label>
                  <p>{selectedRecord.instructor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Duração</Label>
                  <p>{selectedRecord.duration} horas</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Progresso</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={selectedRecord.progress} className="flex-1" />
                    <span className="text-sm font-medium">{selectedRecord.progress}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tentativas</Label>
                  <p>
                    {selectedRecord.attempts}/{selectedRecord.maxAttempts}
                  </p>
                </div>
              </div>

              {selectedRecord.finalScore && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nota Final</Label>
                    <p className="text-lg font-bold text-green-600">{selectedRecord.finalScore}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nota Mínima</Label>
                    <p>{selectedRecord.passingScore}%</p>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Módulos do Curso</Label>
                <div className="mt-2 space-y-2">
                  {selectedRecord.modules.map((module, index) => (
                    <div key={module.moduleId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            module.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{module.moduleName}</p>
                          <p className="text-sm text-muted-foreground">{module.duration}h</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {module.completed ? (
                          <div>
                            <Badge className="bg-green-100 text-green-800">Concluído</Badge>
                            {module.score && (
                              <p className="text-sm text-muted-foreground mt-1">Nota: {module.score}%</p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline">Pendente</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRecord.certificateUrl && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Certificado</Label>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      <Award className="h-4 w-4 mr-2" />
                      Baixar Certificado
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { OnlineModule as Online }
