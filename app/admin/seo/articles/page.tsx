import Link from "next/link";

export default function SeoArticlesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#050711", color: "#fff", padding: 40 }}>
      <Link href="/admin/seo" style={{ color: "#93c5fd", textDecoration: "none" }}>
        ← Zurück zum SEO Center
      </Link>

      <h1 style={{ fontSize: 52, marginTop: 28 }}>SEO-Ratgeber</h1>
      <p style={{ color: "#94a3b8", maxWidth: 700, lineHeight: 1.7 }}>
        Hier entstehen später Ratgeber, Kategorien, Inhalte und SEO-Metadaten.
      </p>
    </main>
  );
}
