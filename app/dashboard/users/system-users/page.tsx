"use client";
import AllUsers from "@/components/modules/users/all-users";
import Permissions from "@/components/modules/users/permissions";
import Roles from "@/components/modules/users/roles";
import { usePermissions } from "@/hooks/custom/usePermissions";
import { cn } from "@/lib/utils";
import { SystemPermissions } from "@/utils/permission-enums";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

type TabTypes = "All Users" | "Roles" | "Permissions";

interface TabConfig {
  name: TabTypes;
  permission: SystemPermissions;
  component: React.ReactNode;
}

const Page = () => {
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabConfigs: TabConfig[] = [
    {
      name: "All Users",
      permission: SystemPermissions.READ_ADMIN_USERS_SYSTEM,
      component: <AllUsers />,
    },
    {
      name: "Roles",
      permission: SystemPermissions.READ_ADMIN_ROLES,
      component: <Roles />,
    },
    {
      name: "Permissions",
      permission: SystemPermissions.READ_PERMISSIONS,
      component: <Permissions />,
    },
  ];

  // Filter tabs based on permissions
  const availableTabs = tabConfigs.filter((tab) =>
    hasPermission(tab.permission)
  );

  const tab = searchParams.get("tab") as TabTypes;
  const [selectedTab, setSelectedTab] = useState<TabTypes>(
    tab && availableTabs.some((t) => t.name === tab)
      ? tab
      : availableTabs[0]?.name || "All Users"
  );

  useEffect(() => {
    const tab = searchParams.get("tab") as TabTypes;
    if (tab && availableTabs.some((t) => t.name === tab)) {
      setSelectedTab(tab);
    } else if (availableTabs.length > 0 && !tab) {
      // Redirect to first available tab if no tab is selected
      handleTabClick(availableTabs[0].name);
    }
  }, [searchParams, availableTabs]);

  const handleTabClick = (tab: TabTypes) => {
    setSelectedTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const renderTabContent = () => {
    const currentTab = tabConfigs.find((t) => t.name === selectedTab);
    return currentTab?.component || <div>No content available</div>;
  };

  if (availableTabs.length === 0) {
    return (
      <div className="p-4">You don't have permission to view any tabs.</div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full mt-8">
        <div className="w-full flex flex-row items-center gap-10 overflow-x-scroll bg-white p-4 rounded-2xl">
          {availableTabs.map(({ name }) => {
            const activeTab = name === selectedTab;
            return (
              <div
                key={name}
                className={cn(
                  "py-3 font-semibold text-[#637381] cursor-pointer",
                  activeTab && "border-b-2 border-[#0CA554] text-[#212B36]"
                )}
                onClick={() => handleTabClick(name)}
              >
                {name}
              </div>
            );
          })}
        </div>
        <div className="mt-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

const SystemUsersPage = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
};

export default SystemUsersPage;
