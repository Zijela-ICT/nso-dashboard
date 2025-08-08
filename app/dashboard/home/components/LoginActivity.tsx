"use client";
import React, { useState } from "react";
import { format, subDays } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui";

import { useLoginActivity } from "@/hooks/api/queries/users/useLoginActivity";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function LoginActivity() {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: loginData, isLoading } = useLoginActivity(
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd")
  );

  const cadreChartConfig = {
    logins: {
      label: "Cadre Logins",
      color: "hsl(var(--primary))",
    },
    totalLogins: {
      label: "Total Logins",
      color: "hsl(var(--chart-4))",
    },
    uniqueUsers: {
      label: "Unique Users",
      color: "hsl(var(--chart-5))",
    },
    CHEW: {
      label: "CHEW",
      color: "hsl(var(--chart-1))",
    },
    JCHEW: {
      label: "JCHEW",
      color: "hsl(var(--chart-2))",
    },
    CHO: {
      label: "CHO",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  // Process cadre data for the bar chart with additional tooltip info
  const cadreData = React.useMemo(() => {
    if (!loginData) return [];

    // Aggregate cadre logins from all sources
    const cadreAggregation: Record<string, number> = {};

    // First try to get data from dailyStats
    if (loginData.dailyStats && Array.isArray(loginData.dailyStats)) {
      loginData.dailyStats.forEach((dailyStat) => {
        if (
          dailyStat.loginsByCadre &&
          typeof dailyStat.loginsByCadre === "object"
        ) {
          Object.entries(dailyStat.loginsByCadre).forEach(([cadre, logins]) => {
            if (typeof logins === "number" && logins > 0) {
              cadreAggregation[cadre] = (cadreAggregation[cadre] || 0) + logins;
            }
          });
        }
      });
    }

    // Always also check top-level loginsByCadre (it might have different/additional data)
    if (
      loginData.loginsByCadre &&
      typeof loginData.loginsByCadre === "object"
    ) {
      Object.entries(loginData.loginsByCadre).forEach(([cadre, logins]) => {
        if (typeof logins === "number" && logins > 0) {
          // If we already have data from dailyStats, we might want to use the top-level as authoritative
          // or we can skip if we already have data. For now, let's use top-level as authoritative
          cadreAggregation[cadre] = logins;
        }
      });
    }

    // Convert to array format for the chart
    const result = Object.entries(cadreAggregation)
      .filter(([, logins]) => logins > 0)
      .map(([cadre, logins]) => ({
        cadre,
        logins,
        totalLogins: loginData.totalLogins || 0,
        uniqueUsers: loginData.uniqueUsers || 0,
      }));

    console.log("Processed cadre data:", result); // Debug log
    return result;
  }, [loginData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
          <CardTitle>Login Activity by Cadre</CardTitle>
          <div className="flex items-center gap-2 flex-col lg:flex-row">
            <DatePicker
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
              placeholder="Start date"
              allowHistoricalDates={true}
              toDate={endDate || new Date()}
            />
            <DatePicker
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
              placeholder="End date"
              fromDate={startDate}
              toDate={new Date()}
            />
          </div>
        </div>
        {loginData && (
          <div className="flex items-center gap-6 mt-2 flex-wrap">
            <div className="text-sm text-muted-foreground">
              Total Logins:{" "}
              <span className="font-semibold text-foreground">
                {loginData.totalLogins?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Unique Users:{" "}
              <span className="font-semibold text-foreground">
                {loginData.uniqueUsers?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Successful:{" "}
              <span className="font-semibold text-green-600">
                {loginData.successfulLogins?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Failed:{" "}
              <span className="font-semibold text-red-600">
                {loginData.failedLogins?.toLocaleString() || "N/A"}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <Spinner className="animate-spin" />
          </div>
        ) : !loginData || !cadreData || cadreData.length === 0 ? (
          <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-2xl font-semibold mb-2">N/A</p>
              <p>No cadre data available</p>
              <p className="text-sm mt-1">
                {!loginData
                  ? "No data found for the selected date range"
                  : "Cadre breakdown not available for this period"}
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={cadreChartConfig}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={cadreData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barCategoryGap="20%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="cadre"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  allowDecimals={false}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-foreground mb-2">
                            {label}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-muted-foreground">
                                Cadre Logins:
                              </span>{" "}
                              <span className="font-medium">
                                {data.logins?.toLocaleString() || "N/A"}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">
                                Total Logins:
                              </span>{" "}
                              <span className="font-medium">
                                {data.totalLogins?.toLocaleString() || "N/A"}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">
                                Unique Users:
                              </span>{" "}
                              <span className="font-medium">
                                {data.uniqueUsers?.toLocaleString() || "N/A"}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="logins"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
