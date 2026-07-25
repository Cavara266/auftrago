import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAllServices,
  getCategoryByService,
  getService,
} from "@/lib/service-categories";

import DynamicOrderForm from "./dynamic-order-form";
import styles from "./order-form.module.css";

type PageProps = {
  params: {
    service: string;
  };
};

export function generateStaticParams() {
  return getAllServices().map((service) => ({
    service: service.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const service = getService(params.service);

  if (!service) {
    return {
      title: "Dienstleistung nicht gefunden | Auftrago",
    };
  }

  return {
    title: `${service.name} anfragen | Auftrago`,
    description:
      service.description ||
      `Erstelle kostenlos eine Anfrage für ${service.name} und finde passende Anbieter.`,
  };
}

export default function ServiceOrderPage({
  params,
}: PageProps) {
  const service = getService(params.service);
  const category = getCategoryByService(
    params.service
  );

  if (!service || !category) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <div className={styles.shell}>
        <header className={styles.header}>
          <Link
            href="/"
            className={styles.brand}
          >
            <span className={styles.brandIcon}>
              <i />
              <i />
              <i />
            </span>

            <span className={styles.brandText}>
              <strong>auftrago</strong>

              <small>
                Passende Anbieter in deiner Region
              </small>
            </span>
          </Link>

          <Link
            href="/auftrag-erstellen"
            className={styles.backLink}
          >
            ← Dienstleistung ändern
          </Link>
        </header>

        <section className={styles.hero}>
          <div className={styles.breadcrumb}>
            <Link href="/auftrag-erstellen">
              Auftrag erstellen
            </Link>

            <span>/</span>

            <span>{category.name}</span>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.serviceIcon}>
              {service.icon}
            </div>

            <div>
              <span className={styles.categoryLabel}>
                {category.name}
              </span>

              <h1>{service.name}</h1>

              <p>
                {service.description ||
                  "Beschreibe deinen Auftrag und erhalte passende Angebote von qualifizierten Anbietern."}
              </p>
            </div>
          </div>

          <div className={styles.trustRow}>
            <span>✓ Kostenlos anfragen</span>
            <span>✓ Unverbindliche Angebote</span>
            <span>
              ✓ Anbieter aus deiner Region
            </span>
          </div>
        </section>

        <DynamicOrderForm
          service={service}
          category={category}
        />

        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} Auftrago.ch
          </span>

          <nav>
            <Link href="/impressum">
              Impressum
            </Link>

            <Link href="/datenschutz">
              Datenschutz
            </Link>

            <Link href="/agb">
              AGB
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}