import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Layout from "./Layout";

function DashboardLayout({ children }) {
  return (
    <Layout>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Layout>
  );
}

export default DashboardLayout;
