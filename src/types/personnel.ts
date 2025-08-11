export type Status = "Ativo" | "Arquivado"

export type AccessLevel = "Leitor" | "Operador" | "Supervisor" | "Administrador"

export type Personnel = {
  id: string
  nome: string
  sobrenome: string
  titulo: string
  dataNascimento: string // ISO date
  localNascimento: string
  biNumero: string
  inss: string
  validadeDocumento: string // ISO date
  nivelAcesso: AccessLevel
  supervisor: string
  funcao: string
  nomePai: string
  nomeMae: string
  telefonePessoal: string
  telefoneTrabalho: string
  email: string
  localidade: string
  status: Status
  criadoEm: string // ISO date
}

export type Filters = {
  busca: string
  funcao: string
  localidade: string
  supervisor: string
  status: "Todos" | Status
}
