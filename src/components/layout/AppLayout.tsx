import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { PageTransition } from "./PageTransition";
import {
  LayoutDashboard,
  Package,
  FileImage,
  Image,
  Calendar,
  Zap,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard, permission: "view:dashboard" as const },
  { name: "Produtos", href: "/app/products", icon: Package, permission: "view:products" as const },
  { name: "Conteúdos", href: "/app/posts", icon: FileImage, permission: "view:posts" as const },
  { name: "Mídia", href: "/app/media", icon: Image, permission: "view:products" as const },
  { name: "Calendário", href: "/app/calendar", icon: Calendar, permission: "view:calendar" as const },
  { name: "Piloto Automático", href: "/app/autopilot", icon: Zap, permission: "view:autopilot" as const },
  { name: "Insights", href: "/app/insights", icon: BarChart3, permission: "view:insights" as const },
  { name: "Inbox", href: "/app/inbox", icon: MessageSquare, permission: "view:inbox" as const, badge: 3 },
];

const bottomNavigation = [
  { name: "Configurações", href: "/app/settings", icon: Settings, permission: "view:settings" as const },
  { name: "Ajuda", href: "/app/help", icon: HelpCircle },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, store, logout, hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const filteredNavigation = navigation.filter(
    item => !item.permission || hasPermission(item.permission)
  );

  const filteredBottomNav = bottomNavigation.filter(
    item => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300 lg:relative",
        collapsed ? "w-[68px]" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link to="/app" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">PostaJá</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/app" && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t p-3 space-y-1">
          {filteredBottomNav.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            {theme === 'light' ? (
              <Moon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
            ) : (
              <Sun className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
            )}
            {!collapsed && <span>{theme === 'light' ? 'Modo escuro' : 'Modo claro'}</span>}
          </button>
        </div>

        {/* User menu */}
        <div className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-200",
                "hover:bg-sidebar-accent",
                collapsed && "justify-center"
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sidebar-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{store?.name}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/app/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="gradient" asChild>
              <Link to="/app/posts/new">
                <FileImage className="h-4 w-4" />
                Criar post
              </Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
