"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ConeIcon as Crane,
  FileText,
  Users,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  StopCircle,
  GraduationCap,
  Monitor,
  FileSearch,
  MessageSquare,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QHSENavigationProps {
  onModuleSelect: (moduleId: string, category: string) => void
  activeModule?: string
}

const moduleIcons = {
  search: Search,
  crane: Crane,
  "file-text": FileText,
  users: Users,
  shield: Shield,
  "clipboard-check": ClipboardCheck,
  "alert-triangle": AlertTriangle,
  "stop-circle": StopCircle,
  "graduation-cap": GraduationCap,
  monitor: Monitor,
  "file-search": FileSearch,
  "message-square": MessageSquare,
  "x-circle": XCircle,
}

export function QHSENavigation({ onModuleSelect, activeModule }: QHSENavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string>("quality")

  const categories = [
    {
      id: "quality",
      name: "Quality",
      description: "Gestão da Qualidade",
      modules: [
        { id: "inspection", name: "Inspection", description: "Inspeções de equipamentos", icon: "search" },
        { id: "lifting", name: "Lifting", description: "Operações de elevação", icon: "crane" },
        { id: "iso", name: "ISO", description: "Documentos ISO", icon: "file-text" },
        { id: "sqm", name: "SQM", description: "Gestão de fornecedores", icon: "users" },
      ],
    },
    {
      id: "hse",
      name: "HSE",
      description: "Health, Safety & Environment",
      modules: [
        { id: "permit-work", name: "Permit Work", description: "Permissões de trabalho", icon: "clipboard-check" },
        { id: "welding-work", name: "Welding Work", description: "Trabalhos de soldagem", icon: "shield" },
        { id: "jsa", name: "JSA", description: "Job Safety Analysis", icon: "alert-triangle" },
        { id: "stop-card", name: "Stop Card", description: "Cartões de parada", icon: "stop-circle" },
      ],
    },
    {
      id: "training",
      name: "Training",
      description: "Treinamentos e Capacitação",
      modules: [
        { id: "prezi", name: "Prezi", description: "Apresentações de treinamento", icon: "monitor" },
        { id: "online", name: "Online", description: "Treinamentos online", icon: "graduation-cap" },
      ],
    },
    {
      id: "audit",
      name: "Audit",
      description: "Auditorias e Conformidade",
      modules: [
        { id: "audit", name: "Audit", description: "Auditorias internas", icon: "file-search" },
        { id: "claims", name: "Claims", description: "Reclamações", icon: "message-square" },
        { id: "non-conform", name: "Non Conform.", description: "Não conformidades", icon: "x-circle" },
      ],
    },
  ]

  const activeCategories = categories.find((cat) => cat.id === activeCategory)

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
            className="flex-1 min-w-[120px]"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Active Category Info */}
      {activeCategories && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{activeCategories.name}</CardTitle>
            <CardDescription>{activeCategories.description}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Modules Grid */}
      {activeCategories && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {activeCategories.modules.map((module) => {
            const IconComponent = moduleIcons[module.icon as keyof typeof moduleIcons] || FileText
            const isActive = activeModule === module.id

            return (
              <Card
                key={module.id}
                className={cn("cursor-pointer transition-all hover:shadow-md", isActive && "ring-2 ring-primary")}
                onClick={() => onModuleSelect(module.id, activeCategory)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-6 w-6 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {activeCategory}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{module.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
