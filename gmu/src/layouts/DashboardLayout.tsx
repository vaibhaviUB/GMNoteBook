import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Outlet } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DashboardLayout = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`avatar_url`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) throw error;
        if (data) setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      console.error('Error loading avatar!', error.message);
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <header className="h-16 flex items-center gap-3 border-b border-border px-6 bg-card sticky top-0 z-50 w-full shrink-0">
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <Link to="/dashboard" className="flex items-center gap-2 mr-8 shrink-0">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0">
                <img src={logo} alt="GMNoteBook" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-foreground text-lg whitespace-nowrap hidden sm:inline-block">GMNoteBook</span>
            </Link>

            {/* Topbar Navigation */}
            <nav className="hidden lg:flex items-center gap-8 overflow-x-auto no-scrollbar">
              {[
                { title: "Dashboard", url: "/dashboard" },
                { title: "Notes", url: "/dashboard/notes" },
                { title: "Test", url: "/dashboard/test" },
                { title: "AI Assistant", url: "/dashboard/assistant" },
                { title: "Resources", url: "/dashboard/Resources" },
                { title: "Career Buddy", url: "/dashboard/career" },
                { title: "Planner", url: "/dashboard/planner" },
              ].map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className="text-sm font-semibold text-[#0f172a]/60 hover:text-[#c08d4c] transition-all duration-200 whitespace-nowrap border-b-2 border-transparent hover:border-[#c08d4c] py-5"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Avatar */}
          <Link to="/dashboard/profile" className="flex items-center gap-2 pl-4 border-l border-border/50 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#c08d4c]/30 bg-muted flex items-center justify-center hover:border-[#c08d4c] transition-colors duration-300 shadow-sm">
                <img 
                  src={avatarUrl || "/vector_avatar.png"} 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
            </div>
          </Link>
        </header>

        <div className="flex-1 flex w-full overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 p-6 bg-muted/30 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
