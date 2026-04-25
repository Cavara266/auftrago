export default function Loading() {
  return (
    <main className="container-app section-space">
      <section className="card mx-auto max-w-4xl p-6 sm:p-10">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-40 rounded-full bg-white/10" />
          <div className="mb-4 h-10 w-2/3 rounded-2xl bg-white/10" />
          <div className="mb-3 h-4 w-full rounded-full bg-white/10" />
          <div className="mb-3 h-4 w-11/12 rounded-full bg-white/10" />
          <div className="mb-8 h-4 w-8/12 rounded-full bg-white/10" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-28 rounded-3xl border border-white/10 bg-white/5" />
            <div className="h-28 rounded-3xl border border-white/10 bg-white/5" />
            <div className="h-28 rounded-3xl border border-white/10 bg-white/5" />
          </div>
        </div>
      </section>
    </main>
  )
}