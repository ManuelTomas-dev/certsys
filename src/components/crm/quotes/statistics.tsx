"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { QuoteStatistics } from "@/types/quotes"
import { formatCurrency } from "@/lib/mock-quotes"
import { TrendingUp, DollarSign, Clock, Target, Users, AlertTriangle, CheckCircle } from "lucide-react"

type Props = {
  statistics: QuoteStatistics
}

export function QuoteStatisticsCards({ statistics }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Cotações</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total}</div>
          <p className="text-xs text-muted-foreground">{statistics.quotesArquivadas} arquivadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(statistics.valorMedioQuote, "AOA")}</div>
          <p className="text-xs text-muted-foreground">Por cotação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.taxaConversao.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Cotações aprovadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(statistics.tempoMedioAprovacao)}</div>
          <p className="text-xs text-muted-foreground">Dias para aprovação</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function QuoteStatusBreakdown({ statistics }: Props) {
  const statusColors = {
    Rascunho: "bg-gray-500",
    Enviada: "bg-blue-500",
    "Em Revisão": "bg-yellow-500",
    Aprovada: "bg-green-500",
    Rejeitada: "bg-red-500",
    Expirada: "bg-orange-500",
    Arquivada: "bg-gray-400",
  }

  const likelihoodColors = {
    Baixa: "bg-red-500",
    Média: "bg-yellow-500",
    Alta: "bg-green-500",
    "Muito Alta": "bg-emerald-500",
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(statistics.porStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
                <span className="text-sm">{status}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{count}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(
                    statistics.valorTotalPorStatus[status as keyof typeof statistics.valorTotalPorStatus],
                    "AOA",
                  )}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Probabilidade de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(statistics.porLikelihood).map(([likelihood, count]) => (
            <div key={likelihood} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${likelihoodColors[likelihood as keyof typeof likelihoodColors]}`}
                />
                <span className="text-sm">{likelihood}</span>
              </div>
              <Badge variant="secondary">{count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Distribuição por Moeda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(statistics.porCurrency).map(([currency, count]) => (
            <div key={currency} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currency}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{count}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(
                    statistics.valorTotalPorCurrency[currency as keyof typeof statistics.valorTotalPorCurrency],
                    currency as any,
                  )}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Vencem em 30 dias</span>
            <Badge variant={statistics.quotesVencendasProximos30Dias > 0 ? "destructive" : "secondary"}>
              {statistics.quotesVencendasProximos30Dias}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Arquivadas</span>
            <Badge variant="outline">{statistics.quotesArquivadas}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TopSalesPersons({ statistics }: Props) {
  const sortedSalesPersons = Object.entries(statistics.porSalesPerson)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Top Vendedores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedSalesPersons.map(([name, count], index) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-800 text-white text-xs flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{name}</span>
              </div>
              <Badge variant="secondary">{count} cotações</Badge>
            </div>
          ))}
          {sortedSalesPersons.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Nenhum vendedor com cotações registadas.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
