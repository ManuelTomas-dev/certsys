import type { Client } from "@/types/customers"
import type { WorkLocation, WorkLocationType } from "@/types/work-locations"

export const tiposWorkLocation: WorkLocationType[] = ["Onshore", "Offshore", "Base", "Plataforma", "Estaleiro"]

export function uid() {
  return Math.random().toString(36).slice(2, 10)
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

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const cidades = ["Luanda", "Soyo", "Cabinda", "Lobito", "Benguela", "Namibe"]
const paises = ["Angola", "Portugal", "Brasil"]

export function makeMockWorkLocations(clients: Client[], count = 26): WorkLocation[] {
  const now = new Date()
  const items: WorkLocation[] = []
  for (let i = 0; i < count; i++) {
    const client = randomFrom(clients)
    const id = uid()
    const nome = `${randomFrom(["Base", "Plataforma", "Unidade", "Estaleiro", "Yard", "Terminal"])} ${Math.floor(100 + Math.random() * 900)}`
    const criado = new Date(now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365))
    const atualizado = new Date(criado.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 160))
    const pais = randomFrom(paises)
    const cidade = randomFrom(cidades)
    items.push({
      id,
      clientId: client.id,
      clientName: client.nome,
      nome,
      tipo: randomFrom(tiposWorkLocation),
      pais,
      cidade,
      endereco: `Av. Industrial, ${Math.floor(100 + Math.random() * 900)} - ${cidade}`,
      latitude: (-8 + Math.random()).toFixed(6),
      longitude: (13 + Math.random()).toFixed(6),
      responsavelNome: randomFrom(["Ana Costa", "Bruno Silva", "Carla Santos", "Diego Fernandes"]),
      responsavelEmail: `contato${Math.floor(Math.random() * 9000)}@${client.nome
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")}.co.ao`,
      responsavelTelefone: `+244 9${Math.floor(10000000 + Math.random() * 89999999)}`,
      observacoes:
        "Local com operação " +
        (Math.random() > 0.5 ? "onshore" : "offshore") +
        " e requisitos de segurança reforçados.",
      status: Math.random() > 0.12 ? "Ativo" : "Arquivado",
      criadoEm: criado.toISOString(),
      atualizadoEm: atualizado.toISOString(),
    })
  }
  return items
}
