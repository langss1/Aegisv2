"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TrafficData } from "../lib/mockEngine";

export function TrafficChart({ data }: { data: TrafficData[] }) {
  return (
    <div className="bg-card border border-border p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center text-foreground">
        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2 animate-pulse" />
        Live Traffic Monitoring
      </h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#888" tick={{ fill: '#888' }} />
            <YAxis stroke="#888" tick={{ fill: '#888' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="normal" 
              name="Normal Traffic"
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="attack" 
              name="Malicious Traffic"
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
