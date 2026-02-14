import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="two-col">
      <div className="card">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} style={{ height: i === 4 ? 120 : 46, marginBottom: 10 }} />)}
      </div>
      <div className="card">
        <Skeleton style={{ height: 24, marginBottom: 10 }} />
        <Skeleton style={{ height: 16, marginBottom: 8 }} />
        <Skeleton style={{ height: 16, marginBottom: 8 }} />
        <Skeleton style={{ height: 38 }} />
      </div>
    </div>
  );
}
