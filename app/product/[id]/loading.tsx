import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="two-col" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
      <div className="card">
        <Skeleton style={{ height: 420, marginBottom: 12 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,64px)", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={{ height: 64 }} />)}
        </div>
      </div>
      <div className="card">
        <Skeleton style={{ height: 34, marginBottom: 12 }} />
        <Skeleton style={{ height: 24, width: 140, marginBottom: 12 }} />
        <Skeleton style={{ height: 120, marginBottom: 12 }} />
        <Skeleton style={{ height: 44 }} />
      </div>
    </div>
  );
}
