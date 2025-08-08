"use client";
import DashboardOverview from "@/components/dashboard-widgets";
import { Button } from "@/components/ui/button";
import { CalendarPlus, FilePlus2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')

    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true')
      router.replace('/login')
    }
  }, [router])
  return (
    <main className="p-4">
      {/* Ações rápidas */}
      <section className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="secondary" className="justify-start gap-2">
          <UserPlus className="size-4" />
          New Client
        </Button>
        <Button variant="secondary" className="justify-start gap-2">
          <FilePlus2 className="size-4" />
          New Quote
        </Button>
        <Button variant="secondary" className="justify-start gap-2">
          <CalendarPlus className="size-4" />
          New Inspection
        </Button>
        <Button variant="secondary" className="justify-start gap-2">
          <FilePlus2 className="size-4" />
          New Enquiry
        </Button>
      </section>


      <DashboardOverview />
    </main>
  );
}
