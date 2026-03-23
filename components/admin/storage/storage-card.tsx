'use client';

import { motion } from 'framer-motion';

type StorageCardProps = {
  used: number;
  total: number;
};

export default function StorageCard({ used, total }: StorageCardProps) {
  const remaining = Math.max(0, total - used);
  const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Storage Usage</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {used.toFixed(2)} MB / {total} MB used
          </h2>
          <p className="mt-1 text-sm text-slate-500">{remaining.toFixed(2)} MB remaining</p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">Used</p>
          <p className="text-2xl font-semibold text-slate-900">{percent.toFixed(0)}%</p>
        </div>
      </div>

      <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_6px_20px_rgba(99,102,241,0.35)]"
        />
      </div>
    </motion.section>
  );
}
