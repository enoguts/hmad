import { BarChart3, FileText, Lightbulb, MessageSquare, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/lib/language-context";

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const items = [
    {
      title: t("dashboard"),
      url: "/",
      icon: BarChart3,
    },
    {
      title: t("comments"),
      url: "/comments",
      icon: MessageSquare,
    },
    {
      title: t("insights"),
      url: "/insights",
      icon: Lightbulb,
    },
    {
      title: t("executiveSummary"),
      url: "/summary",
      icon: FileText,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.url.slice(1) || 'dashboard'}`}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
