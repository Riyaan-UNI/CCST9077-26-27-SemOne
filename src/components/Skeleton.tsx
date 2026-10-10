import { cn } from '@/lib/utils';

/** Pulsing placeholder used while content loads. */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-xl border border-line bg-elevated/70', className)}
    />
  );
}
