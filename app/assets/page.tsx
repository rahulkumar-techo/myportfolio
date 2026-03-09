'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileImage, FileText, FolderOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { usePublicAssets } from '@/hooks/usePublicAssets';
import type { AssetItem } from '@/lib/types';

const categoryOrder: AssetItem['category'][] = ['cv', 'achievement', 'image', 'certificate', 'other'];

function assetIcon(asset: AssetItem) {
  if (asset.fileType.startsWith('image/')) {
    return FileImage;
  }

  return FileText;
}

export default function AssetsPage() {
  const { assets, isLoading, error } = usePublicAssets();
  const [activeCategory, setActiveCategory] = useState<'all' | AssetItem['category']>('all');

  const categories = useMemo(
    () => ['all', ...categoryOrder.filter((category) => assets.some((asset) => asset.category === category))] as const,
    [assets]
  );

  const filteredAssets =
    activeCategory === 'all' ? assets : assets.filter((asset) => asset.category === activeCategory);

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden pb-24 pt-16 md:pt-20">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono text-primary glass-card">
              <FolderOpen className="h-4 w-4" />
              PUBLIC ASSETS
            </span>
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              <span className="text-foreground">Download </span>
              <span className="text-primary text-glow-cyan">Assets</span>
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Browse and download my CV, achievements, certificates, and shared media files from one dedicated page.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10 flex flex-wrap items-center justify-center gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg border px-4 py-2 text-sm font-mono transition-all duration-300 ${
                  activeCategory === category
                    ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                    : 'glass-card border-transparent text-muted-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center text-sm text-muted-foreground"
          >
            Showing <span className="text-primary">{filteredAssets.length}</span> assets
          </motion.p>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="rounded-2xl p-8 text-center text-muted-foreground glass-card">
              Unable to load assets right now.
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="rounded-2xl p-8 text-center text-muted-foreground glass-card">
              No assets found for this category.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset, index) => {
                const Icon = assetIcon(asset);

                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="group"
                  >
                    <div className="flex h-full flex-col rounded-2xl p-6 glass-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {asset.category}
                        </span>
                      </div>

                      <h2 className="mb-2 text-lg font-semibold text-foreground">{asset.label}</h2>
                      <p className="mb-2 truncate text-sm text-muted-foreground">{asset.originalName}</p>
                      <p className="mb-6 text-xs text-muted-foreground">
                        {new Date(asset.uploadedAt).toLocaleDateString()}
                      </p>

                      <div className="mt-auto">
                        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <a href={asset.fileUrl} download={asset.originalName}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
