import type { Client } from "@/types/customers"

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

const nomes = [
  "Sonangol E.P.",
  "TotalEnergies Angola",
  "Chevron Angola",
  "BP Angola",
  "Eni Angola",
  "Halliburton Angola",
  "Schlumberger Angola",
  "Baker Hughes Angola",
  "TechnipFMC Angola",
  "MODEC Angola",
  "Subsea 7 Angola",
  "Saipem Angola",
]
const cidades = ["Luanda", "Cabinda", "Soyo", "Lobito", "Benguela", "Namibe"]
const paises = ["Angola", "Portugal", "Brasil"]
const segmentos = ["Oil & Gas", "Serviços Industriais", "Engenharia", "HSE", "Inspeção e Certificação"]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function makeMockClients(count = 22): Client[] {
  const now = new Date()
  const items: Client[] = []
  for (let i = 0; i < count; i++) {
    const id = uid()
    const nome = nomes[i % nomes.length] + (i >= nomes.length ? ` ${i}` : "")
    const criado = new Date(now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365))
    const atualizado = new Date(criado.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 120))
    const pais = randomFrom(paises)
    const cidade = randomFrom(cidades)
    const segmento = randomFrom(segmentos)
    items.push({
      id,
      nome,
      nif: String(Math.floor(100000000 + Math.random() * 899999999)),
      email:
        nome
          .toLowerCase()
          .replace(/\s+/g, ".")
          .replace(/[^\w.]/g, "") + "@cliente.co.ao",
      telefone: `+244 9${Math.floor(10000000 + Math.random() * 89999999)}`,
      website:
        "https://www." +
        nome
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") +
        ".com",
      pais,
      cidade,
      endereco: `Av. Principal, ${Math.floor(Math.random() * 900) + 100} - ${cidade}`,
      segmento,
      observacoes:
        "Cliente estratégico do segmento " + segmento + ", com operações em " + cidade + " e projetos offshore.",
      status: Math.random() > 0.12 ? "Ativo" : "Arquivado",
      criadoEm: criado.toISOString(),
      atualizadoEm: atualizado.toISOString(),
    })
  }
  return items
}
