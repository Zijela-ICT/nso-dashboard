"use client";

import Navbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";
import {SidebarProvider} from "@/components/ui";
import {PropsWithChildren} from "react";

const DashboardLayout: React.FC = (props: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="w-full">
        <Navbar />
        <div className="px-10 py-7 w-full mx-auto">
        {props.children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
