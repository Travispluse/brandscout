import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted", className)}
      {...props}
    />
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Score skeleton */}
      <div className="rounded-xl border border-border p-6 flex items-center gap-8">
        <Skeleton className="w-[100px] h-[100px] rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Domain skeleton */}
      <div className="rounded-xl border border-border p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* Username skeleton */}
      <div className="rounded-xl border border-border p-6 space-y-4">
        <Skeleton className="h-5 w-44" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* Suggestions skeleton */}
      <div className="rounded-xl border border-border p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28" />
          ))}
        </div>
      </div>
    </div>
  );
}
