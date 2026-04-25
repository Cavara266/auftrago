"use client";

import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          Auftrago
        </Link>

        <nav className="desktop-nav">
          <Link href="/">Startseite</Link>
          <Link href="/anbieter">Anbieter</Link>
          <Link href="/auftrag-erstellen">Offerte anfragen</Link>
          <Link href="/leistungen">Leistungen</Link>
        </nav>

        <div className="desktop-actions">
          <Link href="/anbieter" className="header-link">
            Anbieter werden
          </Link>
          <Link href="/auftrag-erstellen" className="header-cta">
            Anfrage senden
          </Link>
        </div>

        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Menü öffnen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setOpen(false)}>Startseite</Link>
          <Link href="/anbieter" onClick={() => setOpen(false)}>Anbieter</Link>
          <Link href="/auftrag-erstellen" onClick={() => setOpen(false)}>Offerte anfragen</Link>
          <Link href="/leistungen" onClick={() => setOpen(false)}>Leistungen</Link>
        </div>
      )}
    </header>
  );
}