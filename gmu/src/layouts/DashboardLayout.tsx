import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Outlet } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-card">
            <SidebarTrigger className="text-muted-foreground" />
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="GMNoteBook" className="w-7 h-7 object-contain" />
              <span className="font-display font-bold text-foreground text-lg">GMNoteBook</span>
            </Link>
          </header>
          <main className="flex-1 p-6 bg-muted/30 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
