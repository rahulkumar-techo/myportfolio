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
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,12,40,0.4)] backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">Collection Breakdown</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Largest Collections</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
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
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-white">{collection.name}</p>
                  <p className="text-xs text-gray-400">Collection size</p>
                </div>
                <p className="text-sm font-semibold text-white">{collection.size.toFixed(2)} MB</p>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
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
