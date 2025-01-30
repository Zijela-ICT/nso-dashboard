"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  totalFacilitiess: {
    label: "totalFacilitiess",
  },
  public: {
    label: "public",
    color: "hsl(var(--chart-1))",
  },
  private: {
    label: "private",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PieChartComponent({
  pieData,
}: {
  pieData: { public: number; private: number; total: number };
}) {
  const chartData = [
    {
      facilityType: "public",
      facilities: pieData?.public,
      fill: "var(--color-public)",
    },
    {
      facilityType: "private",
      facilities: pieData?.private,
      fill: "var(--color-private)",
    },
  ];
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Facilities by type</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="facilities"
              nameKey="facilityType"
              innerRadius={45}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {pieData.total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Facilitiess
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="facilityType" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
