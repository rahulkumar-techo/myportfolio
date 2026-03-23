'use client';

import { motion } from 'framer-motion';

type CollectionItem = {
  name: string;
  size: number;
};

type CollectionListProps = {
  collections: CollectionItem[];
};

export default function CollectionList({ collections }: CollectionListProps) {
  const sorted = [...collections].sort((a, b) => b.size - a.size);
  const maxSize = Math.max(...sorted.map((item) => item.size), 1);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Collection Breakdown</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Largest Collections</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          {sorted.length} collections
        </span>
      </div>

      <ul className="space-y-4">
        {sorted.map((collection, index) => {
          const percent = (collection.size / maxSize) * 100;
          return (
            <motion.li
              key={collection.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-slate-900">{collection.name}</p>
                  <p className="text-xs text-slate-500">Collection size</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{collection.size.toFixed(2)} MB</p>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-cyan-400/90"
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}
