import type { Enquiry, ServiceType, EnquiryStatus, Priority, EnquiryOrigin, Probability } from "@/types/enquiries"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"

export const tiposServico: ServiceType[] = ["Inspeção", "Certificação", "Auditoria", "Consultoria", "Treinamento"]
export const statusEnquiry: EnquiryStatus[] = [
  "Nova",
  "Em Análise",
  "Cotação Enviada",
  "Aprovada",
  "Rejeitada",
  "Convertida",
  "Fechada",
  "Arquivada",
]
export const prioridades: Priority[] = ["Baixa", "Média", "Alta", "Crítica"]
export const origens: EnquiryOrigin[] = [
  "Website",
  "Email",
  "Telefone",
  "Referência",
  "Evento",
  "Visita Comercial",
  "Redes Sociais",
]
export const probabilidades: Probability[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

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

export function formatCurrency(value?: number) {
  if (!value) return "-"
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(value)
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const titulos = [
  "Inspeção de Vasos de Pressão",
  "Certificação ISO 9001",
  "Auditoria de Segurança",
  "Consultoria em NDT",
  "Treinamento em Soldadura",
  "Inspeção de Tubulações",
  "Certificação de Equipamentos",
  "Auditoria Ambiental",
  "Consultoria QSHE",
  "Treinamento em API 510",
]

const equipasVenda = [
  "Equipa Norte",
  "Equipa Sul",
  "Equipa Centro",
  "Equipa Offshore",
  "Equipa Industrial",
  "Equipa Comercial A",
  "Equipa Comercial B",
]

const localizacoes = [
  "Luanda, Angola",
  "Cabinda, Angola",
  "Soyo, Angola",
  "Lobito, Angola",
  "Benguela, Angola",
  "Huambo, Angola",
  "Malanje, Angola",
]

export function makeMockEnquiries(
  clients: Client[],
  workLocations: WorkLocation[],
  personnel: Personnel[],
  count = 28,
): Enquiry[] {
  const now = new Date()
  const items: Enquiry[] = []

  // Filtrar responsáveis (pessoal comercial/técnico)
  const responsaveis = personnel.filter(
    (p) =>
      p.funcao.toLowerCase().includes("coordenador") ||
      p.funcao.toLowerCase().includes("supervisor") ||
      p.funcao.toLowerCase().includes("engenheiro") ||
      p.funcao.toLowerCase().includes("gestor"),
  )

  for (let i = 0; i < count; i++) {
    const client = randomFrom(clients)
    const workLocation =
      Math.random() > 0.3 ? randomFrom(workLocations.filter((wl) => wl.clientId === client.id)) : undefined
    const responsavel = Math.random() > 0.2 ? randomFrom(responsaveis.length > 0 ? responsaveis : personnel) : undefined

    const id = uid()
    const tipoServico = randomFrom(tiposServico)
    const status = randomFrom(statusEnquiry)
    const prioridade = randomFrom(prioridades)
    const origem = randomFrom(origens)
    const probabilidade = randomFrom(probabilidades)
    const equipaVenda = randomFrom(equipasVenda)

    // Data de solicitação (últimos 3 meses)
    const dataSolicitacao = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 90)

    // Data limite (1 semana a 2 meses após solicitação)
    const dataLimite =
      Math.random() > 0.3
        ? new Date(dataSolicitacao.getTime() + (7 + Math.random() * 53) * 1000 * 60 * 60 * 24)
        : undefined

    const criado = new Date(dataSolicitacao.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 2)
    const atualizado = new Date(criado.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 30)

    // Valor estimado baseado no tipo de serviço
    let valorEstimado: number | undefined
    if (Math.random() > 0.2) {
      const baseValues = {
        Inspeção: 50000,
        Certificação: 150000,
        Auditoria: 100000,
        Consultoria: 200000,
        Treinamento: 80000,
      }
      valorEstimado = baseValues[tipoServico] * (0.5 + Math.random() * 1.5)
    }

    // Gerar contacto fictício
    const contactos = [
      "+244 923 456 789",
      "+244 912 345 678",
      "+244 934 567 890",
      "geral@empresa.co.ao",
      "comercial@cliente.ao",
      "projetos@company.com",
    ]

    items.push({
      id,
      titulo: randomFrom(titulos),
      origem,
      data: dataSolicitacao.toISOString().slice(0, 10),
      equipaVenda,
      descricao: `Solicitação de ${tipoServico.toLowerCase()} para equipamentos críticos conforme normas aplicáveis. Necessário atendimento ${prioridade.toLowerCase()} devido aos requisitos operacionais.`,
      notas:
        Math.random() > 0.5
          ? `Cliente demonstrou interesse em ${tipoServico.toLowerCase()}. Seguimento necessário em ${Math.floor(Math.random() * 7 + 1)} dias.`
          : undefined,
      nomeCliente: client.nome,
      localizacaoCliente: randomFrom(localizacoes),
      contactoCliente: randomFrom(contactos),
      probabilidade,

      // Campos existentes para compatibilidade
      clientId: client.id,
      clientName: client.nome,
      workLocationId: workLocation?.id,
      workLocationName: workLocation?.nome,
      responsavelId: responsavel?.id,
      responsavelName: responsavel ? `${responsavel.nome} ${responsavel.sobrenome}` : undefined,
      tipoServico,
      prioridade,
      status,
      dataSolicitacao: dataSolicitacao.toISOString().slice(0, 10),
      dataLimite: dataLimite?.toISOString().slice(0, 10),
      valorEstimado,
      observacoes:
        status === "Rejeitada"
          ? "Cliente optou por fornecedor alternativo."
          : status === "Aprovada"
            ? "Proposta aprovada. Aguardando início dos trabalhos."
            : status === "Convertida"
              ? "Enquiry convertida em projeto ativo."
              : status === "Fechada"
                ? "Enquiry finalizada sem conversão."
                : "Em análise técnica e comercial.",
      criadoEm: criado.toISOString(),
      atualizadoEm: atualizado.toISOString(),
    })
  }

  return items.sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime())
}
