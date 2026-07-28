import "./loading.css";

export default function CreditsLoading() {
  return (
    <main className="credits-loading">
      <div className="credits-loading__orb credits-loading__orb--one" />
      <div className="credits-loading__orb credits-loading__orb--two" />

      <section className="credits-loading__card">
        <div className="credits-loading__icon">
          <span>●</span>
        </div>

        <span className="credits-loading__eyebrow">
          AUFTRAGO CREDITS
        </span>

        <h1>Credits werden geladen</h1>

        <p>
          Dein Guthaben und die verfügbaren Pakete
          werden vorbereitet.
        </p>

        <div className="credits-loading__progress">
          <span />
        </div>

        <div className="credits-loading__skeletons">
          <div />
          <div />
          <div />
        </div>

        <a
          href="/portal/guthaben"
          className="credits-loading__retry"
        >
          Jetzt erneut laden
          <span>→</span>
        </a>
      </section>
    </main>
  );
}
