export type InspectionStatus = "Agendada" | "Em Andamento" | "Concluída" | "Aprovada" | "Rejeitada" | "Arquivada"

export type InspectionType = "Visual" | "NDT" | "Dimensional" | "Funcional" | "Hidrostática" | "Pneumática"

export type InspectionResult = "Conforme" | "Não Conforme" | "Condicional"

export type Inspection = {
  id: string
  clientId: string
  clientName: string
  workLocationId: string
  workLocationName: string
  inspectorId: string
  inspectorName: string
  tipo: InspectionType
  equipamento: string // Nome/Tag do equipamento
  dataInspecao: string // ISO date
  proximaInspecao?: string // ISO date
  status: InspectionStatus
  normasAplicaveis: string
  resultado?: InspectionResult
  observacoes?: string
  anexos?: number // Simulado - quantidade de anexos
  criadoEm: string // ISO
  atualizadoEm: string // ISO
}
