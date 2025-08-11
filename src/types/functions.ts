export type FunctionStatus = "Ativo" | "Arquivado"

export type Funcao = {
  id: string
  designacao: string // Designação da função
  descricao: string
  status: FunctionStatus
  criadoEm: string // ISO
  atualizadoEm: string // ISO
}
