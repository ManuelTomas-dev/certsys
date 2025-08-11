"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  Building2,
  ClipboardCheck,
  ShieldCheck,
  Briefcase,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react"

type KPICardProps = {
  title: string
  value: string | number
  delta?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

function KPICard({ title, value, delta, trend = "neutral", icon: Icon = Activity, className }: KPICardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-600 dark:text-emerald-500"
      : trend === "down"
        ? "text-rose-600 dark:text-rose-500"
        : "text-muted-foreground"

  const dotBg =
    trend === "up"
      ? "bg-emerald-600 dark:bg-emerald-500"
      : trend === "down"
        ? "bg-rose-600 dark:bg-rose-500"
        : "bg-muted-foreground/60"

  return (
    <Card className={cn("overflow-hidden border-muted/40 shadow-none hover:bg-muted/30 transition-colors", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
        {delta && (
          <div className={cn("mt-1.5 flex items-center gap-2 text-xs", trendColor)}>
            <span className={cn("inline-block size-1.5 rounded-full", dotBg)} aria-hidden />
            <span className="leading-none">{delta}</span>
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
    <Card className="border-muted/40 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {total}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="divide-y divide-muted/40 rounded-md bg-muted/20">
          {items.map((it) => (
            <li key={it.label} className="flex items-center justify-between px-3 py-2">
              <span className="truncate text-sm">{it.label}</span>
              <span className="tabular-nums text-sm text-muted-foreground">{it.count}</span>
            </li>
          ))}
        </ul>

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
    { id: "INS-1042", customer: "Acme Inc", date: "2025-08-12", type: "Lifting", status: "Scheduled" },
    { id: "INS-1043", customer: "Globex", date: "2025-08-13", type: "ISO", status: "Pending" },
    { id: "INS-1044", customer: "Initech", date: "2025-08-16", type: "Quality", status: "Confirmed" },
    { id: "INS-1045", customer: "Umbrella", date: "2025-08-18", type: "HSE", status: "Pending" },
  ]

  const statusClass = (s: string) =>
    s === "Pending"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
      : s === "Confirmed"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        : "bg-muted text-muted-foreground"

  return (
    <Card className="border-muted/40 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Inspections</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[110px]">Ref</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell>{r.customer}</TableCell>
                <TableCell className="tabular-nums">{r.date}</TableCell>
                <TableCell className="text-muted-foreground">{r.type}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs",
                      statusClass(r.status),
                    )}
                    role="status"
                    aria-label={`Status: ${r.status}`}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        r.status === "Pending"
                          ? "bg-rose-600"
                          : r.status === "Confirmed"
                            ? "bg-emerald-600"
                            : "bg-muted-foreground",
                      )}
                    />
                    {r.status}
                  </span>
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
    {
      type: "inspection",
      title: "Inspection INS-1042 created",
      by: "RM",
      time: "2h",
      icon: ClipboardCheck,
      tone: "info" as const,
    },
    { type: "crm", title: "Quote Q-328 sent", by: "AL", time: "4h", icon: Briefcase, tone: "positive" as const },
    {
      type: "qshe",
      title: "Stop Card registered",
      by: "JS",
      time: "6h",
      icon: AlertTriangle,
      tone: "warning" as const,
    },
    {
      type: "personnel",
      title: "Training completed",
      by: "MB",
      time: "1d",
      icon: CheckCircle2,
      tone: "positive" as const,
    },
  ]

  const toneStyles = (tone: "warning" | "positive" | "info") =>
    cn(
      "size-5 rounded-full ring-2 ring-background",
      tone === "warning" && "bg-amber-500",
      tone === "positive" && "bg-emerald-500",
      tone === "info" && "bg-muted-foreground",
    )

  return (
    <Card className="h-full border-muted/40 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[360px]">
          <ul className="relative px-4 pb-4">
            <div className="absolute left-6 top-0 h-full w-px bg-muted/50" aria-hidden />
            {items.map((it, idx) => (
              <li key={idx} className="relative ml-8 flex items-start gap-3 py-3">
                <div className="absolute -left-[22px] mt-1">
                  <span className={toneStyles(it.tone)} aria-hidden />
                </div>
                <div className="rounded-md bg-muted/30 p-2 text-muted-foreground">
                  <it.icon className="size-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">{it.title}</div>
                  <div className="text-xs text-muted-foreground">
                    by {it.by} • {it.time} ago
                  </div>
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
    <main className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
      <header className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Simple and objective overview of the main modules and metrics.
        </p>
      </header>

      {/* KPIs */}
      <section aria-label="Main indicators" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Active Customers" value={128} delta="+8% vs. previous month" trend="up" icon={Building2} />
        <KPICard title="Open Inspections" value={37} delta="+3 pending" trend="down" icon={ClipboardCheck} />
        <KPICard title="Opportunities (CRM)" value={64} delta="12 new" trend="up" icon={Briefcase} />
        <KPICard title="Completed Trainings" value={"82%"} delta="Goal 90%" trend="neutral" icon={Users} />
      </section>

      {/* Content */}
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <UpcomingInspections />

          <Tabs defaultValue="qshe" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
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
                    { label: "In-person", count: 2 },
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
                  title="Customers"
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
                  title="People"
                  icon={Users}
                  items={[
                    { label: "Records", count: 54 },
                    { label: "Roles", count: 9 },
                  ]}
                  progress={{ label: "Annual training", value: 76 }}
                />
                <ModuleSummaryCard
                  title="Workplace"
                  icon={Home}
                  items={[
                    { label: "Locations", count: 14 },
                    { label: "My Locations", count: 4 },
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

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card className="border-muted/40 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Jobs in queue</span>
                <Badge variant="secondary" className="rounded-full">
                  3
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Notifications</span>
                <Badge className="rounded-full">
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
    </main>
  )
}