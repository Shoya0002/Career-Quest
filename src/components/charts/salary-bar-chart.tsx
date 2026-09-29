"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartContainer } from "./chart-container";
import { COLOR_TOKENS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export interface SalaryDataPoint {
  stage: string;
  salary: number;
}

interface SalaryBarChartProps {
  data: SalaryDataPoint[];
  height?: number;
}

export function SalaryBarChart({ data, height = 260 }: SalaryBarChartProps) {
  return (
    <ChartContainer height={height}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={{ stroke: "#E2E8F0" }}
          tick={{ fill: COLOR_TOKENS.textSecondary, fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#E2E8F0" }}
          tick={{ fill: COLOR_TOKENS.textSecondary, fontSize: 12 }}
          tickFormatter={(value: number) => `$${value / 1000}k`}
        />
        <Tooltip
          formatter={(value) => [
            formatCurrency(Number(value ?? 0)),
            "Expected Salary",
          ]}
          contentStyle={{
            backgroundColor: COLOR_TOKENS.surface,
            borderColor: "#E2E8F0",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: "12px",
          }}
        />
        <Bar
          dataKey="salary"
          fill={COLOR_TOKENS.primary}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
