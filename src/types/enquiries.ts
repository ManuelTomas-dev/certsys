export type EnquiryStatus =
  | "Nova"
  | "Em Análise"
  | "Cotação Enviada"
  | "Aprovada"
  | "Rejeitada"
  | "Convertida"
  | "Fechada"
  | "Arquivada"

export type ServiceType = "Inspeção" | "Certificação" | "Auditoria" | "Consultoria" | "Treinamento"

export type Priority = "Baixa" | "Média" | "Alta" | "Crítica"

export type EnquiryOrigin =
  | "Website"
  | "Email"
  | "Telefone"
  | "Referência"
  | "Evento"
  | "Visita Comercial"
  | "Redes Sociais"

export type Probability = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100

export type StatusHistoryEntry = {
  status: EnquiryStatus
  data: string
  responsavel: string
  observacao?: string
}

export type Enquiry = {
  id: string
  titulo: string
  origem: EnquiryOrigin
  data: string // ISO date
  equipaVenda: string
  descricao: string
  notas?: string
  nomeCliente: string
  localizacaoCliente: string
  contactoCliente: string
  probabilidade: Probability

  // Campos existentes mantidos para compatibilidade
  clientId?: string
  clientName: string
  workLocationId?: string
  workLocationName?: string
  responsavelId?: string
  responsavelName?: string
  tipoServico: ServiceType
  prioridade: Priority
  status: EnquiryStatus
  dataSolicitacao: string // ISO date
  dataLimite?: string // ISO date
  valorEstimado?: number
  observacoes?: string
  anexos?: string[]
  historico?: StatusHistoryEntry[]
  slaStatus?: "Em Dia" | "Próximo do Vencimento" | "Vencido"
  criadoEm: string // ISO
  atualizadoEm: string // ISO
}
