import "./leads-premium.css";

function SkeletonCard() {
  return (
    <article className="lead-loading-card">
      <div className="lead-loading-line lead-loading-line--small" />
      <div className="lead-loading-line lead-loading-line--title" />
      <div className="lead-loading-line" />

      <div className="lead-loading-grid">
        <div className="lead-loading-box" />
        <div className="lead-loading-box" />
        <div className="lead-loading-box" />
      </div>

      <div className="lead-loading-button" />
    </article>
  );
}

export default function Loading() {
  return (
    <main className="provider-leads-page lead-loading-page">
      <header className="lead-loading-hero">
        <div className="lead-loading-line lead-loading-line--small" />
        <div className="lead-loading-line lead-loading-line--hero" />
        <div className="lead-loading-line lead-loading-line--wide" />
      </header>

      <section className="lead-loading-layout">
        <div className="lead-loading-list">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <aside>
          <div className="lead-loading-sidebar">
            <div className="lead-loading-line lead-loading-line--small" />
            <div className="lead-loading-line lead-loading-line--title" />
            <div className="lead-loading-line" />
            <div className="lead-loading-button" />
          </div>
        </aside>
      </section>
    </main>
  );
}
