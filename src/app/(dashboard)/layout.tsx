"use client";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Filter, UserCircle2 } from "lucide-react";


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Dashboard</span>
                <Select defaultValue="last-30">
                  <SelectTrigger className="h-8 w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last-7">Last 7 days</SelectItem>
                    <SelectItem value="last-30">Last 30 days</SelectItem>
                    <SelectItem value="quarter">Last quarter</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="size-4" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Open only</DropdownMenuItem>
                    <DropdownMenuItem>Completed only</DropdownMenuItem>
                    <DropdownMenuItem>With priority</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-4" />
                  Export
                </Button>
                <Button size="sm" className="gap-2 bg-transparent text-black" asChild>
                  <a href="/account">
                    <UserCircle2 />
                    <span>My Account</span>
                  </a>
                </Button>
              </div>
            </div>

          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>

    </main>
  );
}
