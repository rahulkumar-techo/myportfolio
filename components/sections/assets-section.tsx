'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, FileImage, FileText, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePublicAssets } from '@/hooks/usePublicAssets';
import type { AssetItem } from '@/lib/types';
import Image from 'next/image';
import { buildCloudinaryImageUrl } from '@/lib/cloudinary-images';
import PdfPreview from '@/components/pdf-preview';

const categoryOrder: AssetItem['category'][] = ['cv', 'achievement', 'image', 'certificate', 'other'];

function assetIcon(asset: AssetItem) {
  if (asset.fileType.startsWith('image/')) {
    return FileImage;
  }

  return FileText;
}

function getFileExtension(asset: AssetItem) {
  const name = asset.originalName || asset.fileUrl;
  const match = name.match(/\.([a-z0-9]+)(?:\?|#|$)/i);
  return match ? match[1].toUpperCase() : 'FILE';
}

function isPdf(asset: AssetItem) {
  return asset.fileType === 'application/pdf' || asset.fileUrl.toLowerCase().includes('.pdf');
}

function buildAssetViewUrl(assetId: string) {
  return `/api/assets/file/${assetId}`;
}

function buildAssetDownloadUrl(assetId: string) {
  return `/api/assets/file/${assetId}?download=1`;
}

export default function AssetsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { assets, isLoading } = usePublicAssets();
  const featuredAssets = assets.filter((asset) => asset.featured);
  const [activeCategory, setActiveCategory] = useState<'all' | AssetItem['category']>('all');

  const categories = useMemo(
    () => ['all', ...categoryOrder.filter((category) => featuredAssets.some((asset) => asset.category === category))] as const,
    [featuredAssets]
  );

  const filteredAssets =
    activeCategory === 'all' ? featuredAssets : featuredAssets.filter((asset) => asset.category === activeCategory);

  return (
    <section id="assets" className="relative overflow-hidden py-24 md:py-32" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono text-primary glass-card">
            <FolderOpen className="h-4 w-4" />
            DOWNLOADS
          </span>
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            <span className="text-foreground">Public </span>
            <span className="text-primary text-glow-cyan">Assets</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Browse and download my CV, achievement files, certificates, and public media resources.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 sm:justify-center sm:flex-wrap sm:overflow-visible"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-mono transition-all duration-300 ${
                activeCategory === category
                  ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                  : 'glass-card border-transparent text-muted-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredAssets.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl p-10 text-center glass-card">
            <FolderOpen className="mx-auto mb-4 h-10 w-10 text-primary" />
            <p className="text-lg font-medium text-foreground">No featured assets yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Mark files as featured from the admin panel to highlight them here.</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl p-10 text-center glass-card">
            <FolderOpen className="mx-auto mb-4 h-10 w-10 text-primary" />
            <p className="text-lg font-medium text-foreground">No featured files in this category.</p>
            <p className="mt-2 text-sm text-muted-foreground">Choose another category or feature more assets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {filteredAssets.map((asset, index) => {
              const Icon = assetIcon(asset);
              const fileExt = getFileExtension(asset);
              const showImage = asset.fileType.startsWith('image/');
              const showPdf = isPdf(asset);
              const imagePreviewUrl = showImage
                ? buildCloudinaryImageUrl(asset.fileUrl, 'asset-preview')
                : '';
              const assetViewUrl = buildAssetViewUrl(asset.id);
              const assetDownloadUrl = buildAssetDownloadUrl(asset.id);

              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group min-w-0 w-full max-w-[320px]"
                >
                  <div className="flex h-full min-w-0 flex-col rounded-2xl p-3 glass-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                    <div className="flex flex-col gap-3">
                      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-secondary/30">
                        <div className="relative aspect-square w-full">
                          {showImage ? (
                            <Image
                              src={imagePreviewUrl || asset.fileUrl}
                              alt={asset.label}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-contain"
                            />
                          ) : showPdf ? (
                            <PdfPreview
                              src={assetViewUrl}
                              alt={`${asset.label} preview`}
                              className="bg-white"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
                              <Icon className="h-8 w-8 text-primary/60" />
                              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-mono uppercase tracking-[0.2em]">
                                {fileExt}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <Button
                            asChild
                            variant="outline"
                            className="border-primary/40 text-primary hover:border-primary hover:bg-primary/10"
                          >
                            <a href={assetViewUrl} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">{asset.label}</h3>
                        <p className="text-[11px] text-muted-foreground truncate">{asset.originalName}</p>
                      </div>

                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <a href={assetDownloadUrl}>
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
  );
}
