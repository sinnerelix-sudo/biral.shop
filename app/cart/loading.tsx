import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="two-col">
      <div className="card">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} style={{ height: 82, marginBottom: 10 }} />)}
      </div>
      <div className="card">
        <Skeleton style={{ height: 24, marginBottom: 10 }} />
        <Skeleton style={{ height: 18, marginBottom: 6 }} />
        <Skeleton style={{ height: 18, marginBottom: 12 }} />
        <Skeleton style={{ height: 44 }} />
      </div>
    </div>
  );
}
