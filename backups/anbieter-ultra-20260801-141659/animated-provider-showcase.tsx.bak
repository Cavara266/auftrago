"use client";

import { useEffect, useMemo, useState } from "react";

import styles from "@/app/anbieter-registrieren/anbieter.module.css";

const demoLeads = [
  {
    category: "Umzugsreinigung",
    place: "Zürich",
    value: "CHF 980",
    badge: "Neue Anfrage",
  },
  {
    category: "Hauswartung",
    place: "Aargau",
    value: "CHF 1’450",
    badge: "Fixauftrag",
  },
  {
    category: "Fensterreinigung",
    place: "Luzern",
    value: "CHF 540",
    badge: "Neuer Lead",
  },
  {
    category: "Gartenpflege",
    place: "Zug",
    value: "CHF 760",
    badge: "Passender Treffer",
  },
];

const notifications = [
  "Neue Anfrage in deiner Region",
  "Passender Fixauftrag verfügbar",
  "Kundenkontakt erfolgreich freigeschaltet",
  "Neue Aktivität in deinem CRM",
];

export default function AnimatedProviderShowcase() {
  const [activeLead, setActiveLead] = useState(0);
  const [notification, setNotification] = useState(0);
  const [counter, setCounter] = useState(0);

  const target = 38000;

  useEffect(() => {
    const leadTimer = window.setInterval(() => {
      setActiveLead((current) => (current + 1) % demoLeads.length);
    }, 3200);

    const notificationTimer = window.setInterval(() => {
      setNotification(
        (current) => (current + 1) % notifications.length,
      );
    }, 2400);

    return () => {
      window.clearInterval(leadTimer);
      window.clearInterval(notificationTimer);
    };
  }, []);

  useEffect(() => {
    const duration = 1300;
    const start = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCounter(Math.round(target * eased));

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    }

    window.requestAnimationFrame(animate);
  }, []);

  const formattedCounter = useMemo(
    () => new Intl.NumberFormat("de-CH").format(counter),
    [counter],
  );

  const lead = demoLeads[activeLead];

  return (
    <div className={styles.productStage}>
      <div className={styles.stageGlow} />

      <div className={styles.floatingChipOne}>
        <span>●</span>
        Neue Kundenchance
      </div>

      <div className={styles.floatingChipTwo}>
        <span>✓</span>
        Kontakt freigeschaltet
      </div>

      <div className={styles.dashboardWindow}>
        <div className={styles.dashboardTopbar}>
          <div className={styles.windowDots}>
            <span />
            <span />
            <span />
          </div>

          <div className={styles.dashboardBrand}>
            <i>A</i>
            Auftrago Firmenportal
          </div>

          <span className={styles.demoBadge}>
            Beispielansicht
          </span>
        </div>

        <div className={styles.dashboardBody}>
          <aside className={styles.dashboardSidebar}>
            <span className={styles.sidebarActive}>Übersicht</span>
            <span>Neue Leads</span>
            <span>Fixaufträge</span>
            <span>Mein CRM</span>
            <span>Credits</span>
          </aside>

          <section className={styles.dashboardContent}>
            <div className={styles.dashboardWelcome}>
              <span>Willkommen im Anbieterportal</span>
              <strong>Neue Chancen. Zentral verwaltet.</strong>
              <p>
                Leads, Fixaufträge und Kundenkontakte an einem Ort.
              </p>
            </div>

            <div className={styles.miniStats}>
              <article>
                <span>Plattform</span>
                <strong>{formattedCounter}+</strong>
                <small>vermittelte Aufträge</small>
              </article>

              <article>
                <span>Regionen</span>
                <strong>26</strong>
                <small>Kantone</small>
              </article>

              <article>
                <span>Dienste</span>
                <strong>420+</strong>
                <small>Kategorien</small>
              </article>
            </div>

            <div className={styles.liveLeadArea}>
              <div className={styles.leadAreaHeading}>
                <div>
                  <span>Passender Treffer</span>
                  <strong>Neue Kundenchance</strong>
                </div>

                <i>LIVE-DEMO</i>
              </div>

              <article
                key={activeLead}
                className={styles.animatedLeadCard}
              >
                <div className={styles.leadCardIcon}>↗</div>

                <div className={styles.leadCardCopy}>
                  <span>{lead.badge}</span>
                  <strong>{lead.category}</strong>
                  <small>{lead.place}</small>
                </div>

                <div className={styles.leadValue}>
                  <span>Auftragswert</span>
                  <strong>{lead.value}</strong>
                </div>

                <button type="button">
                  Ansehen
                </button>
              </article>

              <div className={styles.activityTicker}>
                <span className={styles.tickerPulse} />

                <p key={notification}>
                  {notifications[notification]}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className={styles.mobileLeadPreview}>
        <span>{lead.badge}</span>
        <strong>{lead.category}</strong>
        <small>{lead.place}</small>
        <b>{lead.value}</b>
      </div>
    </div>
  );
}
