import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Tag, 
  BookOpen,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  ArrowLeft
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import udcLogo from "@/assets/udc-logo.png";

const adminNavItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, description: "Overview & Analytics" },
  { title: "Admin Guide", url: "/admin/guide", icon: BookOpen, description: "Help & Documentation" },
];

const quickLinks = [
  { title: "Customer Dashboard", url: "/dashboard", icon: ArrowLeft },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar className="w-64 border-r border-amber-500/20">
      <SidebarContent className="bg-gradient-to-b from-sidebar via-sidebar to-amber-500/5">
        {/* Admin Logo Header */}
        <div className="p-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={udcLogo} alt="UDC Logo" className="h-12 w-12" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
                <ShieldCheck className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">UDC Admin</span>
              <span className="text-xs text-sidebar-foreground/70">Management Portal</span>
            </div>
          </div>
          <Badge className="mt-3 w-full justify-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30 hover:bg-amber-500/30">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Administrator Access
          </Badge>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="pt-4">
          <SidebarGroupLabel className="text-amber-600 font-semibold uppercase text-xs tracking-wider px-4">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                            : "text-sidebar-foreground hover:bg-amber-500/10"
                        }`
                      }
                    >
                      <div className="p-1.5 rounded-lg bg-white/10">
                        <item.icon className="h-5 w-5 shrink-0" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs opacity-70">{item.description}</span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Stats Summary */}
        <SidebarGroup className="px-4 py-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-foreground">Quick Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Users className="h-4 w-4 mx-auto mb-1 text-amber-600" />
                <div className="text-xs text-muted-foreground">Users</div>
              </div>
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Package className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                <div className="text-xs text-muted-foreground">Orders</div>
              </div>
            </div>
          </div>
        </SidebarGroup>

        {/* Quick Links */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-muted-foreground font-medium uppercase text-xs tracking-wider px-4">
            Quick Links
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {quickLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sidebar-foreground hover:bg-muted"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out */}
        <SidebarGroup className="pb-4">
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-destructive hover:bg-destructive/10 w-full"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
