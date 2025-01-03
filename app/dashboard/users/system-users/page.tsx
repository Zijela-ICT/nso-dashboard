"use client";
import AllUsers from "@/components/modules/users/all-users";
import Permissions from "@/components/modules/users/permissions";
import Roles from "@/components/modules/users/roles";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

type TabTypes = "All Users" | "Roles" | "Permissions";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") as TabTypes;
  const tabs: TabTypes[] = ["All Users", "Roles", "Permissions"];

  const [selectedTab, setSelectedTab] = useState<TabTypes>(tab || "All Users");

  useEffect(() => {
    const tab = searchParams.get("tab") as TabTypes;
    if (tab && tabs.includes(tab)) {
      setSelectedTab(tab);
    }
  }, [searchParams]);

  const handleTabClick = (tab: TabTypes) => {
    setSelectedTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "All Users":
        return <AllUsers />;
      case "Roles":
        return <Roles />;
      case "Permissions":
        return <Permissions />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <Suspense>
      <div className="flex flex-col items-start w-full">
        <div className="w-full mt-8">
          <div className="w-full flex flex-row items-center gap-10 overflow-x-scroll bg-white p-4 rounded-2xl">
            {tabs.map((tab) => {
              const activeTab = tab === selectedTab;
              return (
                <div
                  key={tab}
                  className={cn(
                    "py-3 font-semibold text-[#637381] cursor-pointer",
                    activeTab && "border-b-2 border-[#0CA554] text-[#212B36]"
                  )}
                  onClick={() => handleTabClick(tab)}>
                  {tab}
                </div>
              );
            })}
          </div>
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>
    </Suspense>
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
