/**
 * Testimonials hook
 */

import useSWR from "swr"
import api from "@/lib/axios"

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useTestimonials() {
  const { data, error, isLoading, mutate } = useSWR("/testimonials", fetcher)

  const createTestimonial = async (payload: any) => {
    const response = await api.post("/testimonials", payload)

    await mutate(
      (current: any) => ({
        ...(current || { success: true, meta: {} }),
        data: [...(current?.data || []), response.data.data]
      }),
      { revalidate: false }
    )

    return response.data.data
  }

  const updateTestimonial = async (id: string, payload: any) => {
    await api.put(`/testimonials/${id}`, payload)
    mutate()
  }

  const deleteTestimonial = async (id: string) => {
    await api.delete(`/testimonials/${id}`)
    mutate()
  }

  return {
    testimonials: data?.data || [],
    isLoading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
  }
}
