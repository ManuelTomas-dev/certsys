"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { UserCheck, Plus, Search, Shield, Users, Crown } from "lucide-react"
import { generateAccountTypeMockData } from "@/lib/settings-data"
import type { AccountType } from "@/types/settings"

export default function AccountTypeModule() {
  const [accountTypes] = useState<AccountType[]>(generateAccountTypeMockData(15))
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredAccountTypes = accountTypes.filter((accountType) => {
    const matchesSearch =
      accountType.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accountType.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || accountType.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const stats = {
    total: accountTypes.length,
    active: accountTypes.filter((at) => at.isActive).length,
    superAdmin: accountTypes.filter((at) => at.level === "super-admin").length,
    admin: accountTypes.filter((at) => at.level === "admin").length,
    supervisor: accountTypes.filter((at) => at.level === "supervisor").length,
    inspector: accountTypes.filter((at) => at.level === "inspector").length,
  }

  const getLevelIcon = (level: AccountType["level"]) => {
    switch (level) {
      case "super-admin":
        return <Crown className="h-4 w-4" />
      case "admin":
        return <Shield className="h-4 w-4" />
      case "supervisor":
        return <Users className="h-4 w-4" />
      case "inspector":
        return <UserCheck className="h-4 w-4" />
      default:
        return <UserCheck className="h-4 w-4" />
    }
  }

  const getLevelColor = (level: AccountType["level"]) => {
    switch (level) {
      case "super-admin":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "supervisor":
        return "bg-green-100 text-green-800"
      case "inspector":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Account Type</h2>
          <p className="text-muted-foreground">Gestão de tipos de contas e permissões</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo de Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Tipo de Conta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designação</Label>
                  <Input id="designation" placeholder="Ex: Administrador" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input id="code" placeholder="Ex: ADMIN" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" placeholder="Descrição das responsabilidades" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Nível de Acesso</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Administrador</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="inspector">Inspetor</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" />
                <Label htmlFor="active">Tipo de Conta Ativo</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Criar Tipo de Conta</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Super Admin</p>
                <p className="text-lg font-bold">{stats.superAdmin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Admin</p>
                <p className="text-lg font-bold">{stats.admin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Supervisor</p>
                <p className="text-lg font-bold">{stats.supervisor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Inspector</p>
                <p className="text-lg font-bold">{stats.inspector}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Ativos</p>
                <p className="text-lg font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por designação ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="inspector">Inspector</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccountTypes.map((accountType) => (
          <Card key={accountType.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getLevelIcon(accountType.level)}
                  <div>
                    <CardTitle className="text-lg">{accountType.designation}</CardTitle>
                    <p className="text-sm text-muted-foreground">{accountType.code}</p>
                  </div>
                </div>
                <Badge variant={accountType.isActive ? "default" : "secondary"}>
                  {accountType.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className={getLevelColor(accountType.level)}>
                  {accountType.level.replace("-", " ").toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground line-clamp-2">{accountType.description}</p>
                <div className="text-xs text-muted-foreground">{accountType.permissions.length} permissão(ões)</div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" size="sm" onClick={() => setSelectedAccountType(accountType)}>
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Account Type Dialog */}
      <Dialog open={!!selectedAccountType} onOpenChange={() => setSelectedAccountType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Tipo de Conta</DialogTitle>
          </DialogHeader>
          {selectedAccountType && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Designação</Label>
                  <p className="text-sm text-muted-foreground">{selectedAccountType.designation}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Código</Label>
                  <p className="text-sm text-muted-foreground">{selectedAccountType.code}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Descrição</Label>
                  <p className="text-sm text-muted-foreground">{selectedAccountType.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nível</Label>
                  <Badge className={getLevelColor(selectedAccountType.level)}>
                    {selectedAccountType.level.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedAccountType.isActive ? "default" : "secondary"}>
                    {selectedAccountType.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Permissões</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAccountType.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { AccountTypeModule as AccountType }
