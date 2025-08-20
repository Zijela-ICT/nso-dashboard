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
import { usePermissions } from "@/hooks/custom/usePermissions";
import { SystemPermissions } from "@/utils/permission-enums";

interface RouteItem {
  id: number;
  icon: string;
  label: string;
  href: string;
  permission?: string | string[];
  subItems?: {
    label: string;
    href: string;
    permission?: string | string[];
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
    label: "Standing Order",
    href: "/e-book",
    permission: SystemPermissions.READ_ADMIN_EBOOKS,
    subItems: [
      {
        label: "JCHEW",
        href: "/e-book/jchew",
        permission: SystemPermissions.READ_ADMIN_EBOOKS,
      },
      {
        label: "CHEW",
        href: "/e-book/chew",
        permission: SystemPermissions.READ_ADMIN_EBOOKS,
      },
      {
        label: "CHO",
        href: "/e-book/cho",
        permission: SystemPermissions.READ_ADMIN_EBOOKS,
      },
      {
        label: "Standing Order Approval",
        href: "/e-book/approval",
        permission: SystemPermissions.UPDATE_ADMIN_EBOOKS_APPROVE,
      },
      {
        label: "Standing Order Admins",
        href: "/e-book/assign-editors-approvers",
        permission: SystemPermissions.UPDATE_ADMIN_EDITOR_APPROVE,
      },
    ],
  },
  // {
  //   id: 4,
  //   icon: "decisions",
  //   label: "Decisions",
  //   href: "/decisions",
  //   permission: SystemPermissions.READ_ADMIN_FACILITIES,
  // },
  {
    id: 5,
    icon: "hospital",
    label: "Nearby Facilities",
    href: "/nearby-facilities",
    permission: SystemPermissions.READ_ADMIN_FACILITIES,
  },
  {
    id: 6,
    icon: "message-question",
    label: "Quiz",
    href: "/quiz",
    permission: [
      "read_quizzes:questions",
      "read_quizzes",
      "read_quizzes:assessments",
      "read_quizzes:my_assessments/completed",
    ],
    subItems: [
      {
        label: "Quiz",
        href: "/quiz/quiz",
        permission: ["read_quizzes"],
      },
      {
        label: "Assessments",
        href: "/quiz/assessments",
        permission: ["read_quizzes:assessments"],
      },
      {
        label: "Results",
        href: "/quiz/results",
        permission: ["read_quizzes:my_assessments/completed"],
      },
      // {
      //   label: "Submissions",
      //   href: "/quiz/submissions",
      //   permission: [SystemPermissions.READ_ADMIN_USERS_APP],
      // },
    ],
  },
  {
    id: 7,
    icon: "users",
    label: "Users",
    href: "/users",
    permission: [
      SystemPermissions.READ_ADMIN_USERS_APP,
      SystemPermissions.READ_ADMIN_USERS_SYSTEM,
    ],
    subItems: [
      {
        label: "System Users",
        href: "/users/system-users",
        permission: SystemPermissions.READ_ADMIN_USERS_SYSTEM,
      },
      {
        label: "App Users",
        href: "/users/app-users",
        permission: SystemPermissions.READ_ADMIN_USERS_APP,
      },
    ],
  },
  // {
  //   id: 8,
  //   icon: "setting",
  //   label: "Settings",
  //   href: "/settings",
  //   permission: SystemPermissions.READ_APP_SETTINGS,
  // },
  {
    id: 9,
    icon: "audit",
    label: "Audit logs",
    href: "/audit-logs",
    permission: SystemPermissions.READ_APP_SETTINGS,
  },
  {
    id: 10,
    icon: "add-square",
    label: "Help",
    href: "/help",
    permission: SystemPermissions.READ_APP_SETTINGS,
  },
];

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

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
    router.push(`/dashboard${href}`);
  };

  // Check if user has permission to view a route
  const canViewRoute = (permission?: string | string[]) => {
    if (!permission) return true; // If no permission required, show the route
    return hasPermission(permission);
  };

  // Check if user has permission to view any subitems
  const canViewAnySubItems = (route: RouteItem) => {
    if (!route.subItems) return false;
    return route.subItems.some((subItem) => canViewRoute(subItem.permission));
  };

  // Filter visible routes
  const visibleRoutes = routes.filter((route) => {
    // If route has subitems, show if user can view any of them
    if (route.subItems) {
      return canViewAnySubItems(route);
    }
    // Otherwise check route's own permission
    return canViewRoute(route.permission);
  });

  const handleLogout = () => {
    localStorage.removeItem("chprbn");
    window.location.href = "/login";
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
              onClick={() => router.push("/dashboard/home")}
            />
          </SidebarGroupLabel>

          <SidebarGroupContent className="flex-1 overflow-y-auto mt-9 ">
            <SidebarMenu className="gap-2">
              {visibleRoutes.map((route) =>
                route.subItems ? (
                  <Collapsible
                    key={route.id}
                    defaultOpen={isParentActive(route)}
                    className="group/collapsible w-full"
                  >
                    <SidebarMenuItem
                      className={cn(
                        "py-3 pl-5 cursor-pointer rounded-[4px] gap-3 items-center w-[240px] hover:bg-[#F6FEF9] hover:rounded-[4px]",
                        isParentActive(route) && "bg-[#F6FEF9] rounded-[4px]"
                      )}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="hover:!bg-transparent hover:text-title data:[active]:bg-transparent"
                          isActive={isParentActive(route)}
                        >
                          <div className="flex items-center gap-3 w-full">
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
                              {route.label}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180 mr-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1">
                        <div className="pl-4 flex flex-col gap-2">
                          {route.subItems
                            .filter((subItem) =>
                              canViewRoute(subItem.permission)
                            )
                            .map((subItem) => (
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
                                <span className="text-[#101828] text-[14px]">
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

        <SidebarMenu className="mt-10 border-t">
          <SidebarMenuItem
            onClick={handleLogout}
            className="py-3 pl-11 cursor-pointer flex flex-row gap-3 items-center "
          >
            <div className="w-6 h-6">
              <Icon
                name="sign-out"
                className="w-6 h-6 hover:text-red-700"
                stroke="none"
              />
            </div>
            <span>Sign out</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
