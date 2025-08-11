import type { Funcao } from "@/types/functions"

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

const nomesBase = [
    "Técnico de Inspeção",
    "Engenheiro de Manutenção",
    "Supervisor de Campo",
    "Especialista NDT",
    "Coordenador de Segurança",
    "Analista de Qualidade",
    "Planejador de Manutenção",
    "Operador de Equipamentos",
    "Gestor de Certificação",
    "Auditor Interno",
    "Responsável HSE",
    "Técnico de Calibração",
    "Inspetor de Soldadura",
    "Engenheiro de Integridade",
]

export function makeMockFunctions(count = 18): Funcao[] {
    const now = new Date()
    const items: Funcao[] = []
    for (let i = 0; i < count; i++) {
        const base = nomesBase[i % nomesBase.length]
        const id = uid()
        const criado = new Date(now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180))
        const atualizado = new Date(criado.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 60))
        items.push({
            id,
            designacao: base,
            descricao:
                "Responsável por " +
                base.toLowerCase() +
                " no contexto de operações, manutenção e certificação, assegurando conformidade e segurança.",
            status: Math.random() > 0.15 ? "Ativo" : "Arquivado",
            criadoEm: criado.toISOString(),
            atualizadoEm: atualizado.toISOString(),
        })
    }
    return items
}
