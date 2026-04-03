import Image from "next/image";
import { Button } from "@/components/ui/button";
import { buildCloudinaryImageUrl } from "@/lib/cloudinary-images";
import type { BlogPost } from "@/lib/types";

type BlogListProps = {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (blogId: string) => void;
  deleteId?: string | null;
};

export function BlogList({ blogs, onEdit, onDelete, deleteId }: BlogListProps) {
  if (blogs.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground">
        No blog posts yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Published And Draft Posts</h2>
        <p className="text-sm text-muted-foreground">
          Review, reopen, and manage your existing articles underneath the editor.
        </p>
      </div>

      {blogs.map((blog) => (
        <div key={blog.id} className="glass-card rounded-3xl p-5 flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 xl:h-32 xl:w-56">
            {blog.coverImage?.url ? (
              <Image
                src={buildCloudinaryImageUrl(blog.coverImage.url, "hero")}
                alt={blog.title}
                fill
                sizes="224px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                No cover image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{blog.title}</h3>
                <p className="text-sm text-muted-foreground">{blog.description}</p>
              </div>
              <div className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "Draft"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {blog.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary px-3 py-1">
                  {tag}
                </span>
              ))}
              {blog.featured ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  Featured
                </span>
              ) : null}
              {blog.readingTime ? (
                <span className="rounded-full bg-secondary px-3 py-1">
                  {blog.readingTime}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => onEdit(blog)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(blog.id)}
                disabled={deleteId === blog.id}
              >
                {deleteId === blog.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
