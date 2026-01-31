import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground hidden sm:block">
              Nepal Election Data Analysis System
            </span>
          </header>
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
          <footer className="border-t border-border bg-muted/30 py-4 px-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>🗳️ Nepal Election Data Analysis & GIS Visualization System</p>
              <p className="mt-1 text-xs">Data source: Election Commission of Nepal | Last updated: 2079 BS</p>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
