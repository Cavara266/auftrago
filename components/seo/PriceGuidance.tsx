type PriceGuidanceProps = {
  title: string;
  text: string;
  from?: number;
  to?: number;
  unit?: string;
};

export default function PriceGuidance({
  title,
  text,
  from,
  to,
  unit,
}: PriceGuidanceProps) {
  return (
    <section className="premium-section">
      <div className="container">
        <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-emerald-400/10 via-white/[0.035] to-transparent p-7 sm:p-9">
          <span className="eyebrow">Preisorientierung</span>
          <h2>{title}</h2>

          {from && to ? (
            <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
              <strong className="text-3xl font-black text-white sm:text-4xl">
                CHF {from.toLocaleString("de-CH")}–{to.toLocaleString("de-CH")}
              </strong>
              {unit ? (
                <span className="pb-1 text-sm font-semibold text-slate-400">
                  {unit}
                </span>
              ) : null}
            </div>
          ) : null}

          <p className="mt-5 max-w-4xl leading-7 text-slate-400">{text}</p>
        </div>
      </div>
    </section>
  );
}
