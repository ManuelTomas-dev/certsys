export type CustomerStatus = "Ativo" | "Arquivado"

export type Client = {
  id: string
  nome: string // Razão Social / Nome do Cliente
  nif: string // Número de contribuinte
  email: string
  telefone: string
  website?: string
  pais: string
  cidade: string
  endereco: string
  segmento?: string // indústria/segmento opcional
  observacoes?: string
  status: CustomerStatus
  criadoEm: string // ISO
  atualizadoEm: string // ISO
}
