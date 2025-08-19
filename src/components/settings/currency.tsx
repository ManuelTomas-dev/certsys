"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DollarSign, Plus, Search, TrendingUp, Star } from "lucide-react"
import { generateCurrencyMockData } from "@/lib/settings-data"
import type { Currency } from "@/types/settings"

export default function CurrencyModule() {
  const [currencies] = useState<Currency[]>(generateCurrencyMockData(8))
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const stats = {
    total: currencies.length,
    active: currencies.filter((c) => c.isActive).length,
    default: currencies.filter((c) => c.isDefault).length,
    inactive: currencies.filter((c) => !c.isActive).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Currency</h2>
          <p className="text-muted-foreground">Gestão de moedas e taxas de câmbio</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Moeda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Nova Moeda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Moeda</Label>
                <Input id="name" placeholder="Ex: Kwanza Angolano" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input id="code" placeholder="Ex: AOA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">Símbolo</Label>
                  <Input id="symbol" placeholder="Ex: Kz" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchangeRate">Taxa de Câmbio</Label>
                <Input id="exchangeRate" type="number" step="0.0001" placeholder="Ex: 1.0000" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="default" />
                <Label htmlFor="default">Moeda Padrão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" />
                <Label htmlFor="active">Moeda Ativa</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Criar Moeda</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Padrão</p>
                <p className="text-2xl font-bold">{stats.default}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inativas</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, código ou símbolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Currencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCurrencies.map((currency) => (
          <Card key={currency.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{currency.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{currency.code}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {currency.isDefault && (
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Padrão
                    </Badge>
                  )}
                  <Badge variant={currency.isActive ? "default" : "secondary"}>
                    {currency.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Símbolo:</span>
                  <span className="font-mono text-lg">{currency.symbol}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Câmbio:</span>
                  <span className="font-mono">{currency.exchangeRate.toFixed(4)}</span>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" size="sm" onClick={() => setSelectedCurrency(currency)}>
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Currency Dialog */}
      <Dialog open={!!selectedCurrency} onOpenChange={() => setSelectedCurrency(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Moeda</DialogTitle>
          </DialogHeader>
          {selectedCurrency && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm text-muted-foreground">{selectedCurrency.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Código</Label>
                    <p className="text-sm text-muted-foreground font-mono">{selectedCurrency.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Símbolo</Label>
                    <p className="text-sm text-muted-foreground font-mono mg:text-lg">{selectedCurrency.symbol}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Taxa de Câmbio</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedCurrency.exchangeRate.toFixed(4)}</p>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <Label className="text-sm font-medium">Padrão</Label>
                    <div className="mt-1">
                      <Badge variant={selectedCurrency.isDefault ? "default" : "secondary"}>
                        {selectedCurrency.isDefault ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge variant={selectedCurrency.isActive ? "default" : "secondary"}>
                        {selectedCurrency.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
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

export { CurrencyModule as Currency }
