'use client';

import useSWR from 'swr';
import api from '@/lib/axios';
import StorageCard from '@/components/admin/storage/storage-card';
import CollectionList from '@/components/admin/storage/collection-list';
import ActivityChart from '@/components/admin/storage/activity-chart';

type StorageResponse = {
  success: boolean;
  data?: {
    used: number;
    total: number;
    remaining: number;
  };
};

type CollectionsResponse = {
  success: boolean;
  data?: { name: string; size: number }[];
};

type ActivityResponse = {
  success: boolean;
  data?: { label: string; usageMB: number }[];
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function StorageDashboardPage() {
  const { data: storageRes } = useSWR<StorageResponse>('/storage', fetcher);
  const { data: collectionsRes } = useSWR<CollectionsResponse>('/collections', fetcher);
  const { data: activityRes } = useSWR<ActivityResponse>('/activity', fetcher);

  const storage = storageRes?.success ? storageRes.data : null;
  const collections = collectionsRes?.success ? collectionsRes.data : null;
  const activity = activityRes?.success ? activityRes.data : null;

  const storageData = storage ?? mockStorage;
  const collectionsData = collections ?? mockCollections;
  const activityData = activity ?? mockActivity;

  return (
    <div className="relative space-y-8 bg-white text-slate-900">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-[120px]" />

      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Storage Analytics</p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Portfolio Storage Dashboard
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Monitor how your MongoDB storage evolves, which collections grow fastest, and how usage trends over time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <StorageCard used={storageData.used} total={storageData.total} />
        <CollectionList collections={collectionsData} />
      </div>

      <ActivityChart data={activityData} />
    </div>
  );
}

const mockStorage = {
  used: 120,
  total: 512,
  remaining: 392
};

const mockCollections = [
  { name: 'users', size: 50 },
  { name: 'notes', size: 40 },
  { name: 'files', size: 30 },
  { name: 'projects', size: 22 },
  { name: 'messages', size: 16 }
];

const mockActivity = [
  { label: 'Mon', usageMB: 88 },
  { label: 'Tue', usageMB: 94 },
  { label: 'Wed', usageMB: 101 },
  { label: 'Thu', usageMB: 108 },
  { label: 'Fri', usageMB: 114 },
  { label: 'Sat', usageMB: 118 },
  { label: 'Sun', usageMB: 120 }
];
