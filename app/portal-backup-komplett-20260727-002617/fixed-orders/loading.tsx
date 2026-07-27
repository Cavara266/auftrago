export default function Loading() {
  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 animate-pulse">
          <div className="h-4 w-40 rounded bg-white/10" />

          <div className="mt-6 h-10 w-72 rounded bg-white/10" />

          <div className="mt-4 h-5 w-full max-w-2xl rounded bg-white/10" />
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
            />
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
            />
          ))}
        </section>
      </div>
    </main>
  );
}