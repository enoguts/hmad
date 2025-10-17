import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import Dashboard from "@/pages/dashboard";
import Comments from "@/pages/comments";
import Insights from "@/pages/insights";
import ExecutiveSummary from "@/pages/executive-summary";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/comments" component={Comments} />
      <Route path="/insights" component={Insights} />
      <Route path="/summary" component={ExecutiveSummary} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <header className="flex items-center justify-between h-16 px-6 border-b bg-card">
                    <div className="flex items-center gap-4">
                      <SidebarTrigger data-testid="button-sidebar-toggle" />
                      <h2 className="text-sm font-semibold">Film Sentiment Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <LanguageToggle />
                      <ThemeToggle />
                    </div>
                  </header>
                  <main className="flex-1 overflow-auto p-6 md:p-8">
                    <Router />
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
