'use client';

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";
import { prepareImageForUpload } from "@/lib/image-upload";
import type { BlogPost } from "@/lib/types";
import { BlogForm, BlogFormState } from "@/app/admin/blogs/components/blog-form";
import { BlogList } from "@/app/admin/blogs/components/blog-list";
import type { ImageUploadKind } from "@/lib/image-presets";

const initialForm: BlogFormState = {
  title: "",
  description: "",
  content: "",
  tags: "",
  coverImage: null,
  featured: false,
  publishedAt: ""
};

export default function AdminBlogsPage() {
  const { blogs, isLoading, error, createBlog, updateBlog, deleteBlog } = useBlogs();
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tempUploads, setTempUploads] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const cleanupTempUploads = async () => {
    if (tempUploads.length === 0) {
      return;
    }

    await Promise.allSettled(
      tempUploads.map((publicId) =>
        fetch("/api/blogs/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId })
        })
      )
    );

    setTempUploads([]);
  };

  const resetForm = async (options?: { cleanupTemp?: boolean }) => {
    if (options?.cleanupTemp) {
      await cleanupTempUploads();
    }
    setEditingBlog(null);
    setFormData(initialForm);
    setSubmitError(null);
    setUploadError(null);
  };

  const startEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setSubmitError(null);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      tags: blog.tags.join(", "),
      coverImage: blog.coverImage ?? null,
      featured: Boolean(blog.featured),
      publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 10) : ""
    });
  };

  const uploadBlogImage = async (file: File, kind: ImageUploadKind) => {
    const preparedFile = await prepareImageForUpload(file, kind);
    const formData = new FormData();
    formData.append("file", preparedFile);
    formData.append("kind", kind);
    const response = await fetch("/api/blogs/upload", {
      method: "POST",
      body: formData
    });

    const payload = await response.json();

    if (!response.ok || !payload?.success) {
      throw new Error(payload?.error ?? "Upload failed.");
    }

    return payload.data as BlogPost["coverImage"];
  };

  const deleteBlogImage = async (publicId: string) => {
    await fetch("/api/blogs/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId })
    });
  };

  const handleCoverUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const uploaded = await uploadBlogImage(file, "cover");
      if (formData.coverImage?.publicId && tempUploads.includes(formData.coverImage.publicId)) {
        await deleteBlogImage(formData.coverImage.publicId);
        setTempUploads((current) => current.filter((id) => id !== formData.coverImage?.publicId));
      }
      if (uploaded?.publicId) {
        setTempUploads((current) => [...current, uploaded.publicId as string]);
      }
      setFormData((current) => ({ ...current, coverImage: uploaded ?? null }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
        setSubmitError("Title, description, and content are required.");
        return;
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        tags: formData.tags,
        coverImage: formData.coverImage,
        featured: formData.featured,
        publishedAt: formData.publishedAt || undefined
      };

      if (editingBlog) {
        await updateBlog(editingBlog.id, payload);
      } else {
        await createBlog(payload);
      }

      setTempUploads([]);
      await resetForm();
    } catch {
      setSubmitError("Unable to save the blog post right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    setDeleteId(blogId);
    try {
      await deleteBlog(blogId);
      if (editingBlog?.id === blogId) {
        void resetForm();
      }
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Failed to load blog posts.</p>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <p className="text-muted-foreground">Create and manage blog content for SEO and thought leadership.</p>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-6 overflow-hidden">
        <BlogForm
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          submitError={submitError}
          uploadError={uploadError}
          isUploadingImage={isUploadingImage}
          editingId={editingBlog?.id}
          onSubmit={handleSubmit}
          onCancel={() => void resetForm({ cleanupTemp: true })}
          onCoverUpload={handleCoverUpload}
          onRemoveCover={async () => {
            if (formData.coverImage?.publicId && tempUploads.includes(formData.coverImage.publicId)) {
              await deleteBlogImage(formData.coverImage.publicId);
              setTempUploads((current) => current.filter((id) => id !== formData.coverImage?.publicId));
            }
            setFormData((current) => ({ ...current, coverImage: null }));
          }}
        />

        <div className="min-h-0 overflow-y-auto admin-scroll">
          <BlogList blogs={blogs} onEdit={startEdit} onDelete={handleDelete} deleteId={deleteId} />
        </div>
      </div>
    </div>
  );
}
