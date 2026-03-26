import { Button } from "@/components/ui/button";
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
      {blogs.map((blog) => (
        <div key={blog.id} className="glass-card rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{blog.title}</h3>
              <p className="text-sm text-muted-foreground">{blog.description}</p>
            </div>
            <div className="text-xs text-muted-foreground">
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
      ))}
    </div>
  );
}
