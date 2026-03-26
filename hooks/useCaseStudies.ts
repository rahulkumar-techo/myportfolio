import useSWR from "swr";
import api from "@/lib/axios";
import { normalizeProjects } from "@/lib/project-utils";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useCaseStudies(limit?: number) {
  const query = typeof limit === "number" ? `?limit=${limit}` : "";
  const { data, error, isLoading } = useSWR(`/case-studies${query}`, fetcher);

  return {
    caseStudies: normalizeProjects(data?.data),
    isLoading,
    error
  };
}
