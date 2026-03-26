import useSWR from "swr";
import api from "@/lib/axios";
import { normalizeBlogPosts } from "@/lib/blog";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useBlogs() {
  const { data, error, isLoading, mutate } = useSWR("/blogs", fetcher);

  const createBlog = async (payload: any) => {
    await api.post("/blogs", payload);
    mutate();
  };

  const updateBlog = async (id: string, payload: any) => {
    await api.put(`/blogs/${id}`, payload);
    mutate();
  };

  const deleteBlog = async (id: string) => {
    await api.delete(`/blogs/${id}`);
    mutate();
  };

  return {
    blogs: normalizeBlogPosts(data?.data),
    isLoading,
    error,
    createBlog,
    updateBlog,
    deleteBlog
  };
}
