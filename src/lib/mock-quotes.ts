import type {
  Quote,
  QuoteStatistics,
  Currency,
  LikelihoodOfConversion,
  ClientContact,
  ClientPrerequisite,
  DeliverableProfessional,
  DeliverableService,
  QuoteItem,
  QuoteStatus,
} from "@/types/quotes"
import type { Enquiry } from "@/types/enquiries"
import type { Client } from "@/types/customers"
import type { WorkLocation } from "@/types/work-locations"
import type { Personnel } from "@/types/personnel"

export const currencies: Currency[] = ["AOA", "USD", "EUR", "BRL"]
export const likelihoodLevels: LikelihoodOfConversion[] = ["Baixa", "Média", "Alta", "Muito Alta"]
export const statusQuote: QuoteStatus[] = [
  "Rascunho",
  "Enviada",
  "Em Revisão",
  "Aprovada",
  "Rejeitada",
  "Expirada",
  "Arquivada",
]
export const paymentTerms = ["À Vista", "30 Dias", "60 Dias", "90 Dias", "Parcelado"] as const

export function uid(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-"
  try {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

export function formatCurrency(value: number | undefined, currency: Currency = "AOA"): string {
  if (value === undefined || value === null) return "0,00"

  const symbols = {
    AOA: "Kz",
    USD: "$",
    EUR: "€",
    BRL: "R$",
  }

  return `${symbols[currency]} ${value.toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function generateClientContacts(clientName: string): ClientContact[] {
  const contacts: ClientContact[] = []
  const firstNames = ["João", "Maria", "Pedro", "Ana", "Carlos", "Sofia", "Miguel", "Rita"]
  const lastNames = ["Silva", "Santos", "Ferreira", "Pereira", "Oliveira", "Costa"]
  const positions = ["Diretor Geral", "Gestor de Projetos", "Coordenador Técnico", "Responsável Comercial"]

  const numContacts = Math.floor(Math.random() * 3) + 1 // 1-3 contatos

  for (let i = 0; i < numContacts; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]

    contacts.push({
      id: uid(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${clientName.toLowerCase().replace(/\s+/g, "")}.co.ao`,
      phone: `+244 9${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
      position,
      isPrimary: i === 0,
    })
  }

  return contacts
}

function generateClientPrerequisites(): ClientPrerequisite[] {
  const prerequisites = [
    { name: "Certificação ISO 9001", description: "Empresa deve possuir certificação ISO 9001 válida" },
    { name: "Seguro de Responsabilidade Civil", description: "Seguro com cobertura mínima de $100,000" },
    { name: "Registo Comercial", description: "Empresa registada legalmente em Angola" },
    { name: "Equipa Técnica Qualificada", description: "Técnicos com certificações reconhecidas" },
    { name: "Equipamentos Calibrados", description: "Equipamentos com certificados de calibração válidos" },
  ]

  return prerequisites.slice(0, Math.floor(Math.random() * 3) + 2).map((req) => ({
    id: uid(),
    name: req.name,
    description: req.description,
    required: Math.random() > 0.3,
    completed: Math.random() > 0.4,
    completedDate:
      Math.random() > 0.5
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        : undefined,
    notes: Math.random() > 0.7 ? "Documentação verificada e aprovada" : undefined,
  }))
}

function generateDeliverableProfessionals(): DeliverableProfessional[] {
  const professionals = [
    {
      name: "Engenheiro Sénior",
      role: "Engenheiro Chefe",
      experience: "10+ anos",
      certification: "Ordem dos Engenheiros",
      dailyRate: 25000,
    },
    {
      name: "Técnico Especializado",
      role: "Técnico de Inspeção",
      experience: "5+ anos",
      certification: "ASNT Level II",
      dailyRate: 15000,
    },
    {
      name: "Auditor Qualificado",
      role: "Auditor Principal",
      experience: "8+ anos",
      certification: "ISO 9001 Lead Auditor",
      dailyRate: 20000,
    },
    {
      name: "Consultor Especialista",
      role: "Consultor Técnico",
      experience: "12+ anos",
      certification: "PMP",
      dailyRate: 30000,
    },
  ]

  return professionals.slice(0, Math.floor(Math.random() * 3) + 1).map((prof) => ({
    id: uid(),
    ...prof,
  }))
}

function generateDeliverableServices(): DeliverableService[] {
  const services = [
    { name: "Inspeção Visual", description: "Inspeção visual detalhada", duration: "2 dias", cost: 50000 },
    { name: "Teste Ultrassónico", description: "Testes não destrutivos", duration: "3 dias", cost: 75000 },
    { name: "Relatório Técnico", description: "Relatório completo com recomendações", duration: "1 dia", cost: 25000 },
    { name: "Certificação", description: "Emissão de certificado", duration: "1 dia", cost: 15000 },
  ]

  return services.slice(0, Math.floor(Math.random() * 3) + 1).map((service) => ({
    id: uid(),
    ...service,
    prerequisites: Math.random() > 0.5 ? ["Acesso ao local", "Equipamentos parados"] : undefined,
  }))
}

function generateQuoteItems(): QuoteItem[] {
  const items = [
    { descricao: "Inspeção de Vasos de Pressão", unidade: "Unidade", valorUnitario: 75000 },
    { descricao: "Teste Hidrostático", unidade: "Teste", valorUnitario: 45000 },
    { descricao: "Certificação de Conformidade", unidade: "Certificado", valorUnitario: 25000 },
    { descricao: "Relatório Técnico Detalhado", unidade: "Relatório", valorUnitario: 35000 },
    { descricao: "Consultoria Técnica", unidade: "Hora", valorUnitario: 5000 },
  ]

  const numItems = Math.floor(Math.random() * 3) + 1
  return items.slice(0, numItems).map((item) => {
    const quantidade = Math.floor(Math.random() * 5) + 1
    return {
      id: uid(),
      ...item,
      quantidade,
      valorTotal: quantidade * item.valorUnitario,
      observacao: Math.random() > 0.7 ? "Inclui deslocação e materiais" : undefined,
    }
  })
}

export function makeMockQuotes(
  enquiries: Enquiry[],
  clients: Client[],
  workLocations: WorkLocation[],
  personnel: Personnel[],
  count = 25,
): Quote[] {
  const quotes: Quote[] = []
  const tiposServico = ["Inspeção", "Certificação", "Auditoria", "Consultoria", "Treinamento"]

  // Filtrar pessoal comercial/técnico
  const salesPersons = personnel.filter(
    (p) =>
      p.funcao.toLowerCase().includes("coordenador") ||
      p.funcao.toLowerCase().includes("supervisor") ||
      p.funcao.toLowerCase().includes("engenheiro") ||
      p.funcao.toLowerCase().includes("gestor") ||
      p.funcao.toLowerCase().includes("comercial"),
  )

  for (let i = 0; i < count; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)]
    const clientWorkLocations = workLocations.filter((wl) => wl.clientId === client.id)
    const workLocation =
      clientWorkLocations.length > 0
        ? clientWorkLocations[Math.floor(Math.random() * clientWorkLocations.length)]
        : undefined
    const salesPerson =
      salesPersons.length > 0 ? salesPersons[Math.floor(Math.random() * salesPersons.length)] : undefined
    const enquiry =
      enquiries.length > 0 && Math.random() > 0.6 ? enquiries[Math.floor(Math.random() * enquiries.length)] : undefined

    const tipoServico = tiposServico[Math.floor(Math.random() * tiposServico.length)]
    const status = statusQuote[Math.floor(Math.random() * statusQuote.length)]
    const currency = currencies[Math.floor(Math.random() * currencies.length)]
    const likelihood = likelihoodLevels[Math.floor(Math.random() * likelihoodLevels.length)]

    const clientContacts = generateClientContacts(client.nome)
    const primaryContact = clientContacts.find((c) => c.isPrimary)

    const dataCriacao = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const dataValidade = new Date(Date.now() + (Math.random() * 60 + 30) * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)

    const itens = generateQuoteItems()
    const coast = itens.reduce((sum, item) => sum + item.valorTotal * 0.6, 0) // 60% do valor como custo
    const subtotal = itens.reduce((sum, item) => sum + item.valorTotal, 0)

    const descontoPercentual = Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 5 : 0
    const descontoValor = (subtotal * descontoPercentual) / 100

    const upliftPercentual = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 10 : 0
    const upliftValor = (subtotal * upliftPercentual) / 100

    const taxaPercentual = currency === "AOA" ? 14 : Math.floor(Math.random() * 10) + 5
    const baseForTax = subtotal - descontoValor + upliftValor
    const taxaValor = (baseForTax * taxaPercentual) / 100

    const valorTotal = baseForTax + taxaValor

    const now = new Date().toISOString()

    quotes.push({
      id: uid(),
      numero: `COT-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}`,
      enquiryId: enquiry?.id,
      enquiryTitulo: enquiry?.titulo,
      clientId: client.id,
      clientName: client.nome,
      clientLocationId: workLocation?.id,
      clientLocationName: workLocation?.nome,
      workLocationId: workLocation?.id,
      workLocationName: workLocation?.nome,
      salesPersonId: salesPerson?.id,
      salesPersonName: salesPerson ? `${salesPerson.nome} ${salesPerson.sobrenome}` : undefined,
      clientContacts,
      primaryContactId: primaryContact?.id,
      jobTitle: `${tipoServico} - ${client.nome}`,
      tipoServico,
      titulo: `Cotação ${tipoServico} - ${client.nome}`,
      descricao: `Proposta comercial para ${tipoServico.toLowerCase()} especializada conforme requisitos do cliente.`,
      scopeOfWork: `Execução de ${tipoServico.toLowerCase()} completo incluindo análise técnica detalhada, testes necessários, documentação completa e certificação final. Trabalho será executado por equipa especializada com equipamentos calibrados.`,
      likelihoodOfConversion: likelihood,
      status,
      dataCriacao,
      dataValidade,
      dataEnvio:
        status !== "Rascunho"
          ? new Date(new Date(dataCriacao).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10)
          : undefined,
      dataAprovacao:
        status === "Aprovada"
          ? new Date(new Date(dataCriacao).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10)
          : undefined,
      dataArquivamento:
        status === "Arquivada"
          ? new Date(new Date(dataCriacao).getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10)
          : undefined,
      currency,
      formaPagamento: paymentTerms[Math.floor(Math.random() * paymentTerms.length)],
      prazoExecucao: `${Math.floor(Math.random() * 30) + 15} dias`,
      itens,
      coast,
      subtotal,
      descontoPercentual,
      descontoValor,
      upliftPercentual,
      upliftValor,
      taxaPercentual,
      taxaValor,
      valorTotal,
      clientPrerequisites: generateClientPrerequisites(),
      deliverableProfessionals: generateDeliverableProfessionals(),
      deliverableServices: generateDeliverableServices(),
      notes: Math.random() > 0.6 ? "Cliente demonstrou interesse elevado. Acompanhar de perto." : undefined,
      observacoes: Math.random() > 0.7 ? "Projeto estratégico para expansão no mercado." : undefined,
      termos:
        "1. Validade conforme data indicada.\n2. Pagamento conforme condições acordadas.\n3. Execução após aprovação formal.\n4. Preços sujeitos a alteração sem aviso prévio após validade.",
      anexos: Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : undefined,
      criadoEm: now,
      atualizadoEm: now,
      arquivadoEm: status === "Arquivada" ? now : undefined,
      arquivadoPor:
        status === "Arquivada" ? (salesPerson ? `${salesPerson.nome} ${salesPerson.sobrenome}` : "Sistema") : undefined,
    })
  }

  return quotes.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
}

export function calculateQuoteStatistics(quotes: Quote[]): QuoteStatistics {
  const total = quotes.length

  // Por status
  const porStatus = statusQuote.reduce(
    (acc, status) => {
      acc[status] = quotes.filter((q) => q.status === status).length
      return acc
    },
    {} as Record<QuoteStatus, number>,
  )

  // Por likelihood
  const porLikelihood = likelihoodLevels.reduce(
    (acc, level) => {
      acc[level] = quotes.filter((q) => q.likelihoodOfConversion === level).length
      return acc
    },
    {} as Record<LikelihoodOfConversion, number>,
  )

  // Por currency
  const porCurrency = currencies.reduce(
    (acc, currency) => {
      acc[currency] = quotes.filter((q) => q.currency === currency).length
      return acc
    },
    {} as Record<Currency, number>,
  )

  // Por sales person
  const porSalesPerson: Record<string, number> = {}
  quotes.forEach((q) => {
    if (q.salesPersonName) {
      porSalesPerson[q.salesPersonName] = (porSalesPerson[q.salesPersonName] || 0) + 1
    }
  })

  // Valor total por status
  const valorTotalPorStatus = statusQuote.reduce(
    (acc, status) => {
      acc[status] = quotes.filter((q) => q.status === status).reduce((sum, q) => sum + q.valorTotal, 0)
      return acc
    },
    {} as Record<QuoteStatus, number>,
  )

  // Valor total por currency
  const valorTotalPorCurrency = currencies.reduce(
    (acc, currency) => {
      acc[currency] = quotes.filter((q) => q.currency === currency).reduce((sum, q) => sum + q.valorTotal, 0)
      return acc
    },
    {} as Record<Currency, number>,
  )

  // Taxa de conversão
  const aprovadas = quotes.filter((q) => q.status === "Aprovada").length
  const enviadas = quotes.filter((q) => q.status !== "Rascunho").length
  const taxaConversao = enviadas > 0 ? (aprovadas / enviadas) * 100 : 0

  // Tempo médio de aprovação
  const cotacoesAprovadas = quotes.filter((q) => q.status === "Aprovada" && q.dataAprovacao)
  const tempoMedioAprovacao =
    cotacoesAprovadas.length > 0
      ? cotacoesAprovadas.reduce((sum, q) => {
          const criacao = new Date(q.dataCriacao).getTime()
          const aprovacao = new Date(q.dataAprovacao!).getTime()
          return sum + (aprovacao - criacao) / (1000 * 60 * 60 * 24)
        }, 0) / cotacoesAprovadas.length
      : 0

  // Valor médio de quote
  const valorMedioQuote = total > 0 ? quotes.reduce((sum, q) => sum + q.valorTotal, 0) / total : 0

  // Quotes vencendo nos próximos 30 dias
  const hoje = new Date()
  const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
  const quotesVencendasProximos30Dias = quotes.filter((q) => {
    const validade = new Date(q.dataValidade)
    return (
      validade >= hoje && validade <= em30Dias && !["Aprovada", "Rejeitada", "Expirada", "Arquivada"].includes(q.status)
    )
  }).length

  // Quotes arquivadas
  const quotesArquivadas = quotes.filter((q) => q.status === "Arquivada").length

  return {
    total,
    porStatus,
    porLikelihood,
    porCurrency,
    porSalesPerson,
    valorTotalPorStatus,
    valorTotalPorCurrency,
    taxaConversao,
    tempoMedioAprovacao,
    valorMedioQuote,
    quotesVencendasProximos30Dias,
    quotesArquivadas,
  }
}
