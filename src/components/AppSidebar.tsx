import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Award, 
  Settings,
  LogOut,
  ShieldCheck,
  BookOpen
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
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import udcLogo from "@/assets/udc-logo.png";

const navItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "New Order", url: "/dashboard/new-order", icon: PlusCircle },
  { title: "My Orders", url: "/dashboard/history", icon: History },
  { title: "Rewards", url: "/dashboard/rewards", icon: Award },
  { title: "User Guide", url: "/dashboard/guide", icon: BookOpen },
];

export function AppSidebar() {
  const { signOut } = useAuth();
  const { isAdmin, isLoading: isAdminLoading } = useAdminCheck();
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

        {/* Admin Section */}
        {(isAdmin || isAdminLoading) && (
          <SidebarGroup>
            <SidebarGroupLabel
              className={
                isAdmin
                  ? "text-amber-600 dark:text-amber-400 font-bold uppercase text-xs tracking-wider"
                  : undefined
              }
            >
              Admin Access
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isAdmin ? (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to="/admin"
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
                              isActive
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                : "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30"
                            }`
                          }
                        >
                          <ShieldCheck className="h-5 w-5 shrink-0" />
                          <span>Admin Panel</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to="/admin/guide"
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-primary font-medium"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                            }`
                          }
                        >
                          <BookOpen className="h-5 w-5 shrink-0" />
                          <span>Admin Guide</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                ) : (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    Checking admin access…
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings & Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
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