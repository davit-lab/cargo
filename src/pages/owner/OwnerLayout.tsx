import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Package, 
  CalendarCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OwnerLayout = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "დაშბორდი", href: "/owner", icon: LayoutDashboard },
    { name: "ჩემი სერვისები", href: "/owner/services", icon: Package },
    { name: "ჩემი ჯავშნები", href: "/owner/bookings", icon: CalendarCheck },
    { name: "პარამეტრები", href: "/owner/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-background border-b flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">RentHub</Link>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="mb-10 hidden md:block">
            <Link to="/" className="text-2xl font-bold text-primary">RentHub</Link>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">მფლობელი</p>
              </div>
            </div>
            
            <Link to="/owner/services/new">
              <Button className="w-full rounded-xl gap-2 mb-6">
                <Plus className="h-4 w-4" />
                ახალი სერვისი
              </Button>
            </Link>
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              გასვლა
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
