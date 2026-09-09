import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webseiten & SEO für Schweizer Unternehmen | Auftrago Web",
  description:
    "Premium Webseiten und SEO für Schweizer Unternehmen. Moderne Websites, Local SEO, mobile Optimierung und verkaufsstarke Strukturen.",
  alternates: {
    canonical: "https://www.auftrago.ch/webseite-seo",
  },
};

const mail =
  "mailto:info@auftrago.ch?subject=Anfrage%20Webseite%20%26%20SEO";

const packages = [
  {
    kicker: "PROFESSIONELL STARTEN",
    name: "START",
    price: "990",
    intro:
      "Der professionelle Einstieg für Unternehmen, die endlich einen starken digitalen Auftritt wollen.",
    features: [
      "Individuelles Premium-Design",
      "Smartphone, Tablet & Desktop",
      "Startseite & Leistungsbereiche",
      "Kontakt- und Anfragebereiche",
      "WhatsApp-Integration",
      "Datenschutz & Impressum",
      "Technische Grundoptimierung",
      "Performance-Optimierung",
    ],
  },
  {
    kicker: "UNSERE EMPFEHLUNG",
    name: "BUSINESS",
    price: "1'990",
    featured: true,
    intro:
      "Für Unternehmen, die ihre Webseite aktiv für Vertrauen, Sichtbarkeit und Kundengewinnung einsetzen möchten.",
    features: [
      "Alles aus START",
      "Mehrere Leistungsseiten",
      "Starke Unternehmensdarstellung",
      "Basis-SEO",
      "Regionale Ausrichtung",
      "Google-freundliche Seitenstruktur",
      "Google Maps Integration",
      "Conversion-optimierte Bereiche",
      "Premium Call-to-Actions",
      "Erweiterte Performance-Optimierung",
    ],
  },
  {
    kicker: "MAXIMALE SICHTBARKEIT",
    name: "SEO PRO",
    price: "3'490",
    intro:
      "Für Unternehmen, die Google langfristig als zusätzlichen Vertriebskanal aufbauen möchten.",
    features: [
      "Alles aus BUSINESS",
      "Umfangreiche SEO-Architektur",
      "Lokale Landingpages",
      "Dienstleistungsseiten",
      "Regionsseiten",
      "Keyword-orientierte Struktur",
      "Technische SEO",
      "Meta Titles & Descriptions",
      "Interne Verlinkungsstrategie",
      "Search Console Vorbereitung",
      "Skalierbare SEO-Struktur",
    ],
  },
];

const benefits = [
  {
    icon: "◈",
    title: "Premium Design",
    text: "Ein Auftritt, der Vertrauen schafft, bevor der Kunde überhaupt mit dir gesprochen hat.",
  },
  {
    icon: "↗",
    title: "Auf Anfragen ausgelegt",
    text: "Struktur, Inhalte und Call-to-Actions werden konsequent auf neue Kunden ausgerichtet.",
  },
  {
    icon: "◎",
    title: "Mobile First",
    text: "Deine Webseite sieht auf Smartphone, Tablet und Desktop hochwertig und professionell aus.",
  },
  {
    icon: "⌁",
    title: "SEO-Struktur",
    text: "Auf Wunsch bauen wir deine Webseite technisch und strukturell für langfristige Sichtbarkeit aus.",
  },
  {
    icon: "⚡",
    title: "Schnell & modern",
    text: "Moderne Technologie, klare Nutzerführung und hohe Performance statt veralteter Baukastenseiten.",
  },
  {
    icon: "✦",
    title: "Für Schweizer KMU",
    text: "Entwickelt für Reinigungen, Handwerker, Umzugsfirmen, Hauswartungen und weitere Dienstleister.",
  },
];

const steps = [
  {
    no: "01",
    title: "Kennenlernen",
    text: "Wir lernen dein Unternehmen, deine Leistungen, deine Region und deine Ziele kennen.",
  },
  {
    no: "02",
    title: "Strategie",
    text: "Wir definieren Aufbau, Seitenstruktur, Inhalte, Design und – falls gewünscht – SEO.",
  },
  {
    no: "03",
    title: "Design & Umsetzung",
    text: "Wir entwickeln deine neue Webseite als hochwertigen digitalen Auftritt.",
  },
  {
    no: "04",
    title: "Go Live",
    text: "Nach deiner Freigabe geht deine Webseite online und kann rund um die Uhr für dein Unternehmen arbeiten.",
  },
];

