'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { FileText, FolderOpen, ImageIcon, Loader2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssets } from '@/hooks/useAssets'
import type { AssetItem } from '@/lib/types'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

const categoryOptions: AssetItem['category'][] = ['cv', 'achievement', 'image', 'certificate', 'other']

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminAssetsPage() {
  const { assets, isLoading, error, uploadAsset, deleteAsset } = useAssets()
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState<AssetItem['category']>('cv')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const assetsPerPage = 6
  const totalPages = Math.max(1, Math.ceil(assets.length / assetsPerPage))
  const paginatedAssets = useMemo(
    () => assets.slice((currentPage - 1) * assetsPerPage, currentPage * assetsPerPage),
    [assets, currentPage]
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    if (!selectedFile) {
      setSubmitError('Please choose a file to upload.')
      return
    }

    setIsSubmitting(true)

    try {
      await uploadAsset({
        label,
        category,
        file: selectedFile
      })

      setLabel('')
      setCategory('cv')
      setSelectedFile(null)
      const input = document.getElementById('asset-file') as HTMLInputElement | null
      if (input) {
        input.value = ''
      }
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Unable to upload the asset right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (assetId: string) => {
    setDeleteId(assetId)

    try {
      await deleteAsset(assetId)
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load assets.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assets Library</h1>
        <p className="text-muted-foreground">
          Upload and label your CV, achievements, certificates, images, and other files from one place.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Upload Asset</h2>
            <p className="text-sm text-muted-foreground">Each file is stored with a clear label and category.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-label">Label</Label>
            <Input
              id="asset-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Rahul CV, Hackathon Certificate, Achievement Banner"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value: AssetItem['category']) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-file">File</Label>
            <Input
              id="asset-file"
              type="file"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              required
            />
            <p className="text-xs text-muted-foreground">Max file size: 10MB</p>
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload Asset
          </Button>
        </form>

        <div className="space-y-4">
          {paginatedAssets.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <FolderOpen className="mx-auto mb-4 h-10 w-10 text-primary" />
              <p className="text-lg font-medium text-foreground">No assets uploaded yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Start by uploading your CV, achievement images, or certificates.</p>
            </div>
          ) : (
            paginatedAssets.map((asset) => {
              const isImage = asset.fileType.startsWith('image/')

              return (
                <div key={asset.id} className="glass-card rounded-2xl p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary/30">
                        {isImage ? (
                          <Image
                            src={asset.fileUrl}
                            alt={asset.label}
                            width={80}
                            height={80}
                            className="h-20 w-20 object-cover"
                          />
                        ) : asset.category === 'cv' || asset.category === 'certificate' ? (
                          <FileText className="h-8 w-8 text-primary" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-primary" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">{asset.label}</p>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{asset.category}</span>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">{asset.originalName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatBytes(asset.size)} • {new Date(asset.uploadedAt).toLocaleString()}
                        </p>
                        <a
                          href={asset.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-sm text-primary hover:underline"
                        >
                          Open file
                        </a>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={deleteId === asset.id}
                      onClick={() => void handleDelete(asset.id)}
                    >
                      {deleteId === asset.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })
          )}

          {totalPages > 1 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault()
                        setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </div>
    </div>
  )
}
