"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useMonitoringStore } from "@/store/monitoringStore";

export function TrafficChart() {
  const traffic = useMonitoringStore((s) => s.traffic);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Traffic</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={traffic} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="attackGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 18%)" />
            <XAxis
              dataKey="time"
              tick={{ fill: "hsl(0 0% 64%)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(0 0% 64%)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 8%)",
                border: "1px solid hsl(0 0% 18%)",
                borderRadius: 6,
                fontSize: 11,
              }}
              labelStyle={{ color: "hsl(0 0% 64%)" }}
            />
            <Area
              type="monotone"
              dataKey="normal"
              name="Normal"
              stroke="hsl(210, 80%, 55%)"
              fill="url(#normalGrad)"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
            <Area
              type="monotone"
              dataKey="attack"
              name="Attack"
              stroke="hsl(0, 84%, 60%)"
              fill="url(#attackGrad)"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
