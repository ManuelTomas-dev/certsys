export type QuoteStatus = "Rascunho" | "Enviada" | "Em Revisão" | "Aprovada" | "Rejeitada" | "Expirada" | "Arquivada"

export type PaymentTerm = "À Vista" | "30 Dias" | "60 Dias" | "90 Dias" | "Parcelado"

export type Currency = "AOA" | "USD" | "EUR" | "BRL"

export type LikelihoodOfConversion = "Baixa" | "Média" | "Alta" | "Muito Alta"

export type ClientPrerequisite = {
  id: string
  name: string
  description: string
  required: boolean
  completed: boolean
  completedDate?: string
  notes?: string
}

export type DeliverableProfessional = {
  id: string
  name: string
  role: string
  experience: string
  certification?: string
  dailyRate?: number
}

export type DeliverableService = {
  id: string
  name: string
  description: string
  duration: string
  cost: number
  prerequisites?: string[]
}

export type QuoteItem = {
  id: string
  descricao: string
  quantidade: number
  unidade: string
  valorUnitario: number
  valorTotal: number
  observacao?: string
  profissionalId?: string
  servicoId?: string
}

export type ClientContact = {
  id: string
  name: string
  email: string
  phone: string
  position: string
  isPrimary: boolean
}

export type Quote = {
  id: string
  numero: string // Número da cotação (ex: COT-2024-0001)

  // Informações básicas
  enquiryId?: string
  enquiryTitulo?: string
  clientId: string
  clientName: string
  clientLocationId?: string
  clientLocationName?: string
  workLocationId?: string
  workLocationName?: string

  // Pessoa de vendas e contatos
  salesPersonId?: string
  salesPersonName?: string
  clientContacts: ClientContact[]
  primaryContactId?: string

  // Detalhes da oportunidade
  jobTitle: string
  tipoServico: string
  titulo: string
  descricao: string
  scopeOfWork: string
  likelihoodOfConversion: LikelihoodOfConversion

  // Status e datas
  status: QuoteStatus
  dataCriacao: string
  dataValidade: string
  dataEnvio?: string
  dataAprovacao?: string
  dataArquivamento?: string

  // Condições comerciais
  currency: Currency
  formaPagamento: PaymentTerm
  prazoExecucao: string

  // Itens e valores
  itens: QuoteItem[]

  // Cálculos financeiros
  coast: number // Custo base
  subtotal: number
  descontoPercentual?: number
  descontoValor?: number
  upliftPercentual?: number // Margem adicional
  upliftValor?: number
  taxaPercentual?: number // Taxa/imposto
  taxaValor?: number
  valorTotal: number

  // Pré-requisitos e entregáveis
  clientPrerequisites: ClientPrerequisite[]
  deliverableProfessionals: DeliverableProfessional[]
  deliverableServices: DeliverableService[]

  // Observações e anexos
  notes?: string
  observacoes?: string
  termos?: string
  anexos?: number

  // Metadados
  criadoEm: string
  atualizadoEm: string
  arquivadoEm?: string
  arquivadoPor?: string
}

// Tipos para estatísticas
export type QuoteStatistics = {
  total: number
  porStatus: Record<QuoteStatus, number>
  porLikelihood: Record<LikelihoodOfConversion, number>
  porCurrency: Record<Currency, number>
  porSalesPerson: Record<string, number>
  valorTotalPorStatus: Record<QuoteStatus, number>
  valorTotalPorCurrency: Record<Currency, number>
  taxaConversao: number
  tempoMedioAprovacao: number // em dias
  valorMedioQuote: number
  quotesVencendasProximos30Dias: number
  quotesArquivadas: number
}
