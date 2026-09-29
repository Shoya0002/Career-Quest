"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Gamepad2,
  Sliders,
  Milestone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const ICON_MAP = {
  LayoutDashboard,
  Compass,
  Gamepad2,
  Sliders,
  Milestone,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform Modules
        </p>
        <div className="mt-2 space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || Compass;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? "outline" : "secondary"}
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      isActive && "border-white/40 text-white"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
