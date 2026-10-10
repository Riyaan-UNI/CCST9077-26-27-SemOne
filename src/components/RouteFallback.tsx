import Skeleton from '@/components/Skeleton';

/** Skeleton shown while a lazily-loaded route is fetched. */
export default function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-24" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-6 h-14 w-3/4" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
    </div>
  );
}
