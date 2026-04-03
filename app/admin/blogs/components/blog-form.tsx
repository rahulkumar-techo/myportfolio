import Image from "next/image";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Eye, FileText, ImagePlus, Sparkles } from "lucide-react";
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
  setFormData: React.Dispatch<React.SetStateAction<BlogFormState>>;
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

type EditorMode = "write" | "preview" | "split";

const markdownSnippets = [
  { label: "H2", value: "## Section title" },
  { label: "H3", value: "### Subheading" },
  { label: "Bold", value: "**Highlight this point**" },
  { label: "List", value: "- Key takeaway\n- Supporting detail\n- Closing insight" },
  { label: "Quote", value: "> Strong opinion, lesson, or takeaway." },
  { label: "Code", value: "```ts\nconsole.log('example')\n```" },
  { label: "Link", value: "[Resource title](https://example.com)" }
];

function formatPreviewDate(value: string) {
  if (!value) {
    return "Draft";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Draft"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    readingTime: `${minutes} min read`
  };
}

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
  const [editorMode, setEditorMode] = useState<EditorMode>("split");
  const [previewHtml, setPreviewHtml] = useState("");
  const deferredContent = useDeferredValue(formData.content);
  const stats = useMemo(() => estimateReadingTime(formData.content), [formData.content]);

  useEffect(() => {
    let cancelled = false;

    startTransition(() => {
      void import("@/lib/markdown")
        .then(({ renderMarkdownToHtml }) => renderMarkdownToHtml(deferredContent))
        .then((html) => {
          if (!cancelled) {
            setPreviewHtml(html);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setPreviewHtml("");
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [deferredContent]);

  const insertSnippet = (snippet: string) => {
    setFormData((current) => {
      const nextContent = current.content.trim()
        ? `${current.content.replace(/\s*$/, "")}\n\n${snippet}`
        : snippet;

      return {
        ...current,
        content: nextContent
      };
    });
  };

  return (
    <form onSubmit={onSubmit} className="glass-card rounded-3xl p-5 md:p-7 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Publishing Workspace
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {editingId ? "Refine Blog Post" : "Write New Blog Post"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Draft in Markdown, preview the final article, and tune metadata before publishing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-background/40 p-3 sm:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Words</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{stats.wordCount}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Reading</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{stats.readingTime}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Status</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{formData.publishedAt ? "Scheduled" : "Draft"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Featured</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{formData.featured ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_380px]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                placeholder="A practical guide to shipping AI features with Next.js"
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-tags">Tags (comma separated)</Label>
              <Input
                id="blog-tags"
                value={formData.tags}
                onChange={(event) => setFormData((current) => ({ ...current, tags: event.target.value }))}
                placeholder="Next.js, AI, Architecture"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-description">Description</Label>
            <Textarea
              id="blog-description"
              rows={3}
              value={formData.description}
              onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
              placeholder="Write a sharp summary for SEO, cards, and social previews."
              required
              className="min-h-[110px] resize-y"
            />
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40">
            <div className="flex flex-col gap-4 border-b border-border/60 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <Label htmlFor="blog-content" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  Markdown Content
                </Label>
                <p className="text-xs text-muted-foreground">
                  Write your article in Markdown and review the final rendered layout before saving.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["write", "preview", "split"] as const).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={editorMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditorMode(mode)}
                    className="capitalize"
                  >
                    {mode === "preview" ? <Eye className="mr-2 h-4 w-4" /> : null}
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-border/60 px-4 py-3">
              {markdownSnippets.map((snippet) => (
                <Button
                  key={snippet.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertSnippet(snippet.value)}
                >
                  {snippet.label}
                </Button>
              ))}
            </div>

            <div
              className={`grid min-h-[560px] ${
                editorMode === "split" ? "xl:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {editorMode !== "preview" ? (
                <div className={`${editorMode === "split" ? "border-b xl:border-b-0 xl:border-r border-border/60" : ""}`}>
                  <Textarea
                    id="blog-content"
                    value={formData.content}
                    onChange={(event) => setFormData((current) => ({ ...current, content: event.target.value }))}
                    placeholder={`# Opening hook\n\nStart with a strong thesis, then break the post into clear sections.\n\n## Key insight\n- What happened\n- Why it mattered\n- What readers can apply`}
                    required
                    className="min-h-[560px] resize-none border-0 bg-transparent px-4 py-4 font-mono text-sm leading-7 shadow-none focus-visible:ring-0"
                  />
                </div>
              ) : null}

              {editorMode !== "write" ? (
                <div className="min-h-[560px] bg-background/20 px-4 py-4">
                  {previewHtml ? (
                    <div className="rich-text prose prose-neutral max-w-none text-sm text-foreground [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-secondary [&_pre]:p-4" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  ) : (
                    <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/40 text-sm text-muted-foreground">
                      Preview will appear here as you write.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <Label htmlFor="blog-cover" className="text-sm font-medium">
                Cover Image
              </Label>
              {formData.coverImage ? (
                <Button type="button" variant="ghost" size="sm" onClick={onRemoveCover}>
                  Remove
                </Button>
              ) : null}
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
              {formData.coverImage?.url ? (
                <div className="relative h-52 w-full">
                  <Image
                    src={buildCloudinaryImageUrl(formData.coverImage.url, "hero")}
                    alt={formData.title || "Blog cover image"}
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-52 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                  <ImagePlus className="h-8 w-8 text-primary/60" />
                  <p>Upload a strong cover image for cards, search previews, and article headers.</p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Input
                id="blog-cover"
                type="file"
                accept="image/*"
                onChange={(event) => onCoverUpload(event.target.files?.[0] ?? null)}
                disabled={isUploadingImage}
              />
              <p className="text-xs text-muted-foreground">
                Wide images work best. Keep the visual simple and legible.
              </p>
              {isUploadingImage ? (
                <p className="text-xs text-muted-foreground">Uploading image...</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Publishing Settings</h3>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-xl border border-border/60 bg-background/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Featured post</p>
                    <p className="text-xs text-muted-foreground">Highlight this article in key blog sections.</p>
                  </div>
                  <Switch
                    id="blog-featured"
                    checked={formData.featured}
                    onCheckedChange={(value) => setFormData((current) => ({ ...current, featured: value }))}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-2">
                <Label htmlFor="blog-published">Publish Date</Label>
                <Input
                  id="blog-published"
                  type="date"
                  value={formData.publishedAt}
                  onChange={(event) => setFormData((current) => ({ ...current, publishedAt: event.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Preview label: {formatPreviewDate(formData.publishedAt)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Editorial Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Lead with a sharp promise in the first paragraph.</li>
              <li>Use clear `##` sections so the post scans well.</li>
              <li>Keep the description concise and search-friendly.</li>
            </ul>
          </div>
        </div>
      </div>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
      {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
        <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
          {isSubmitting ? "Saving..." : editingId ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Reset
        </Button>
      </div>
    </form>
  );
}
