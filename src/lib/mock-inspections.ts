import type { Inspection, InspectionType, InspectionStatus, InspectionResult } from "@/types/inspections"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"

export const tiposInspection: InspectionType[] = [
  "Visual",
  "NDT",
  "Dimensional",
  "Funcional",
  "Hidrostática",
  "Pneumática",
]
export const statusInspection: InspectionStatus[] = [
  "Agendada",
  "Em Andamento",
  "Concluída",
  "Aprovada",
  "Rejeitada",
  "Arquivada",
]
export const resultadosInspection: InspectionResult[] = ["Conforme", "Não Conforme", "Condicional"]

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

const equipamentos = [
  "Vaso de Pressão VP-001",
  "Tubulação TP-002",
  "Válvula VLV-003",
  "Bomba BM-004",
  "Compressor CP-005",
  "Trocador de Calor TC-006",
  "Tanque TQ-007",
  "Estrutura EST-008",
  "Guindaste GD-009",
  "Sistema Elétrico SE-010",
]

const normas = [
  "API 510",
  "API 570",
  "API 653",
  "ASME VIII",
  "ASME B31.3",
  "ISO 9001",
  "PETROBRAS N-1594",
  "ABNT NBR 15280",
]

export function makeMockInspections(
  clients: Client[],
  workLocations: WorkLocation[],
  personnel: Personnel[],
  count = 32,
): Inspection[] {
  const now = new Date()
  const items: Inspection[] = []

  // Filtrar apenas inspetores (pessoal com função relacionada a inspeção)
  const inspectors = personnel.filter(
    (p) =>
      p.funcao.toLowerCase().includes("inspe") ||
      p.funcao.toLowerCase().includes("técnico") ||
      p.funcao.toLowerCase().includes("ndt"),
  )

  for (let i = 0; i < count; i++) {
    const client = randomFrom(clients)
    const workLocation =
      randomFrom(workLocations.filter((wl) => wl.clientId === client.id)) || randomFrom(workLocations)
    const inspector = randomFrom(inspectors.length > 0 ? inspectors : personnel)

    const id = uid()
    const tipo = randomFrom(tiposInspection)
    const status = randomFrom(statusInspection)

    // Data da inspeção (últimos 6 meses ou próximos 3 meses)
    const dataInspecao = new Date(now.getTime() + (Math.random() - 0.7) * 1000 * 60 * 60 * 24 * 180)

    // Próxima inspeção (6 meses a 2 anos depois)
    const proximaInspecao = new Date(dataInspecao.getTime() + (180 + Math.random() * 540) * 1000 * 60 * 60 * 24)

    const criado = new Date(dataInspecao.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30)
    const atualizado = new Date(criado.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 15)

    // Resultado apenas para inspeções concluídas/aprovadas/rejeitadas
    let resultado: InspectionResult | undefined
    if (["Concluída", "Aprovada", "Rejeitada"].includes(status)) {
      resultado = randomFrom(resultadosInspection)
    }

    items.push({
      id,
      clientId: client.id,
      clientName: client.nome,
      workLocationId: workLocation.id,
      workLocationName: workLocation.nome,
      inspectorId: inspector.id,
      inspectorName: `${inspector.nome} ${inspector.sobrenome}`,
      tipo,
      equipamento: randomFrom(equipamentos),
      dataInspecao: dataInspecao.toISOString().slice(0, 10),
      proximaInspecao: proximaInspecao.toISOString().slice(0, 10),
      status,
      normasAplicaveis: randomFrom(normas),
      resultado,
      observacoes:
        resultado === "Não Conforme"
          ? "Identificadas não conformidades que requerem ação corretiva imediata."
          : "Inspeção realizada conforme procedimentos estabelecidos.",
      anexos: Math.floor(Math.random() * 5),
      criadoEm: criado.toISOString(),
      atualizadoEm: atualizado.toISOString(),
    })
  }

  return items.sort((a, b) => new Date(b.dataInspecao).getTime() - new Date(a.dataInspecao).getTime())
}
