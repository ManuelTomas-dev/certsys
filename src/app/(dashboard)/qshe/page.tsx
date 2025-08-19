"use client"
import { useState } from "react"
import { QHSENavigation } from "@/components/qhse/navigation"
import { QualityInspectionModule } from "@/components/qhse/quality/inspection"
import { QualityLiftingModule } from "@/components/qhse/quality/lifting"
import { QualityISOModule } from "@/components/qhse/quality/iso"
import { QualitySQMModule } from "@/components/qhse/quality/sqm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { HSEPermitWorkModule } from "@/components/qhse/hse/permit-work"
import { HSEWeldingWorkModule } from "@/components/qhse/hse/welding-work"
import { HSEJSAModule } from "@/components/qhse/hse/jsa"
import { HSEStopCardModule } from "@/components/qhse/hse/stop-card"
import PreziModule from "@/components/qhse/training/prezi"
import OnlineModule from "@/components/qhse/training/online"
import AuditModule from "@/components/qhse/audit/audit"
import ClaimsModule from "@/components/qhse/audit/claims"
import NonConformModule from "@/components/qhse/audit/non-conform"

export default function QHSEPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("quality")

  const handleModuleSelect = (moduleId: string, category: string) => {
    setActiveModule(moduleId)
    setActiveCategory(category)
  }

  const handleBackToNavigation = () => {
    setActiveModule(null)
  }

  const renderModule = () => {
    if (!activeModule) return null

    switch (activeModule) {
      case "inspection":
        return <QualityInspectionModule />
      case "lifting":
        return <QualityLiftingModule />
      case "iso":
        return <QualityISOModule />
      case "sqm":
        return <QualitySQMModule />
      case "permit-work":
        return <HSEPermitWorkModule />
      case "welding-work":
        return <HSEWeldingWorkModule />
      case "jsa":
        return <HSEJSAModule />
      case "stop-card":
        return <HSEStopCardModule />
      case "prezi":
        return <PreziModule />
      case "online":
        return <OnlineModule />
      case "audit":
        return <AuditModule />
      case "claims":
        return <ClaimsModule />
      case "non-conform":
        return <NonConformModule />
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Módulo em desenvolvimento</p>
          </div>
        )
    }
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {activeModule && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToNavigation}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {activeModule ? `QHSE - ${activeModule.toUpperCase()}` : "QHSE - Quality, Health, Safety & Environment"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {activeModule
                  ? "Gestão integrada de qualidade, saúde, segurança e meio ambiente"
                  : "Selecione um módulo para começar"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeModule ? (
          renderModule()
        ) : (
          <QHSENavigation onModuleSelect={handleModuleSelect} activeModule={activeModule || undefined} />
        )}
      </div>
    </main>
  )
}
