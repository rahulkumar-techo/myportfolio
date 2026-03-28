import useSWR from "swr";
import api from "@/lib/axios";
import type { NotificationSubscriber, PushSubscriber } from "@/lib/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useNotificationsAdmin() {
  const { data, error, isLoading, mutate } = useSWR("/notifications/admin", fetcher);

  return {
    subscribers: (data?.data?.emails ?? []) as NotificationSubscriber[],
    tokens: (data?.data?.tokens ?? []) as PushSubscriber[],
    isLoading,
    error,
    mutate
  };
}
