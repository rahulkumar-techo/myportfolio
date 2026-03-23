'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';

type ActivityPoint = {
  label: string;
  usageMB: number;
};

type ActivityChartProps = {
  data: ActivityPoint[];
};

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Activity</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Storage Growth (7 Days)</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          Updated daily
        </span>
      </div>

      <div className="h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="usageLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.35)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              stroke="rgba(71,85,105,0.9)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(71,85,105,0.9)"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} MB`}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255,255,255,0.98)',
                border: '1px solid rgba(148,163,184,0.35)',
                borderRadius: 16,
                color: '#0f172a'
              }}
              labelStyle={{ color: '#334155' }}
              formatter={(value: number) => [`${value} MB`, 'Usage']}
            />
            <Line
              type="monotone"
              dataKey="usageMB"
              stroke="url(#usageLine)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: '#a78bfa' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
