import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Award, 
  Settings,
  LogOut
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import udcLogo from "@/assets/udc-logo.png";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "New Order", url: "/dashboard/new-order", icon: PlusCircle },
  { title: "My Orders", url: "/dashboard/history", icon: History },
  { title: "Rewards", url: "/dashboard/rewards", icon: Award },
];

export function AppSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar className="w-64">
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={udcLogo} alt="UDC Logo" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">UDC</span>
              <span className="text-xs text-sidebar-foreground/70">Laundry Service</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings & Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`
                    }
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-destructive hover:bg-destructive/10 w-full"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span>Sign Out</span>
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