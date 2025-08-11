import type { Personnel, AccessLevel } from "@/types/personnel"

const nivelAcessoOptions: AccessLevel[] = ["Leitor", "Operador", "Supervisor", "Administrador"]
const funcoesSeed = [
  "Técnico de Inspeção",
  "Engenheiro de Manutenção",
  "Supervisor de Campo",
  "Especialista NDT",
  "Coordenador de Segurança",
]
const localidadesSeed = ["Luanda", "Cabinda", "Soyo", "Lobito", "Porto Amboim"]
const supervisoresSeed = ["Ana Costa", "Bruno Silva", "Carla Santos", "Diego Fernandes"]

export { nivelAcessoOptions, funcoesSeed, localidadesSeed, supervisoresSeed }

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%*"
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("")
}

export function formatDate(iso?: string) {
  if (!iso) return "-"
  try {
    const d = new Date(iso)
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}

export function makeMockPersonnel(count = 24): Personnel[] {
  const nomes = ["João", "Maria", "Pedro", "Luísa", "Paulo", "Teresa", "Miguel", "Rita", "Carlos", "Sofia"]
  const sobrenomes = ["Lopes", "Silva", "Santos", "Pereira", "Fernandes", "Gomes", "Costa", "Almeida"]
  const locaisNasc = ["Luanda", "Benguela", "Huíla", "Huambo", "Malanje", "Namibe"]

  const list: Personnel[] = []
  for (let i = 0; i < count; i++) {
    const nome = randomFrom(nomes)
    const sobrenome = randomFrom(sobrenomes)
    const titulo = randomFrom(["Sr.", "Sra.", "Dr.", "Eng.", "Tec."])
    const dataNascimento = new Date(
      1975 + Math.floor(Math.random() * 25),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
    const validade = new Date(
      2026 + Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )
    const created = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    list.push({
      id: uid(),
      nome,
      sobrenome,
      titulo,
      dataNascimento: dataNascimento.toISOString().slice(0, 10),
      localNascimento: randomFrom(locaisNasc),
      biNumero: `AO${Math.floor(100000 + Math.random() * 899999)}`,
      inss: `${Math.floor(100000000 + Math.random() * 899999999)}`,
      validadeDocumento: validade.toISOString().slice(0, 10),
      nivelAcesso: randomFrom(nivelAcessoOptions),
      supervisor: randomFrom(supervisoresSeed),
      funcao: randomFrom(funcoesSeed),
      nomePai: randomFrom(nomes) + " " + randomFrom(sobrenomes),
      nomeMae: randomFrom(nomes) + " " + randomFrom(sobrenomes),
      telefonePessoal: `+244 9${Math.floor(10000000 + Math.random() * 89999999)}`,
      telefoneTrabalho: `+244 2${Math.floor(10000000 + Math.random() * 89999999)}`,
      email: `${nome.toLowerCase()}.${sobrenome.toLowerCase()}@empresa.co.ao`,
      localidade: randomFrom(localidadesSeed),
      status: Math.random() > 0.9 ? "Arquivado" : "Ativo",
      criadoEm: created.toISOString(),
    })
  }
  return list
}
