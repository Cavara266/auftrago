export default function RequestTips({
  title,
  tips,
}: {
  title: string;
  tips: string[];
}) {
  return (
    <section className="premium-section">
      <div className="container premium-provider-card">
        <span className="eyebrow">Bessere Offerten erhalten</span>
        <h2>{title}</h2>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {tips.map((tip, index) => (
            <div
              key={tip}
              className="flex gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
            >
              <strong className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
                {index + 1}
              </strong>
              <p className="pt-1 text-sm leading-6 text-slate-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