export default function WebsiteSeoPage() {
  return (
    <main className="aw-page">
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        .aw-page {
          --bg: #020817;
          --card: rgba(7, 16, 34, .78);
          --line: rgba(148, 163, 184, .14);
          --muted: #94a3b8;
          --blue: #38bdf8;
          --violet: #8b5cf6;
          --green: #52f3a5;

          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 78% 7%, rgba(103, 70, 255, .20), transparent 27%),
            radial-gradient(circle at 8% 20%, rgba(14, 165, 233, .12), transparent 30%),
            radial-gradient(circle at 48% 82%, rgba(79, 70, 229, .09), transparent 30%),
            var(--bg);
          color: #f8fafc;
        }

        .aw-container {
          width: min(1240px, calc(100% - 42px));
          margin: 0 auto;
        }

        .aw-hero {
          position: relative;
          min-height: 820px;
          display: flex;
          align-items: center;
          padding: 100px 0 80px;
        }

        .aw-grid {
          position: absolute;
          inset: 0;
          opacity: .18;
          background-image:
            linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black 15%, transparent 90%);
          pointer-events: none;
        }

        .aw-glow {
          position: absolute;
          width: 620px;
          height: 620px;
          border-radius: 999px;
          filter: blur(145px);
          background: #6d4aff;
          opacity: .13;
          right: -170px;
          top: -180px;
          pointer-events: none;
        }

        .aw-hero-layout {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          align-items: center;
          gap: 70px;
        }

        .aw-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          border-radius: 999px;
          border: 1px solid rgba(56,189,248,.30);
          background: rgba(14,165,233,.08);
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .14em;
        }

        .aw-dot {
          width: 6px;
          height: 6px;
          border-radius: 99px;
          background: #38bdf8;
          box-shadow: 0 0 18px #38bdf8;
        }

        .aw-title {
          max-width: 730px;
          margin: 24px 0 24px;
          font-size: clamp(50px, 6.3vw, 88px);
          line-height: .97;
          letter-spacing: -.055em;
          font-weight: 650;
        }

        .aw-gradient {
          display: block;
          background: linear-gradient(90deg, #38bdf8 0%, #818cf8 48%, #c084fc 100%);
          -webkit-background-clip: text;
          color: transparent;
        }

        .aw-lead {
          max-width: 670px;
          font-size: 19px;
          line-height: 1.75;
          color: #a6b2c4;
        }

        .aw-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 31px;
        }

        .aw-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 54px;
          padding: 0 23px;
          border-radius: 13px;
          background: linear-gradient(90deg, #0ea5e9, #6366f1 55%, #9333ea);
          color: white;
          text-decoration: none;
          font-weight: 900;
          box-shadow: 0 16px 50px rgba(79,70,229,.28);
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .aw-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 21px 70px rgba(79,70,229,.38);
        }

        .aw-secondary {
          display: inline-flex;
          align-items: center;
          min-height: 54px;
          padding: 0 20px;
          border-radius: 13px;
          border: 1px solid #253752;
          background: rgba(8,17,35,.8);
          color: #d8e2ef;
          text-decoration: none;
          font-weight: 800;
        }

        .aw-small-proof {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          margin-top: 34px;
          color: #8090a7;
          font-size: 12px;
          font-weight: 700;
        }

        .aw-small-proof span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .aw-small-proof b { color: var(--green); }

        .aw-browser-wrap {
          position: relative;
          perspective: 1000px;
        }

        .aw-browser {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          background: #071226;
          border: 1px solid rgba(110,145,205,.27);
          box-shadow:
            0 60px 130px rgba(0,0,0,.48),
            0 0 90px rgba(82,69,255,.16);
          transform: rotateY(-4deg) rotateX(2deg);
        }

        .aw-browser-top {
          height: 45px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 16px;
          border-bottom: 1px solid #17243b;
          background: #091326;
        }

        .aw-browser-top i {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #334155;
        }

        .aw-browser-url {
          margin-left: 9px;
          height: 24px;
          flex: 1;
          border-radius: 7px;
          background: #0d1a30;
          color: #64748b;
          display: flex;
          align-items: center;
          padding-left: 12px;
          font-size: 9px;
        }

        .aw-demo {
          min-height: 465px;
          padding: 46px 36px;
          background:
            radial-gradient(circle at 70% 25%, rgba(124,58,237,.35), transparent 36%),
            linear-gradient(145deg,#071528,#090a21 60%,#170b38);
        }

        .aw-demo-badge {
          font-size: 9px;
          color: #67e8f9;
          font-weight: 900;
          letter-spacing: .16em;
        }

        .aw-demo h3 {
          margin: 14px 0;
          max-width: 430px;
          font-size: 39px;
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .aw-demo p {
          max-width: 440px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.65;
        }

        .aw-demo-button {
          display: inline-block;
          margin-top: 18px;
          padding: 11px 17px;
          border-radius: 9px;
          background: linear-gradient(90deg,#0ea5e9,#7c3aed);
          font-size: 10px;
          font-weight: 900;
        }

        .aw-demo-stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 10px;
          margin-top: 42px;
        }

        .aw-demo-stat {
          padding: 14px;
          border: 1px solid rgba(148,163,184,.13);
          border-radius: 12px;
          background: rgba(4,11,25,.58);
        }

        .aw-demo-stat small {
          display: block;
          color: #64748b;
          font-size: 7px;
          letter-spacing: .1em;
        }

        .aw-demo-stat strong {
          display: block;
          margin-top: 5px;
          font-size: 16px;
        }

        .aw-float {
          position: absolute;
          z-index: 5;
          padding: 12px 14px;
          border-radius: 13px;
          border: 1px solid rgba(148,163,184,.16);
          backdrop-filter: blur(15px);
          background: rgba(7,15,32,.85);
          box-shadow: 0 20px 50px rgba(0,0,0,.32);
          animation: awFloat 4.8s ease-in-out infinite;
        }

        .aw-float strong {
          display: block;
          font-size: 11px;
        }

        .aw-float small {
          display: block;
          margin-top: 3px;
          font-size: 8px;
          color: #76869e;
        }

        .aw-float.one {
          top: 80px;
          right: -35px;
        }

        .aw-float.two {
          left: -38px;
          bottom: 65px;
          animation-delay: 1.2s;
        }

        .aw-float.three {
          right: 45px;
          bottom: -26px;
          animation-delay: 2s;
        }

        @keyframes awFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .aw-strip {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(5,13,28,.65);
        }

        .aw-strip-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
        }

        .aw-strip-item {
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid var(--line);
        }

        .aw-strip-item:last-child { border-right: 0; }

        .aw-strip-item strong {
          display: block;
          font-size: 17px;
        }

        .aw-strip-item span {
          display: block;
          margin-top: 7px;
          color: #72839b;
          font-size: 11px;
        }

        .aw-section {
          position: relative;
          padding: 105px 0;
        }

        .aw-section-center { text-align: center; }

        .aw-eyebrow {
          color: #61d4ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .16em;
        }

        .aw-h2 {
          max-width: 950px;
          margin: 13px auto;
          font-size: clamp(37px, 5vw, 61px);
          line-height: 1.04;
          letter-spacing: -.05em;
          font-weight: 580;
        }

        .aw-section-lead {
          max-width: 740px;
          margin: 18px auto 0;
          color: #91a0b5;
          font-size: 17px;
          line-height: 1.72;
        }

        .aw-benefits {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 14px;
          margin-top: 48px;
        }

        .aw-benefit {
          position: relative;
          min-height: 220px;
          padding: 29px;
          border: 1px solid var(--line);
          border-radius: 21px;
          background:
            linear-gradient(145deg,rgba(10,22,43,.82),rgba(5,12,26,.84));
          transition: transform .2s ease, border-color .2s ease;
        }

        .aw-benefit:hover {
          transform: translateY(-4px);
          border-color: rgba(56,189,248,.32);
        }

        .aw-benefit-icon {
          width: 41px;
          height: 41px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          border: 1px solid rgba(56,189,248,.19);
          background: rgba(14,165,233,.07);
          color: #67e8f9;
          font-size: 18px;
        }

        .aw-benefit h3 {
          margin: 22px 0 10px;
          font-size: 21px;
        }

        .aw-benefit p {
          margin: 0;
          color: #8797ad;
          line-height: 1.7;
          font-size: 14px;
        }

        .aw-transform {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 48px;
        }

        .aw-transform-card {
          min-height: 390px;
          padding: 36px;
          border-radius: 26px;
          border: 1px solid var(--line);
          background: rgba(7,15,31,.82);
        }

        .aw-transform-card.good {
          background:
            radial-gradient(circle at 85% 10%,rgba(52,211,153,.13),transparent 30%),
            linear-gradient(145deg,rgba(8,24,35,.95),rgba(7,14,32,.95));
          border-color: rgba(52,211,153,.26);
        }

        .aw-transform-card h3 {
          font-size: 31px;
          margin: 15px 0 25px;
          letter-spacing: -.035em;
        }

        .aw-transform-list {
          display: grid;
          gap: 15px;
        }

        .aw-transform-line {
          display: flex;
          gap: 12px;
          color: #9aabc0;
          font-size: 14px;
        }

        .aw-transform-card.good .aw-transform-line {
          color: #d3e8df;
        }

        .aw-x { color: #f87171; }
        .aw-ok { color: var(--green); }

        .aw-packages {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 18px;
          margin-top: 54px;
          align-items: stretch;
        }

        .aw-package {
          position: relative;
          padding: 33px;
          border-radius: 25px;
          border: 1px solid var(--line);
          background: rgba(6,14,29,.86);
        }

        .aw-package.featured {
          background:
            radial-gradient(circle at 80% 15%,rgba(72,109,255,.20),transparent 35%),
            linear-gradient(155deg,rgba(11,31,56,.98),rgba(17,13,52,.97));
          border-color: rgba(77,176,255,.55);
          box-shadow: 0 30px 90px rgba(59,64,220,.17);
          transform: translateY(-13px);
        }

        .aw-popular {
          position: absolute;
          right: 17px;
          top: 17px;
          padding: 6px 10px;
          border-radius: 999px;
          background: linear-gradient(90deg,#168cff,#6d4aff);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .aw-package-kicker {
          color: #69d8ff;
          font-size: 9px;
          letter-spacing: .14em;
          font-weight: 950;
        }

        .aw-package h3 {
          font-size: 28px;
          margin: 15px 0 8px;
        }

        .aw-price {
          margin-top: 17px;
          font-size: 46px;
          line-height: 1;
          letter-spacing: -.05em;
          font-weight: 900;
        }

        .aw-price small {
          color: #66778e;
          font-size: 11px;
          font-weight: 700;
        }

        .aw-package-intro {
          min-height: 100px;
          margin-top: 23px;
          color: #91a1b6;
          font-size: 14px;
          line-height: 1.7;
        }

        .aw-feature-list {
          display: grid;
          gap: 13px;
          padding-top: 24px;
          margin-top: 22px;
          border-top: 1px solid var(--line);
        }

        .aw-feature {
          display: flex;
          gap: 10px;
          color: #d0dceb;
          font-size: 12px;
        }

        .aw-package-button {
          display: block;
          margin-top: 28px;
          padding: 15px;
          text-align: center;
          text-decoration: none;
          border-radius: 11px;
          border: 1px solid #2b3c59;
          background: #13213a;
          color: white;
          font-size: 13px;
          font-weight: 900;
          transition: transform .18s ease;
        }

        .aw-package-button:hover { transform: translateY(-2px); }

        .featured .aw-package-button {
          background: linear-gradient(90deg,#0ea5e9,#7c3aed);
          border-color: transparent;
        }

        .aw-seo-layout {
          display: grid;
          grid-template-columns: .85fr 1.15fr;
          gap: 65px;
          align-items: center;
        }

        .aw-seo-copy .aw-h2 {
          margin-left: 0;
        }

        .aw-seo-copy .aw-section-lead {
          margin-left: 0;
        }

        .aw-google {
          padding: 31px;
          border-radius: 25px;
          border: 1px solid var(--line);
          background:
            radial-gradient(circle at 90% 10%,rgba(14,165,233,.10),transparent 30%),
            #071225;
          box-shadow: 0 30px 100px rgba(0,0,0,.32);
        }

        .aw-search {
          height: 49px;
          border: 1px solid #263650;
          border-radius: 24px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          color: #94a3b8;
          font-size: 12px;
          background: #0b182d;
        }

        .aw-google-result {
          margin-top: 27px;
          padding: 20px 0;
          border-bottom: 1px solid #16243a;
        }

        .aw-google-result small {
          color: #8797ac;
          font-size: 9px;
        }

        .aw-google-result h4 {
          color: #74b9ff;
          margin: 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .aw-google-result p {
          margin: 0;
          color: #8293a9;
          font-size: 11px;
          line-height: 1.55;
        }

        .aw-keywords {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .aw-keywords span {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(14,165,233,.08);
          border: 1px solid rgba(56,189,248,.16);
          color: #7dd3fc;
          font-size: 9px;
        }

        .aw-steps {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
          margin-top: 48px;
        }

        .aw-step {
          padding: 28px;
          min-height: 235px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: rgba(7,15,30,.78);
        }

        .aw-step-no {
          color: #818cf8;
          font-size: 11px;
          font-weight: 950;
        }

        .aw-step h3 {
          margin: 23px 0 10px;
          font-size: 21px;
        }

        .aw-step p {
          margin: 0;
          color: #8999ad;
          font-size: 13px;
          line-height: 1.7;
        }

        .aw-final {
          margin: 35px 0 90px;
          padding: 75px 35px;
          border-radius: 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% -15%,rgba(40,176,255,.18),transparent 40%),
            radial-gradient(circle at 90% 100%,rgba(124,58,237,.22),transparent 34%),
            linear-gradient(135deg,#07152a,#11113d);
          border: 1px solid rgba(79,165,255,.31);
        }

        .aw-final::after {
          content:"";
          position:absolute;
          width:400px;height:400px;border-radius:50%;
          background:#673cff;filter:blur(160px);opacity:.12;
          left:50%;top:50%;transform:translate(-50%,-50%);
        }

        .aw-final-content {
          position: relative;
          z-index: 2;
        }

        .aw-final h2 {
          max-width: 900px;
          margin: 15px auto;
          font-size: clamp(40px,5.5vw,68px);
          line-height: 1.02;
          letter-spacing: -.05em;
          font-weight: 570;
        }

        .aw-final p {
          max-width: 710px;
          margin: 18px auto;
          color: #a0aec0;
          font-size: 17px;
          line-height: 1.7;
        }

        .aw-email {
          display: block;
          margin: 30px auto 24px;
          color: #67d7ff;
          text-decoration: none;
          font-size: clamp(24px,3vw,35px);
          font-weight: 900;
        }

        .aw-mail-only {
          margin-top: 18px;
          color: #60718a;
          font-size: 10px;
          letter-spacing: .08em;
        }

        .aw-footer {
          border-top: 1px solid var(--line);
          padding: 35px 0 45px;
          text-align: center;
          color: #607087;
          font-size: 11px;
        }

        @media(max-width: 1000px) {
          .aw-hero-layout,
          .aw-seo-layout {
            grid-template-columns: 1fr;
          }

          .aw-browser-wrap {
            max-width: 720px;
            margin: 20px auto 0;
          }

          .aw-benefits,
          .aw-packages {
            grid-template-columns: repeat(2,1fr);
          }

          .aw-steps { grid-template-columns: repeat(2,1fr); }

          .aw-package.featured { transform: none; }
        }

        @media(max-width: 700px) {
          .aw-container {
            width: min(100% - 26px, 1240px);
          }

          .aw-hero {
            min-height: auto;
            padding: 75px 0 65px;
          }

          .aw-title { font-size: 51px; }

          .aw-benefits,
          .aw-packages,
          .aw-transform,
          .aw-steps,
          .aw-strip-grid {
            grid-template-columns: 1fr;
          }

          .aw-strip-item {
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .aw-browser {
            transform: none;
          }

          .aw-float {
            display: none;
          }

          .aw-demo {
            min-height: 400px;
            padding: 30px 22px;
          }

          .aw-demo h3 {
            font-size: 31px;
          }

          .aw-section {
            padding: 75px 0;
          }

          .aw-final {
            padding: 55px 22px;
          }
        }
      `}</style>

      <section className="aw-hero">
        <div className="aw-grid" />
        <div className="aw-glow" />

        <div className="aw-container aw-hero-layout">
          <div>
            <div className="aw-label">
              <span className="aw-dot" />
              AUFTRAGO WEB · WEBSEITEN & SEO
            </div>

            <h1 className="aw-title">
              Deine Webseite ist dein
              <span className="aw-gradient">digitaler Verkäufer.</span>
            </h1>

            <p className="aw-lead">
              Wir entwickeln hochwertige Webseiten für Schweizer Unternehmen,
              die nicht einfach nur schön aussehen – sondern Vertrauen schaffen,
              Leistungen verkaufen und neue Kundenanfragen unterstützen.
            </p>

            <div className="aw-hero-actions">
              <a className="aw-primary" href={mail}>
                Projekt per E-Mail anfragen →
              </a>

              <a className="aw-secondary" href="#pakete">
                Pakete ansehen
              </a>
            </div>

            <div className="aw-small-proof">
              <span><b>✓</b> Schweizer Unternehmen</span>
              <span><b>✓</b> Premium Design</span>
              <span><b>✓</b> SEO optional</span>
              <span><b>✓</b> Mobile optimiert</span>
            </div>
          </div>

          <div className="aw-browser-wrap">
            <div className="aw-browser">
              <div className="aw-browser-top">
                <i/><i/><i/>
                <div className="aw-browser-url">
                  www.dein-unternehmen.ch
                </div>
              </div>

              <div className="aw-demo">
                <div className="aw-demo-badge">
                  PREMIUM SERVICE · SCHWEIZ
                </div>

                <h3>
                  Qualität, auf die sich deine Kunden verlassen können.
                </h3>

                <p>
                  Professionelle Leistungen. Persönliche Betreuung.
                  Klare Lösungen für anspruchsvolle Kunden.
                </p>

                <div className="aw-demo-button">
                  Jetzt unverbindlich anfragen →
                </div>

                <div className="aw-demo-stats">
                  <div className="aw-demo-stat">
                    <small>VERTRAUEN</small>
                    <strong>Premium</strong>
                  </div>
                  <div className="aw-demo-stat">
                    <small>PERFORMANCE</small>
                    <strong>Schnell</strong>
                  </div>
                  <div className="aw-demo-stat">
                    <small>SEO</small>
                    <strong>Ready</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="aw-float one">
              <strong style={{color:"#52f3a5"}}>✓ SEO READY</strong>
              <small>Technisch vorbereitet</small>
            </div>

            <div className="aw-float two">
              <strong>📱 MOBILE FIRST</strong>
              <small>Optimiert für jedes Gerät</small>
            </div>

            <div className="aw-float three">
              <strong style={{color:"#7dd3fc"}}>↗ MEHR ANFRAGEN</strong>
              <small>Conversion im Fokus</small>
            </div>
          </div>
        </div>
      </section>

      <section className="aw-strip">
        <div className="aw-container aw-strip-grid">
          <div className="aw-strip-item">
            <strong>Premium Webdesign</strong>
            <span>Individuell statt Baukasten</span>
          </div>

          <div className="aw-strip-item">
            <strong>100 % Responsive</strong>
            <span>Smartphone bis Desktop</span>
          </div>

          <div className="aw-strip-item">
            <strong>Verkaufsorientiert</strong>
            <span>Mehr als nur eine Visitenkarte</span>
          </div>

          <div className="aw-strip-item">
            <strong>SEO verfügbar</strong>
            <span>Für langfristige Sichtbarkeit</span>
          </div>
        </div>
      </section>

      <section className="aw-section">
        <div className="aw-container">
          <div className="aw-section-center">
            <div className="aw-eyebrow">
              DEINE WEBSEITE ARBEITET 24/7
            </div>

            <h2 className="aw-h2">
              Der erste Eindruck entscheidet, bevor du überhaupt mit dem Kunden sprichst.
            </h2>

            <p className="aw-section-lead">
              Deine Webseite muss in wenigen Sekunden Vertrauen schaffen,
              Professionalität ausstrahlen und zeigen, warum der Kunde genau
              dein Unternehmen kontaktieren sollte.
            </p>
          </div>

          <div className="aw-benefits">
            {benefits.map((item) => (
              <article className="aw-benefit" key={item.title}>
                <div className="aw-benefit-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="aw-section">
        <div className="aw-container">
          <div className="aw-section-center">
            <div className="aw-eyebrow">DER UNTERSCHIED</div>
            <h2 className="aw-h2">
              Eine Webseite kann Kosten verursachen. Oder Kunden gewinnen.
            </h2>
          </div>

          <div className="aw-transform">
            <div className="aw-transform-card">
              <div className="aw-eyebrow" style={{color:"#f87171"}}>
                NORMALE WEBSEITE
              </div>

              <h3>Eine digitale Visitenkarte.</h3>

              <div className="aw-transform-list">
                {[
                  "Austauschbares Standarddesign",
                  "Unklare Nutzerführung",
                  "Wenig Verkaufspsychologie",
                  "Keine klare lokale Struktur",
                  "SEO erst später bedacht",
                  "Kaum strategische Landingpages",
                ].map((x) => (
                  <div className="aw-transform-line" key={x}>
                    <span className="aw-x">×</span>
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="aw-transform-card good">
              <div className="aw-eyebrow" style={{color:"#52f3a5"}}>
                AUFTRAGO WEB
              </div>

              <h3>Ein digitaler Vertriebskanal.</h3>

              <div className="aw-transform-list">
                {[
                  "Individuelles Premium-Design",
                  "Klare Verkaufs- und Nutzerführung",
                  "Professionelle Call-to-Actions",
                  "Regionale Seitenstruktur möglich",
                  "SEO von Anfang an mitgedacht",
                  "Auf Wachstum skalierbar",
                ].map((x) => (
                  <div className="aw-transform-line" key={x}>
                    <span className="aw-ok">✓</span>
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="aw-section" id="pakete">
        <div className="aw-container">
          <div className="aw-section-center">
            <div className="aw-eyebrow">
              KLARE PAKETE · KLARE PREISE
            </div>

            <h2 className="aw-h2">
              Wie stark soll dein Unternehmen online auftreten?
            </h2>

            <p className="aw-section-lead">
              Drei Lösungen für unterschiedliche Ziele – vom hochwertigen
              Firmenauftritt bis zur umfangreichen SEO-Struktur.
            </p>
          </div>

          <div className="aw-packages">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`aw-package ${pkg.featured ? "featured" : ""}`}
              >
                {pkg.featured && (
                  <div className="aw-popular">BELIEBT</div>
                )}

                <div className="aw-package-kicker">{pkg.kicker}</div>

                <h3>{pkg.name}</h3>

                <div className="aw-price">
                  CHF {pkg.price}.–
                  <small> einmalig</small>
                </div>

                <p className="aw-package-intro">{pkg.intro}</p>

                <div className="aw-feature-list">
                  {pkg.features.map((feature) => (
                    <div className="aw-feature" key={feature}>
                      <span className="aw-ok">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  className="aw-package-button"
                  href={`mailto:info@auftrago.ch?subject=${encodeURIComponent(
                    `Anfrage Auftrago Web – ${pkg.name}`
                  )}&body=${encodeURIComponent(
                    `Guten Tag\n\nIch interessiere mich für das Auftrago Web Paket ${pkg.name} für CHF ${pkg.price}.–.\n\nBitte kontaktieren Sie mich für eine unverbindliche Beratung.\n\nFirma:\nName:\nTelefon:\nWebseite (falls vorhanden):\n\nFreundliche Grüsse`
                  )}`}
                >
                  {pkg.name} per E-Mail anfragen →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="aw-section">
        <div className="aw-container aw-seo-layout">
          <div className="aw-seo-copy">
            <div className="aw-eyebrow">
              AUFTRAGO SEO
            </div>

            <h2 className="aw-h2">
              Google kann dein nächster Vertriebskanal werden.
            </h2>

            <p className="aw-section-lead">
              Kunden suchen jeden Tag nach Reinigung, Hauswartung, Umzug,
              Handwerk und vielen weiteren Dienstleistungen. Mit einer
              durchdachten SEO-Struktur schaffen wir die Voraussetzungen,
              damit dein Unternehmen bei relevanten Suchanfragen sichtbar
              werden kann.
            </p>

            <div className="aw-hero-actions">
              <a
                className="aw-primary"
                href="mailto:info@auftrago.ch?subject=SEO%20Beratung"
              >
                SEO-Beratung per E-Mail →
              </a>
            </div>
          </div>

          <div className="aw-google">
            <div className="aw-search">
              🔎 Reinigungsfirma Zürich
            </div>

            <div className="aw-google-result">
              <small>www.dein-unternehmen.ch/reinigung-zuerich</small>
              <h4>Professionelle Reinigung Zürich | Dein Unternehmen</h4>
              <p>
                Zuverlässige Reinigung für Privat- und Geschäftskunden.
                Jetzt unverbindlich anfragen und persönlichen Termin erhalten.
              </p>
            </div>

            <div className="aw-google-result">
              <small>www.dein-unternehmen.ch/umzugsreinigung-zuerich</small>
              <h4>Umzugsreinigung Zürich mit Abgabegarantie</h4>
              <p>
                Professionelle Endreinigung mit klarer Leistung und direkter Anfrage.
              </p>
            </div>

            <div className="aw-keywords">
              <span>Local SEO</span>
              <span>Landingpages</span>
              <span>Keywords</span>
              <span>Regionen</span>
              <span>Technische SEO</span>
              <span>Search Console</span>
            </div>
          </div>
        </div>
      </section>

      <section className="aw-section">
        <div className="aw-container">
          <div className="aw-section-center">
            <div className="aw-eyebrow">
              SO ENTSTEHT DEINE NEUE WEBSEITE
            </div>

            <h2 className="aw-h2">
              Von der ersten Idee bis zum Go Live.
            </h2>
          </div>

          <div className="aw-steps">
            {steps.map((step) => (
              <article className="aw-step" key={step.no}>
                <div className="aw-step-no">{step.no}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="aw-container">
        <section className="aw-final">
          <div className="aw-final-content">
            <div className="aw-eyebrow">
              BEREIT FÜR EINEN STÄRKEREN AUFTRITT?
            </div>

            <h2>
              Deine Konkurrenz ist online.
              Die Frage ist nur, wer besser aussieht.
            </h2>

            <p>
              Schreib uns kurz, was dein Unternehmen macht und welches Ziel
              du mit deiner neuen Webseite erreichen möchtest. Wir melden uns
              persönlich bei dir.
            </p>

            <a
              className="aw-email"
              href="mailto:info@auftrago.ch?subject=Neue%20Webseite%20anfragen"
            >
              info@auftrago.ch
            </a>

            <a
              className="aw-primary"
              href="mailto:info@auftrago.ch?subject=Neue%20Webseite%20anfragen"
            >
              Projekt jetzt per E-Mail anfragen →
            </a>

            <div className="aw-mail-only">
              UNVERBINDLICHE ANFRAGE · DIREKTER KONTAKT · KEINE ONLINE-ZAHLUNG
            </div>
          </div>
        </section>
      </div>

      <footer className="aw-footer">
        <div className="aw-container">
          © 2026 Auftrago Web · Webseiten & SEO für Schweizer Unternehmen
        </div>
      </footer>
    </main>
  );
}
