import type { ForecastData } from "./types";

type Props = {
  data: ForecastData;
  formatMoney: (value: number) => string;
};

export default function Forecast({ data, formatMoney }: Props) {
  return (
    <section className="analytics-forecast">
      <div>
        <small>PROGNOSE NÄCHSTE 30 TAGE</small>
        <h2>Business Forecast</h2>
        <p>
          Hochrechnung auf Basis der Aktivität der letzten 30 Tage. Die Werte
          dienen als operative Orientierung.
        </p>
      </div>

      <div className="analytics-forecast-grid">
        <div>
          <span>Umsatz</span>
          <strong>{formatMoney(data.projectedRevenue)}</strong>
        </div>
        <div>
          <span>Leads</span>
          <strong>{data.projectedLeads}</strong>
        </div>
        <div>
          <span>Anbieter</span>
          <strong>{data.projectedProviders}</strong>
        </div>
        <div>
          <span>Konfidenz</span>
          <strong>{data.confidence}%</strong>
        </div>
      </div>
    </section>
  );
}
