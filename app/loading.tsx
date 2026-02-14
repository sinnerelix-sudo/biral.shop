import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div>
      <Skeleton className="" style={{ height: 34, width: 220, marginBottom: 16 }} />
      <div className="grid product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card">
            <Skeleton className="" style={{ height: 160, marginBottom: 10 }} />
            <Skeleton className="" style={{ height: 20, marginBottom: 8 }} />
            <Skeleton className="" style={{ height: 18, width: "50%", marginBottom: 10 }} />
            <Skeleton className="" style={{ height: 40 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
