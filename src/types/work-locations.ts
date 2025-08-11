export type WorkLocationStatus = "Ativo" | "Arquivado"

export type WorkLocationType = "Onshore" | "Offshore" | "Base" | "Plataforma" | "Estaleiro"

export type WorkLocation = {
  id: string
  clientId: string
  clientName: string
  nome: string // Designação do Local
  tipo: WorkLocationType
  pais: string
  cidade: string
  endereco: string
  latitude?: string
  longitude?: string
  responsavelNome?: string
  responsavelEmail?: string
  responsavelTelefone?: string
  observacoes?: string
  status: WorkLocationStatus
  criadoEm: string // ISO
  atualizadoEm: string // ISO
}
