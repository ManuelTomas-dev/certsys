"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { type LucideIcon, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  icon?: LucideIcon
  title?: string
  subtitle?: string
  ctaLabel?: string
  onCtaClick?: () => void
}
export function ModuleHeader({
  icon: Icon = Briefcase,
  title = "Módulo",
  subtitle = "Gestão de registos com segurança e conformidade.",
  ctaLabel = "Novo",
  onCtaClick = () => {},
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between transition-all",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
    >
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-cyan-800/10 ring-1 ring-cyan-800/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-cyan-800" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-cyan-800">{title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onCtaClick} className="bg-cyan-800 hover:bg-cyan-700 text-white shadow-sm">
          {ctaLabel}
        </Button>
      </div>
    </header>
  )
}
