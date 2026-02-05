import { useEffect } from "react";
import { Outlet, useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ShieldCheck, 
  Users, 
  Package, 
  Tag, 
  Settings, 
  LogOut, 
  BookOpen,
  LayoutDashboard,
  ArrowLeft
} from "lucide-react";
import udcLogo from "@/assets/udc-logo.png";

const adminNavItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Admin Guide", url: "/admin/guide", icon: BookOpen },
];

export function AdminLayout() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        navigate('/admin/login');
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="h-16 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 sticky top-0 z-40">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/admin" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">UDC Admin</span>
                <span className="text-xs text-muted-foreground">Management Portal</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end={item.url === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-500/10 text-amber-600"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Back to Customer Dashboard */}
            <Link 
              to="/dashboard" 
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Customer Dashboard
            </Link>

            {/* Admin Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span>{user?.email?.split('@')[0] || 'Admin'}</span>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-xs rounded-full font-semibold">
                        ADMIN
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-amber-500/30">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Package className="mr-2 h-4 w-4" />
                  Customer Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-border bg-card px-4 py-2 flex gap-2 overflow-x-auto">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-amber-500/10 text-amber-600"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Customer
        </Link>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
