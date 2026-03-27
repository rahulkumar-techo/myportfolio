'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Download, ExternalLink, FileImage, FileText, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { buildCloudinaryDownloadUrl, buildCloudinaryImageUrl, isCloudinaryUrl } from '@/lib/cloudinary-images';
import { usePublicAssets } from '@/hooks/usePublicAssets';
import type { AssetItem } from '@/lib/types';

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

function buildCloudinaryPdfPreviewUrl(fileUrl: string) {
  if (!fileUrl || !isCloudinaryUrl(fileUrl)) {
    return '';
  }

  const markerIndex = fileUrl.indexOf('/upload/');
  const prefix = fileUrl.slice(0, markerIndex + '/upload/'.length);
  const suffix = fileUrl.slice(markerIndex + '/upload/'.length);
  return `${prefix}f_jpg,pg_1,q_auto:good,w_900/${suffix}`;
}

function isPdf(asset: AssetItem) {
  return asset.fileType === 'application/pdf' || asset.fileUrl.toLowerCase().includes('.pdf');
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
            <div className="rounded-2xl p-8 text-center text-muted-foreground glass-card">
              Loading assets...
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filteredAssets.map((asset, index) => {
                const Icon = assetIcon(asset);
                const downloadUrl = buildCloudinaryDownloadUrl(asset.fileUrl);
                const fileExt = getFileExtension(asset);
                const showImage = asset.fileType.startsWith('image/');
                const showPdf = isPdf(asset);
                const imagePreviewUrl = showImage
                  ? buildCloudinaryImageUrl(asset.fileUrl, 'asset-preview')
                  : '';
                const pdfPreviewUrl = showPdf ? buildCloudinaryPdfPreviewUrl(asset.fileUrl) : '';

                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="group"
                  >
                    <div className="flex h-full flex-col rounded-2xl p-4 glass-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                      <div className="flex flex-col gap-4">
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
                            ) : showPdf && pdfPreviewUrl ? (
                              <Image
                                src={pdfPreviewUrl}
                                alt={`${asset.label} preview`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-contain"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
                                <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60" />
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
                              <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open
                              </a>
                            </Button>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-base font-semibold text-foreground truncate">{asset.label}</h2>
                          <p className="text-xs text-muted-foreground truncate">{asset.originalName}</p>
                        </div>

                        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <a href={downloadUrl} download={asset.originalName} rel="noopener">
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
