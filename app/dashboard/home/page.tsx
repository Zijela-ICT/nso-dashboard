"use client";
import React from "react";
import BarChartComponent from "./components/Bar";
import { PieChartComponent } from "./components/Pie";
import { Card } from "@/components/ui/card";
import { useDashboardMetrics } from "@/hooks/api/queries/users/useDashboardMetrics";
import { useFetchAppUsers } from "@/hooks/api/queries/users";
import { Spinner } from "@/components/ui";

const Page = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const { data: users } = useFetchAppUsers(1, 10000000);

  const headings = [
    {
      title: "App Users",
      count: users?.data?.totalCount ?? 0,
    },
    {
      title: "Total Facilities",
      count: metrics?.facilities?.totalFacilities ?? 0,
    },
    {
      title: "Total Decisions",
      count: metrics?.decisions?.totalDecisions ?? 0,
    },
    {
      title: "E-Book Versions",
      count: metrics?.ebooks?.totalVersions ?? 0,
    },
  ];

  return isLoading ? (
    <div className="w-full py-[100px] flex items-center justify-center">
      <Spinner className="animate-spin" />
    </div>
  ) : (
    <div className="px-6 py-20">
      <div className="grid grid-cols-4 gap-4">
        {headings?.map((heading, i) => (
          <Card key={i} className="p-4">
            <p className="text-muted-foreground">{heading?.title}</p>
            <h2 className="font-bold text-[30px] mt-1">
              {heading?.count?.toLocaleString() ?? 0}
            </h2>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <BarChartComponent
          graphData={
            metrics?.assessment?.assessmentsByCadre ?? {
              JCHEW: 0,
              CHEW: 0,
              CHO: 0,
            }
          }
        />
        <PieChartComponent
          pieData={{
            private: metrics?.facilities?.facilitiesByType?.private ?? 0,
            public: metrics?.facilities?.facilitiesByType?.public ?? 0,
            total: metrics?.facilities?.totalFacilities ?? 0,
          }}
        />
      </div>
    </div>
  );
};

export default Page;
