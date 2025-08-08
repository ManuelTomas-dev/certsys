"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Home, Users, Building2, ClipboardCheck, ShieldCheck, Briefcase, Settings, TrendingUp, TrendingDown, Bell, CheckCircle2, AlertTriangle, Activity } from 'lucide-react'

type KPICardProps = {
  title: string
  value: string | number
  delta?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

function KPICard({ title, value, delta, trend = "neutral", icon: Icon = Activity, className }: KPICardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-md bg-muted p-2">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {delta && (
          <div className={cn("mt-1 flex items-center gap-1 text-xs", {
            "text-emerald-600 dark:text-emerald-500": trend === "up",
            "text-rose-600 dark:text-rose-500": trend === "down",
            "text-muted-foreground": trend === "neutral",
          })}>
            {trend === "up" && <TrendingUp className="size-3.5" />}
            {trend === "down" && <TrendingDown className="size-3.5" />}
            <span>{delta}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ModuleSummaryCard({
  title,
  items,
  icon: Icon,
  progress,
}: {
  title: string
  items: { label: string; count: number }[]
  icon: React.ComponentType<{ className?: string }>
  progress?: { label: string; value: number }
}) {
  const total = items.reduce((acc, i) => acc + i.count, 0)
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-muted p-2">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <Badge variant="secondary">{total}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.label} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span className="truncate">{it.label}</span>
              <Badge className="ml-2">{it.count}</Badge>
            </div>
          ))}
        </div>
        {progress && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress.label}</span>
              <span className="tabular-nums">{progress.value}%</span>
            </div>
            <Progress value={progress.value} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function UpcomingInspections() {
  const rows = [
    { id: "INS-1042", customer: "Acme Inc", date: "2025-08-12", type: "Lifting", status: "Agendada" },
    { id: "INS-1043", customer: "Globex", date: "2025-08-13", type: "ISO", status: "Pendente" },
    { id: "INS-1044", customer: "Initech", date: "2025-08-16", type: "Quality", status: "Confirmada" },
    { id: "INS-1045", customer: "Umbrella", date: "2025-08-18", type: "HSE", status: "Pendente" },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Próximas Inspeções</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ref</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell>{r.customer}</TableCell>
                <TableCell className="tabular-nums">{r.date}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={r.status === "Pendente" ? "destructive" : "default"}>
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  const items = [
    { type: "inspection", title: "Inspeção INS-1042 criada", by: "RM", time: "2h", icon: ClipboardCheck, tone: "info" as const },
    { type: "crm", title: "Quote Q-328 enviado", by: "AL", time: "4h", icon: Briefcase, tone: "positive" as const },
    { type: "qshe", title: "Stop Card registrado", by: "JS", time: "6h", icon: AlertTriangle, tone: "warning" as const },
    { type: "personnel", title: "Treinamento concluído", by: "MB", time: "1d", icon: CheckCircle2, tone: "positive" as const },
  ]
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[360px]">
          <ul className="space-y-2 px-4 pb-4">
            {items.map((it, idx) => (
              <li key={idx} className="flex items-center gap-3 rounded-md border p-3">
                <div
                  className={cn(
                    "rounded-md p-2",
                    it.tone === "warning" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                    it.tone === "positive" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
                    it.tone === "info" && "bg-muted text-muted-foreground"
                  )}
                >
                  <it.icon className="size-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">{it.title}</div>
                  <div className="text-xs text-muted-foreground">por {it.by} • {it.time} atrás</div>
                </div>
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px]">{it.by}</AvatarFallback>
                </Avatar>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default function DashboardOverview() {
  return (
    <div className="space-y-4">
      {/* Main KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Active Clients" value={128} delta="+8% vs. previous month" trend="up" icon={Building2} />
        <KPICard title="Open Inspections" value={37} delta="+3 pending" trend="down" icon={ClipboardCheck} />
        <KPICard title="Enquiries (CRM)" value={64} delta="12 new" trend="up" icon={Briefcase} />
        <KPICard title="Trainings Completed" value={"82%"} delta="Target 90%" trend="neutral" icon={Users} />
      </section>

      {/* Two-column content */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <UpcomingInspections />

          <Tabs defaultValue="qshe" className="w-full">
            <TabsList>
              <TabsTrigger value="qshe">QSHE</TabsTrigger>
              <TabsTrigger value="crm">CRM</TabsTrigger>
              <TabsTrigger value="personnel">Personnel</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="qshe" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ModuleSummaryCard
                  title="QSHE — Quality"
                  icon={ShieldCheck}
                  items={[
                    { label: "Inspection", count: 11 },
                    { label: "Lifting", count: 6 },
                    { label: "ISO", count: 4 },
                    { label: "SQM", count: 7 },
                  ]}
                  progress={{ label: "Compliance", value: 72 }}
                />
                <ModuleSummaryCard
                  title="QSHE — HSE"
                  icon={AlertTriangle}
                  items={[
                    { label: "Permit Work", count: 9 },
                    { label: "Welding Work", count: 3 },
                    { label: "JSA", count: 12 },
                    { label: "Stop Card", count: 5 },
                  ]}
                  progress={{ label: "Actions completed", value: 64 }}
                />
                <ModuleSummaryCard
                  title="QSHE — Training"
                  icon={Users}
                  items={[
                    { label: "Prezi", count: 2 },
                    { label: "Online", count: 18 },
                  ]}
                  progress={{ label: "Completion", value: 82 }}
                />
                <ModuleSummaryCard
                  title="QSHE — Audit"
                  icon={ClipboardCheck}
                  items={[
                    { label: "Audits", count: 4 },
                    { label: "Claims", count: 2 },
                    { label: "Non Conform", count: 6 },
                  ]}
                  progress={{ label: "Action plans", value: 58 }}
                />
              </div>
            </TabsContent>

            <TabsContent value="crm" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ModuleSummaryCard
                  title="CRM — Pipeline"
                  icon={Briefcase}
                  items={[
                    { label: "Enquiries", count: 28 },
                    { label: "Quotes", count: 16 },
                  ]}
                  progress={{ label: "Win rate", value: 34 }}
                />
                <ModuleSummaryCard
                  title="Clients"
                  icon={Building2}
                  items={[
                    { label: "Active", count: 128 },
                    { label: "New (30d)", count: 12 },
                  ]}
                  progress={{ label: "Retention", value: 89 }}
                />
              </div>
            </TabsContent>

            <TabsContent value="personnel" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ModuleSummaryCard
                  title="Personnel"
                  icon={Users}
                  items={[
                    { label: "Details", count: 54 },
                    { label: "Function", count: 9 },
                  ]}
                  progress={{ label: "Annual training", value: 76 }}
                />
                <ModuleSummaryCard
                  title="Work Location"
                  icon={Home}
                  items={[
                    { label: "Locations", count: 14 },
                    { label: "My Location", count: 4 },
                  ]}
                />
              </div>
            </TabsContent>

            <TabsContent value="system" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ModuleSummaryCard
                  title="System — Settings"
                  icon={Settings}
                  items={[
                    { label: "Account Type", count: 5 },
                    { label: "Currency", count: 7 },
                    { label: "Partner", count: 12 },
                    { label: "Status", count: 9 },
                  ]}
                />
                <ModuleSummaryCard
                  title="System — Location"
                  icon={Home}
                  items={[
                    { label: "Location", count: 14 },
                    { label: "My Location", count: 4 },
                    { label: "Title", count: 6 },
                  ]}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right side */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Queued Jobs</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Notifications</span>
                <Badge>
                  <Bell className="mr-1 size-3.5" />7
                </Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Uptime (30d)</span>
                  <span className="tabular-nums">99.95%</span>
                </div>
                <Progress value={99.95} />
              </div>
            </CardContent>
          </Card>

          <RecentActivity />
        </div>
      </section>
    </div>

  )
}
