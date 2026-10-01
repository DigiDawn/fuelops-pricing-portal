export default function Loading() {
  return (
    <div className="animate-pulse space-y-7">
      <div>
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="mt-3 h-9 w-72 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr,.9fr]">
        <div className="h-96 rounded-2xl border border-slate-200 bg-white" />
        <div className="h-96 rounded-2xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}
