"use client";

import Navbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";
import { SidebarProvider } from "@/components/ui";
import { PropsWithChildren } from "react";
import { BookProvider } from "./e-book/context/bookContext";

const DashboardLayout: React.FC = (props: PropsWithChildren) => {
  return (
    <BookProvider>
      <SidebarProvider>
        <Sidebar />
        <main className="w-full">
          <Navbar />
          <div className="px-4 w-full md:max-w-[80%] mx-auto">
            {props.children}
          </div>
        </main>
      </SidebarProvider>
    </BookProvider>
  );
};

export default DashboardLayout;
