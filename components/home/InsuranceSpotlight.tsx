"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Car,
  HeartPulse,
  Home,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import styles from "./InsuranceSpotlight.module.css";

const insuranceTypes = [
  { title: "Krankenkasse", text: "Grund- und Zusatzversicherung vergleichen.", icon: HeartPulse },
  { title: "Autoversicherung", text: "Haftpflicht, Teilkasko und Vollkasko.", icon: Car },
  { title: "Hausrat & Haftpflicht", text: "Schutz für Haushalt, Eigentum und Alltag.", icon: Home },
  { title: "Rechtsschutz", text: "Private, Verkehrs- und Firmenlösungen.", icon: Scale },
  { title: "Vorsorge & Leben", text: "Persönliche Vorsorge und Absicherung.", icon: Users },
  { title: "Firmenversicherung", text: "Individuelle Lösungen für Unternehmen.", icon: Building2 },
];

export default function InsuranceSpotlight() {
  const router = useRouter();

  function startInsuranceRequest(type?: string) {
    const params = new URLSearchParams({ kategorie: "Versicherungen" });

    if (type) {
      params.set("versicherungsart", type);
    }

    router.push(`/auftrag-erstellen?${params.toString()}`);
  }

  return (
    <section className={styles.section} id="versicherungen">
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.badge}>
              <Sparkles size={15} />
              Neu auf Auftrago
            </div>

            <h2>
              Versicherungen vergleichen.
              <span> Persönlich beraten lassen.</span>
            </h2>

            <p>
              Stelle kostenlos eine Versicherungsanfrage. Passende Makler und
              Versicherungsberater aus deiner Region können dich kontaktieren.
            </p>
          </div>

          <button className={styles.primaryButton} onClick={() => startInsuranceRequest()}>
            Versicherungsanfrage starten
            <ArrowRight size={19} />
          </button>
        </div>

        <div className={styles.grid}>
          {insuranceTypes.map(({ title, text, icon: Icon }) => (
            <button
              type="button"
              className={styles.card}
              key={title}
              onClick={() => startInsuranceRequest(title)}
            >
              <div className={styles.cardTop}>
                <span className={styles.icon}>
                  <Icon size={24} />
                </span>
                <span className={styles.newLabel}>Lead</span>
              </div>

              <h3>{title}</h3>
              <p>{text}</p>

              <span className={styles.cardLink}>
                Anfrage starten
                <ArrowRight size={17} />
              </span>
            </button>
          ))}
        </div>

        <div className={styles.brokerPanel}>
          <div className={styles.brokerIcon}>
            <BriefcaseBusiness size={28} />
          </div>

          <div className={styles.brokerCopy}>
            <span>Für Makler & Versicherer</span>
            <h3>Qualifizierte Versicherungsleads kaufen</h3>
            <p>
              Erhalte passende Kundenanfragen nach Versicherungsart und Region.
              Kaufe nur Leads, die zu deinem Geschäft passen.
            </p>
          </div>

          <div className={styles.brokerBenefits}>
            <span><BadgeCheck size={17} /> Qualifizierte Anfragen</span>
            <span><ShieldCheck size={17} /> Kontrollierter Zugriff</span>
          </div>

          <button
            className={styles.secondaryButton}
            onClick={() => router.push("/anbieter-registrieren")}
          >
            Als Makler registrieren
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}