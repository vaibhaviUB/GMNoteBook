import { BookOpen, Brain, Mic, BarChart3, Settings, Home, LogOut, User, ChevronRight, ChevronLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Notes", url: "/dashboard/notes", icon: BookOpen },
  { title: "Assessments", url: "/dashboard/assessments", icon: Brain },
  { title: "Progress", url: "/dashboard/progress", icon: BarChart3 },
];

const bottomItems = [
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 hover:bg-[#c08d4c]/10 text-[#0f172a]/70 hover:text-[#0f172a]"
                      activeClassName="bg-gradient-to-r from-[#c08d4c]/20 to-transparent text-[#0f172a] font-bold border-l-4 border-[#c08d4c] shadow-sm"
                    >
                      <item.icon className="h-5 w-5 shrink-0 text-[#c08d4c]" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 hover:bg-[#c08d4c]/10 text-[#0f172a] font-semibold"
                  activeClassName="bg-gradient-to-r from-[#c08d4c]/20 to-transparent text-[#0f172a] font-bold border-l-4 border-[#c08d4c]"
                >
                  <item.icon className="h-5 w-5 shrink-0 text-[#4a2e19]" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#0f172a] font-semibold transition-all duration-300 hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5 shrink-0 text-[#4a2e19]" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => toggleSidebar()}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 hover:bg-[#c08d4c]/10 text-[#0f172a] font-semibold"
            >
              {collapsed ? <ChevronRight className="h-5 w-5 text-[#4a2e19]" /> : <ChevronLeft className="h-5 w-5 text-[#4a2e19]" />}
              {!collapsed && <span className="italic">Collapse Bar</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
