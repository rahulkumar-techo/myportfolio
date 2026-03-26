import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { buildCloudinaryImageUrl } from "@/lib/cloudinary-images";
import type { CloudinaryImage } from "@/lib/types";

export type BlogFormState = {
  title: string;
  description: string;
  content: string;
  tags: string;
  coverImage: CloudinaryImage | null;
  featured: boolean;
  publishedAt: string;
};

type BlogFormProps = {
  formData: BlogFormState;
  setFormData: (value: BlogFormState) => void;
  isSubmitting: boolean;
  submitError: string | null;
  uploadError: string | null;
  isUploadingImage: boolean;
  editingId?: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onCoverUpload: (file: File | null) => void;
  onRemoveCover: () => void | Promise<void>;
};

export function BlogForm({
  formData,
  setFormData,
  isSubmitting,
  submitError,
  uploadError,
  isUploadingImage,
  editingId,
  onSubmit,
  onCancel,
  onCoverUpload,
  onRemoveCover
}: BlogFormProps) {
  return (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {editingId ? "Edit Blog Post" : "Create Blog Post"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Add markdown content and SEO-ready summaries for the blog page.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-title">Title</Label>
        <Input
          id="blog-title"
          value={formData.title}
          onChange={(event) => setFormData({ ...formData, title: event.target.value })}
          placeholder="Next.js Microservices Guide"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-description">Description</Label>
        <Textarea
          id="blog-description"
          rows={3}
          value={formData.description}
          onChange={(event) => setFormData({ ...formData, description: event.target.value })}
          placeholder="Short summary for SEO and previews."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-tags">Tags (comma separated)</Label>
        <Input
          id="blog-tags"
          value={formData.tags}
          onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
          placeholder="Next.js, Node.js, AI"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="blog-cover">Cover Image</Label>
          {formData.coverImage ? (
            <Button type="button" variant="ghost" size="sm" onClick={onRemoveCover}>
              Remove
            </Button>
          ) : null}
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
          {formData.coverImage?.url ? (
            <div className="relative h-36 w-full overflow-hidden rounded-md">
              <Image
                src={buildCloudinaryImageUrl(formData.coverImage.url, "hero")}
                alt={formData.title || "Blog cover image"}
                fill
                sizes="420px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-36 items-center justify-center text-xs text-muted-foreground">
              No cover image uploaded yet.
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id="blog-cover"
            type="file"
            accept="image/*"
            onChange={(event) => onCoverUpload(event.target.files?.[0] ?? null)}
            disabled={isUploadingImage}
          />
          {isUploadingImage ? (
            <p className="text-xs text-muted-foreground">Uploading image...</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-content">Markdown Content</Label>
        <Textarea
          id="blog-content"
          rows={10}
          value={formData.content}
          onChange={(event) => setFormData({ ...formData, content: event.target.value })}
          placeholder="Write your blog post in Markdown..."
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Switch
            id="blog-featured"
            checked={formData.featured}
            onCheckedChange={(value) => setFormData({ ...formData, featured: value })}
          />
          <Label htmlFor="blog-featured">Featured</Label>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="blog-published">Publish Date</Label>
          <Input
            id="blog-published"
            type="date"
            value={formData.publishedAt}
            onChange={(event) => setFormData({ ...formData, publishedAt: event.target.value })}
            className="max-w-[180px]"
          />
        </div>
      </div>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
      {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : editingId ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Reset
        </Button>
      </div>
    </form>
  );
}
