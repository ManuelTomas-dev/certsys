"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Enquiry } from "@/types/enquiries"
import { TrendingUp, Target, DollarSign, Users, Calendar, Percent, Award, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/mock-enquiries"

type Props = {
  enquiries?: Enquiry[]
}

export function EnquiriesStatistics({ enquiries = [] }: Props) {
  // Cálculos estatísticos
  const total = enquiries.length
  const novas = enquiries.filter((e) => e.status === "Nova").length
  const emAnalise = enquiries.filter((e) => e.status === "Em Análise").length
  const cotacaoEnviada = enquiries.filter((e) => e.status === "Cotação Enviada").length
  const aprovadas = enquiries.filter((e) => e.status === "Aprovada").length
  const convertidas = enquiries.filter((e) => e.status === "Convertida").length
  const fechadas = enquiries.filter((e) => e.status === "Fechada").length
  const rejeitadas = enquiries.filter((e) => e.status === "Rejeitada").length

  // Taxa de conversão
  const taxaConversao = total > 0 ? ((convertidas / total) * 100).toFixed(1) : "0"

  // Valor total estimado
  const valorTotal = enquiries.reduce((sum, e) => sum + (e.valorEstimado || 0), 0)
  const valorConvertidas = enquiries
    .filter((e) => e.status === "Convertida")
    .reduce((sum, e) => sum + (e.valorEstimado || 0), 0)

  // Probabilidade média
  const probabilidadeMedia =
    total > 0 ? (enquiries.reduce((sum, e) => sum + e.probabilidade, 0) / total).toFixed(0) : "0"

  // Enquiries por origem
  const porOrigem = enquiries.reduce(
    (acc, e) => {
      acc[e.origem] = (acc[e.origem] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Enquiries por equipa
  const porEquipa = enquiries.reduce(
    (acc, e) => {
      acc[e.equipaVenda] = (acc[e.equipaVenda] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Enquiries vencendo (próximos 7 dias)
  const hoje = new Date()
  const proximoVencimento = enquiries.filter((e) => {
    if (!e.dataLimite || e.status === "Convertida" || e.status === "Fechada") return false
    const limite = new Date(e.dataLimite)
    const diffDays = Math.ceil((limite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Resumo Geral */}
      <Card className="border-cyan-800/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Enquiries</CardTitle>
          <Target className="h-4 w-4 text-cyan-800/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-800">{total}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {novas} Novas
            </Badge>
            <Badge variant="outline" className="text-xs">
              {emAnalise} Em Análise
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Conversão */}
      <Card className="border-green-800/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-800/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">{taxaConversao}%</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-green-800 text-white text-xs">{convertidas} Convertidas</Badge>
            <Badge variant="outline" className="text-xs">
              {fechadas} Fechadas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Valor Total */}
      <Card className="border-blue-800/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor em Pipeline</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-800/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">{formatCurrency(valorTotal)}</div>
          <div className="text-xs text-muted-foreground mt-1">Convertidas: {formatCurrency(valorConvertidas)}</div>
        </CardContent>
      </Card>

      {/* Probabilidade Média */}
      <Card className="border-purple-800/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Probabilidade Média</CardTitle>
          <Percent className="h-4 w-4 text-purple-800/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">{probabilidadeMedia}%</div>
          <div className="flex items-center gap-1 mt-2">
            {proximoVencimento > 0 && (
              <Badge variant="outline" className="text-xs text-orange-700 border-orange-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                {proximoVencimento} Vencendo
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Novas</span>
              <Badge variant="outline" className="border-blue-600/30 text-blue-700">
                {novas}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Em Análise</span>
              <Badge variant="outline" className="border-yellow-600/30 text-yellow-700">
                {emAnalise}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cotação Enviada</span>
              <Badge variant="outline" className="border-purple-600/30 text-purple-700">
                {cotacaoEnviada}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Aprovadas</span>
              <Badge variant="outline" className="border-green-600/30 text-green-700">
                {aprovadas}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Convertidas</span>
              <Badge className="bg-green-800 text-white">{convertidas}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Rejeitadas</span>
              <Badge variant="outline" className="border-red-600/30 text-red-700">
                {rejeitadas}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Origens */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Top Origens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(porOrigem)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([origem, count]) => (
                <div key={origem} className="flex justify-between items-center">
                  <span className="text-sm truncate">{origem}</span>
                  <Badge variant="outline" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Equipas */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-medium text-cyan-800 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Top Equipas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(porEquipa)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([equipa, count]) => (
                <div key={equipa} className="flex justify-between items-center">
                  <span className="text-sm truncate">{equipa}</span>
                  <Badge variant="outline" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
