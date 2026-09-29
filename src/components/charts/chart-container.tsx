"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: React.ReactElement;
  height?: number | `${number}%`;
  width?: number | `${number}%`;
  className?: string;
}

export function ChartContainer({
  children,
  height = 300,
  width = "100%",
  className,
}: ChartContainerProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg", className)}>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
