import { LayoutDashboard, MessageSquare, Lightbulb, FileText, Settings } from 'lucide-react';
import { useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t('dashboard'),
      url: '/',
      icon: LayoutDashboard,
      testId: 'nav-dashboard',
    },
    {
      title: t('comments'),
      url: '/comments',
      icon: MessageSquare,
      testId: 'nav-comments',
    },
    {
      title: t('insights'),
      url: '/insights',
      icon: Lightbulb,
      testId: 'nav-insights',
    },
    {
      title: t('summary'),
      url: '/summary',
      icon: FileText,
      testId: 'nav-summary',
    },
    {
      title: t('settings'),
      url: '/settings',
      icon: Settings,
      testId: 'nav-settings',
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={item.testId}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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
