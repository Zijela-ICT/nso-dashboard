/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Icon,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface RouteItem {
  id: number;
  icon: string;
  label: string;
  href: string;
  subItems?: {
    label: string;
    href: string;
  }[];
}

const routes: RouteItem[] = [
  {
    id: 1,
    icon: "dashboard",
    label: "Dashboard",
    href: "/home",
  },
  {
    id: 3,
    icon: "book",
    label: "E-book",
    href: "/e-book/JCHEW",
    subItems: [
      {
        label: "JCEW",
        href: "/dashboard/e-book/JCHEW",
      },
      {
        label: "CHEW",
        href: "/dashboard/e-book/CHEW",
      },
      {
        label: "CHO",
        href: "/dashboard/e-book/CHO",
      },
      {
        label: "E-book Approval",
        href: "/dashboard/e-book/approval",
      },
    ],
  },
  {
    id: 4,
    icon: "hospital",
    label: "Nearby Facilities",
    href: "/nearby-facilities",
  },
  {
    id: 5,
    icon: "users",
    label: "Users",
    href: "/users",
  },
  {
    id: 6,
    icon: "setting",
    label: "Settings",
    href: "/settings",
  },
];

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  const isParentActive = (route: RouteItem) => {
    if (route.subItems) {
      return route.subItems.some((subItem) =>
        pathname.startsWith(`/dashboard${subItem.href}`)
      );
    }
    return pathname.startsWith(`/dashboard${route.href}`);
  };

  const isActive = (href: string) => {
    return pathname.startsWith(`/dashboard${href}`);
  };

  const handleNavigation = (href: string) => {
    router.push(`${href}`);
  };

  return (
    <Sidebar
      className="bg-white border-none"
      side={isMobile ? "right" : "left"}
    >
      <SidebarContent className="flex flex-col h-full bg-white max-w-[300px] border-r border-r-[#EAEDFF]">
        <SidebarGroup className="px-3">
          <SidebarGroupLabel className="mt-4 ml-7 pr-0">
            <Image
              src="/svgs/logo.svg"
              alt="logo"
              className="cursor-pointer"
              height={40}
              width={100}
              onClick={() => router.push("/dashboard/reports")}
            />
          </SidebarGroupLabel>

          <SidebarGroupContent className="flex-1 overflow-y-auto mt-9 ">
            <SidebarMenu className="gap-2">
              {routes.map((route) =>
                route.subItems ? (
                  <Collapsible
                    key={route.id}
                    defaultOpen={isParentActive(route)}
                    className="group/collapsible w-full"
                  >
                    <SidebarMenuItem
                      className={cn(
                        "py-3 pl-5 cursor-pointer flex flex-row gap-3 items-center w-[240px] hover:bg-[#F6FEF9] hover:rounded-[4px]",
                        isParentActive(route) && "bg-[#F6FEF9] rounded-[4px]"
                      )}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6">
                              <Icon
                                name={route.icon}
                                className="w-6 h-6"
                                stroke="none"
                              />
                            </div>
                            <span
                              className={cn(
                                "text-[#101828] text-base font-medium",
                                isParentActive(route) && "font-semibold"
                              )}
                            >
                              {" "}
                              {route.label}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180 mr-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1">
                        <div className="pl-14 flex flex-col gap-2">
                          {route.subItems.map((subItem) => (
                            <div
                              key={subItem.label}
                              className={cn(
                                "relative cursor-pointer py-2 px-4",
                                isActive(subItem.href) &&
                                  "bg-[#F6FEF9] rounded-[4px] font-semibold"
                              )}
                              onClick={() => {
                                handleNavigation(subItem.href);
                                isMobile && toggleSidebar();
                              }}
                            >
                              {isActive(subItem.href) && (
                                <div className="absolute bg-[#2C6000] w-[2px] h-2 rounded-full top-1/2 -translate-y-1/2 left-0" />
                              )}
                              <span className="text-[#101828] text-base">
                                {subItem.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem
                    key={route.id}
                    className={cn(
                      "py-3 pl-5 cursor-pointer flex flex-row gap-3 items-center w-[240px] hover:bg-[#F6FEF9] hover:rounded-[4px]",
                      isActive(route.href) && "bg-[#F6FEF9] rounded-[4px]"
                    )}
                  >
                    <SidebarMenuButton
                      asChild
                      className="hover:!bg-transparent hover:text-title"
                      onClick={() => {
                        isMobile && toggleSidebar();
                      }}
                    >
                      <Link href={`/dashboard${route.href}`}>
                        <div className="w-6 h-6">
                          <Icon
                            name={route.icon}
                            className="w-6 h-6"
                            stroke="none"
                          />
                        </div>
                        <span
                          className={cn(
                            "text-[#101828] text-base font-medium",
                            isActive(route.href) && "font-semibold"
                          )}
                        >
                          {route.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
