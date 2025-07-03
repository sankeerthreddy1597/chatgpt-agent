// app/home/layout.tsx
import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
    <div className="flex min-h-screen w-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
    </SidebarProvider>
  );
}
