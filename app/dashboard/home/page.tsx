"use client";
import { useFetchProfile } from "@/hooks/api/queries/settings";
import React from "react";
import BarChartComponent from "./components/Bar";
import { PieChartComponent } from "./components/Pie";
import { Card } from "@/components/ui/card";
import { useDashboardMetrics } from "@/hooks/api/queries/users/useDashboardMetrics";
import { useFetchAppUsers } from "@/hooks/api/queries/users";

const Page = () => {
  const data = useFetchProfile();
  const { data: metrics } = useDashboardMetrics();
  const { data: users } = useFetchAppUsers(1, 10000000);

  const headings = [
    {
      title: "App Users",
      count: users?.data?.totalCount,
    },
    {
      title: "Total Facilities",
      count: metrics?.facilities?.totalFacilities,
    },
    {
      title: "Total Decisions",
      count: metrics?.decisions?.totalDecisions,
    },
    {
      title: "E-book Versions",
      count: metrics?.ebooks?.totalVersions,
    },
  ];

  return (
    <div className="px-6 py-20">
      <div className="grid grid-cols-4 gap-4">
        {headings.map((heading, i) => (
          <Card key={i} className="p-4">
            <p className="text-muted-foreground">{heading.title}</p>
            <h2 className="font-bold text-[30px] mt-1">{heading.count}</h2>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <BarChartComponent
          graphData={
            metrics?.assessment?.assessmentsByCadre
              ? metrics?.assessment?.assessmentsByCadre
              : {
                  JCHEW: 0,
                  CHEW: 0,
                  CHO: 0,
                }
          }
        />
        <PieChartComponent
          pieData={{
            private: metrics?.facilities.facilitiesByType.private,
            public: metrics?.facilities.facilitiesByType.public,
            total: metrics?.facilities.totalFacilities,
          }}
        />
      </div>
    </div>
  );
};

export default Page;
