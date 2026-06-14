const reviews = [
  {
    stars: "★★★★★",
    text: "Von der Anfrage bis zur Offertenauswahl verlief alles unkompliziert. Innerhalb weniger Stunden hatten wir mehrere passende Angebote.",
    label: "Umzugsreinigung, Zürich",
  },
  {
    stars: "★★★★★",
    text: "Sehr einfache Anfrage. Die Preisübersicht hat uns geholfen, die erhaltenen Offerten besser einzuschätzen.",
    label: "Fensterreinigung, Baden",
  },
  {
    stars: "★★★★★",
    text: "Wir konnten verschiedene Anbieter vergleichen und schnell den passenden Betrieb finden.",
    label: "Hauswartung, Aarau",
  },
  {
    stars: "★★★★★",
    text: "Der Preisrechner gab uns eine gute Orientierung. Die Anfrage war in wenigen Minuten erledigt.",
    label: "Gartenpflege, Lenzburg",
  },
];

export default function TrustReviewsSection() {
  return (
    <section className="trust-reviews-section">
      <div className="trust-reviews-inner">
        <div className="trust-reviews-head">
          <span>⭐ Erfahrungsberichte</span>
          <h2>So nutzen Kunden Auftrago</h2>
          <p>
            Erfahrungsbeispiele aus verschiedenen Regionen und Dienstleistungen.
          </p>
        </div>

        <div className="trust-stats">
          <div>
            <strong>4.8 / 5</strong>
            <span>Zufriedenheit</span>
          </div>
          <div>
            <strong>1&apos;000+</strong>
            <span>Anfragen vermittelt</span>
          </div>
          <div>
            <strong>24h</strong>
            <span>Schnelle Rückmeldungen</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Kostenlos & unverbindlich</span>
          </div>
        </div>

        <div className="trust-review-grid">
          {reviews.map((review) => (
            <article key={review.label} className="trust-review-card">
              <div className="trust-stars">{review.stars}</div>
              <p>„{review.text}“</p>
              <strong>{review.label}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}