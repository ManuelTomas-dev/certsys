"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Calendar, Download, FileText, AlertTriangle } from "lucide-react"
import { generateMockISODocuments } from "@/lib/qhse-data"
import { ISOCreateDialog, ISOEditDialog, ISOViewDialog } from "./iso-dialogs"
import { useToast } from "@/hooks/use-toast"
import type { ISODocument } from "@/types/qhse"

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  obsolete: "bg-red-100 text-red-800",
}

const statusLabels = {
  draft: "Rascunho",
  "under-review": "Em Revisão",
  approved: "Aprovado",
  obsolete: "Obsoleto",
}

const categoryLabels = {
  procedure: "Procedimento",
  policy: "Política",
  form: "Formulário",
  manual: "Manual",
}

export function QualityISOModule() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<ISODocument[]>(generateMockISODocuments())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<ISODocument | null>(null)

  // Get unique departments for filter
  const departments = useMemo(() => {
    const uniqueDepartments = Array.from(new Set(documents.map((doc) => doc.department)))
    return ["all", ...uniqueDepartments]
  }, [documents])

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesSearch =
        document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.owner.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || document.status === statusFilter
      const matchesCategory = categoryFilter === "all" || document.category === categoryFilter
      const matchesDepartment = departmentFilter === "all" || document.department === departmentFilter

      return matchesSearch && matchesStatus && matchesCategory && matchesDepartment
    })
  }, [documents, searchTerm, statusFilter, categoryFilter, departmentFilter])

  // Check for documents expiring soon
  const documentsExpiringSoon = useMemo(() => {
    const today = new Date()
    return documents.filter((doc) => {
      const reviewDate = new Date(doc.reviewDate)
      const daysUntilReview = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
      return daysUntilReview <= 30 && daysUntilReview > 0 && doc.status === "approved"
    })
  }, [documents])

  const handleCreateDocument = (data: Partial<ISODocument>) => {
    const newDocument: ISODocument = {
      id: Date.now().toString(),
      documentNumber: data.documentNumber!,
      title: data.title!,
      version: data.version!,
      category: data.category!,
      department: data.department!,
      owner: data.owner!,
      approver: data.approver!,
      effectiveDate: data.effectiveDate!,
      reviewDate: data.reviewDate!,
      status: data.status!,
      filePath: data.filePath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setDocuments([newDocument, ...documents])
    setCreateDialogOpen(false)
    toast({
      title: "Documento criado",
      description: "O novo documento ISO foi criado com sucesso.",
    })
  }

  const handleEditDocument = (data: Partial<ISODocument>) => {
    if (!selectedDocument) return

    const updatedDocument = {
      ...selectedDocument,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    setDocuments(documents.map((doc) => (doc.id === selectedDocument.id ? updatedDocument : doc)))
    setEditDialogOpen(false)
    setSelectedDocument(null)
    toast({
      title: "Documento atualizado",
      description: "As informações do documento foram atualizadas com sucesso.",
    })
  }

  const handleViewDocument = (document: ISODocument) => {
    setSelectedDocument(document)
    setViewDialogOpen(true)
  }

  const handleEditClick = (document: ISODocument) => {
    setSelectedDocument(document)
    setEditDialogOpen(true)
  }

  const isExpiringSoon = (document: ISODocument) => {
    const reviewDate = new Date(document.reviewDate)
    const today = new Date()
    const daysUntilReview = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysUntilReview <= 30 && daysUntilReview > 0 && document.status === "approved"
  }

  const isOverdue = (document: ISODocument) => {
    const reviewDate = new Date(document.reviewDate)
    const today = new Date()
    return reviewDate < today && document.status === "approved"
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
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
              <SelectItem value="under-review">Em Revisão</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="obsolete">Obsoleto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="procedure">Procedimento</SelectItem>
              <SelectItem value="policy">Política</SelectItem>
              <SelectItem value="form">Formulário</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {departments.slice(1).map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
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
            Novo Documento
          </Button>
        </div>
      </div>

      {/* Alert for expiring documents */}
      {documentsExpiringSoon.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">Documentos com revisão próxima</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              {documentsExpiringSoon.length} documento(s) precisam de revisão nos próximos 30 dias.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">+1 desde ontem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter((doc) => doc.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {documents.length > 0
                ? Math.round((documents.filter((doc) => doc.status === "approved").length / documents.length) * 100)
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter((doc) => doc.status === "under-review").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expirando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{documentsExpiringSoon.length}</div>
            <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos ISO</CardTitle>
          <CardDescription>
            Gestão completa de documentos e procedimentos ISO ({filteredDocuments.length} registros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data de Revisão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{document.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {document.documentNumber} - v{document.version}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryLabels[document.category]}</Badge>
                  </TableCell>
                  <TableCell>{document.department}</TableCell>
                  <TableCell>{document.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar
                        className={`h-4 w-4 ${
                          isOverdue(document)
                            ? "text-red-500"
                            : isExpiringSoon(document)
                              ? "text-orange-500"
                              : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          isOverdue(document) ? "text-red-600" : isExpiringSoon(document) ? "text-orange-600" : ""
                        }
                      >
                        {new Date(document.reviewDate).toLocaleDateString("pt-BR")}
                      </span>
                      {isExpiringSoon(document) && <AlertTriangle className="h-3 w-3 text-orange-500 ml-1" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[document.status]}>{statusLabels[document.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDocument(document)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(document)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {document.filePath && (
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ISOCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSubmit={handleCreateDocument} />

      {selectedDocument && (
        <ISOEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          document={selectedDocument}
          onSubmit={handleEditDocument}
        />
      )}

      <ISOViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} document={selectedDocument} />
    </div>
  )
}

export { QualityISOModule as ISO }