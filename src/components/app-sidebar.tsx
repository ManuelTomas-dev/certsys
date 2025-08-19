"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { BadgeCheck, Briefcase, Building2, ChevronDown, ClipboardCheck, ClipboardList, GraduationCap, Home, LogOut, LucideIcon, MapPin, Settings, ShieldCheck, Users } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

type NavItem = {
    title: string
    href?: string
    icon?: LucideIcon
    items?: NavItem[]
}

const modules: NavItem[] = [
    { title: "Dashboard", icon: Home, href: "/" },

    {
        title: "Personnel",
        icon: Users,
        items: [
            { title: "Details", href: "/personnel/details" },
            { title: "Function", href: "/personnel/functions" },
        ],
    },

    {
        title: "Customers",
        icon: Building2,
        items: [{ title: "Clients", href: "/customers/clients" }, { title: "Work locations", href: "/customers/work-locations" }],
    },

    // Opcional: ajuste/complete conforme seu domínio
    // {
    //     title: "Work Location",
    //     icon: MapPin,
    //     items: [
    //         { title: "Locations", href: "/work-location/locations" },
    //     ],
    // },

    {
        title: "Inspection",
        icon: ClipboardCheck,
        href: "/inspections",
    },

    {
        title: "CRM",
        icon: Briefcase,
        items: [
            { title: "Enquiries", href: "/crm/enquiries" },
            { title: "Quotes", href: "/crm/quotes" },
        ],
    },

    {
        title: "QSHE",
        icon: ShieldCheck,
        href: "/qshe",

        items: [
            {
                title: "Quality",
                icon: BadgeCheck,
                items: [
                    { title: "Inspection", href: "/qshe/quality/inspection" },
                    { title: "Lifting", href: "/qshe/quality/lifting" },
                    { title: "ISO", href: "/qshe/quality/iso" },
                    { title: "SQM", href: "/qshe/quality/sqm" },
                ],
            },
            {
                title: "HSE",
                icon: ShieldCheck,
                items: [
                    { title: "Permit Work", href: "/qshe/hse/permit-work" },
                    { title: "Welding Work", href: "/qshe/hse/welding-work" },
                    { title: "JSA", href: "/qshe/hse/jsa" },
                    { title: "Stop Card", href: "/qshe/hse/stop-card" },
                ],
            },
            {
                title: "Training",
                icon: GraduationCap,
                items: [
                    { title: "Prezi", href: "/qshe/training/prezi" },
                    { title: "Online", href: "/qshe/training/online" },
                ],
            },
            {
                title: "Audit",
                icon: ClipboardList,
                items: [
                    { title: "Audit", href: "/qshe/audit/audit" },
                    { title: "Claims", href: "/qshe/audit/claims" },
                    { title: "Non Conform", href: "/qshe/audit/non-conform" },
                ],
            },
        ],
    },

    {
        title: "System",
        icon: Settings,
        items: [
            { title: "Account Type", href: "/system/account-type" },
            { title: "Currency", href: "/system/currency" },
            { title: "Location", href: "/system/location" },
            { title: "My Location", href: "/system/my-location" },
            { title: "Partner", href: "/system/partner" },
            { title: "Status", href: "/system/status" },
            { title: "Title", href: "/system/title" },
        ],
    },
]


// Render recursivo de nav com Collapsible
function MenuTree({ items, level = 0 }: { items: NavItem[]; level?: number }) {
    return (
        <>
            {items.map((item) => {
                const hasChildren = !!item.items?.length
                if (level === 0) {
                    // nível raiz
                    if (hasChildren) {
                        return (
                            <Collapsible key={item.title} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon ? <item.icon /> : null}
                                            <span>{item.title}</span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <MenuTree items={item.items!} level={level + 1} />
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                    }
                    // folha no raiz
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <a href={item.href || "#"}>
                                    {item.icon ? <item.icon /> : null}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                } else {
                    // níveis abaixo do raiz
                    if (hasChildren) {
                        return (
                            <SidebarMenuSubItem key={item.title}>
                                <Collapsible className="group/collapsible w-full">
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuSubButton>
                                            {/* Ícones opcionais em subníveis */}
                                            {item.icon ? <item.icon /> : null}
                                            <span>{item.title}</span>
                                            <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuSubButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <MenuTree items={item.items!} level={level + 1} />
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuSubItem>
                        )
                    }
                    return (
                        <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                                <a href={item.href || "#"}>
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    )
                }
            })}
        </>
    )
}

export function AppSidebar() {
    return (
        <Sidebar
            side="left"            // try "right"
            variant="sidebar"      // try "inset" or "floating"
            collapsible="icon"     // try "offcanvas" or "none"
            className=" [--sidebar-background:194_70%_27%] [--sidebar-foreground:0_0%_98%] [--sidebar-accent:194_65%_22%] [--sidebar-accent-foreground:0_0%_98%] [--sidebar-border:194_35%_22%]"
        >
            <SidebarHeader>
                <SidebarMenu className="text-white">
                    <SidebarMenuItem className="">
                        <SidebarMenuButton className="bg-cyan-800" variant="outline" size="lg" asChild>
                            <a href="/">
                                <Home />
                                <span>CERTSYS</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="text-white">
                            <MenuTree items={modules} />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="text-gray-50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <Settings />
                                <span>Account</span>
                            </a>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <LogOut />
                                <span>Logout</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
