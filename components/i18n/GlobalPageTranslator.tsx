"use client";

import { useEffect } from "react";

type Locale =
  | "de"
  | "fr"
  | "it"
  | "en"
  | "sq"
  | "tr"
  | "pt"
  | "es";

const LOCALES: Locale[] = [
  "de",
  "fr",
  "it",
  "en",
  "sq",
  "tr",
  "pt",
  "es",
];

const COOKIE_KEY = "auftrag_locale";
const STORAGE_KEY = "auftrago-language";

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}

function readCookie(): Locale | null {
  const match = document.cookie.match(
    /(?:^|;\s*)auftrag_locale=(de|fr|it|en|sq|tr|pt|es)(?:;|$)/
  );

  return isLocale(match?.[1]) ? match[1] : null;
}

function getLocale(): Locale {
  const pathLocale = window.location.pathname
    .split("/")
    .filter(Boolean)[0];

  if (isLocale(pathLocale)) {
    return pathLocale;
  }

  const cookieLocale = readCookie();

  if (cookieLocale) {
    return cookieLocale;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (isLocale(stored)) {
    return stored;
  }

  return "de";
}

/*
 * Globale Browser-Fallbacks.
 *
 * Dein bestehendes serverseitiges i18n bleibt bestehen.
 * Diese Tabelle fängt Texte ab, die noch hart im JSX stehen.
 */
const translations: Record<
  Locale,
  Record<string, string>
> = {
  de: {},

  en: {
    "Vorteile": "Benefits",
    "So funktioniert es": "How it works",
    "Einloggen": "Log in",
    "Kostenlos starten": "Start for free",
    "Datenschutz": "Privacy",
    "Impressum": "Legal notice",
    "Häufige Fragen": "Frequently asked questions",
    "Dienstleistungen": "Services",
    "Anbieter": "Providers",
    "Regionen": "Regions",
    "Versicherungen": "Insurance",
    "Für Anbieter": "For providers",
    "Suche": "Search",
    "Auftrag starten": "Start request",
    "Anbieter ansehen": "View providers",
    "Anfrage starten": "Start request",
    "Kostenlose Offerte anfragen": "Request a free quote",
    "Regionale Offerten": "Regional quotes",
    "Offerten vergleichen.": "Compare quotes.",
    "Kostenlos": "Free",
    "Unverbindlich": "No obligation",
    "Regionale Firmen": "Regional companies",
    "Schnelle Rückmeldungen": "Fast responses",
    "In 3 Schritten zur Offerte": "Get a quote in 3 steps",
    "1. Anfrage senden": "1. Send request",
    "2. Anbieter erhalten": "2. Receive providers",
    "3. Offerten vergleichen": "3. Compare quotes",
    "Weitere Orte": "More locations",
    "Ähnliche Services": "Similar services",
    "Weitere beliebte Kombinationen": "More popular combinations",
    "Beliebt": "Popular",
    "Termin auswählen": "Choose appointment",
    "Wunschdatum": "Preferred date",
    "Uhrzeit": "Time",
    "Ihre unverbindliche Preisindikation":
      "Your non-binding price estimate",
    "ÜBERSICHT": "SUMMARY",
    "Dienstleistung": "Service",
    "Kunde": "Customer",
    "Ort": "Location",
    "Termin": "Appointment",
    "Noch offen": "Not specified",
    "Noch nicht gewählt": "Not selected",
    "UNVERBINDLICHE PREISINDIKATION":
      "NON-BINDING PRICE ESTIMATE",
    "Definitive Offerte anfragen":
      "Request final quote",
    "Keine Zahlung erforderlich":
      "No payment required",
    "Keine automatische Buchung":
      "No automatic booking",
    "Persönliche Prüfung":
      "Personal review",
    "Definitiver Preis vor Auftrag":
      "Final price before the job",
    "Jetzt definitive Offerte anfragen":
      "Request final quote now",
    "100% Abgabegarantie":
      "100% handover guarantee",
    "Geprüfte Anbieter":
      "Verified providers",
    "Schnelle Terminvergabe":
      "Fast scheduling",
    "Sichere Zahlung":
      "Secure payment",
  },

  fr: {
    "Vorteile": "Avantages",
    "So funktioniert es": "Comment ça marche",
    "Einloggen": "Se connecter",
    "Kostenlos starten": "Commencer gratuitement",
    "Datenschutz": "Confidentialité",
    "Impressum": "Mentions légales",
    "Häufige Fragen": "Questions fréquentes",
    "Dienstleistungen": "Services",
    "Anbieter": "Prestataires",
    "Regionen": "Régions",
    "Versicherungen": "Assurances",
    "Für Anbieter": "Pour les prestataires",
    "Suche": "Recherche",
    "Auftrag starten": "Créer une demande",
    "Anbieter ansehen": "Voir les prestataires",
    "Anfrage starten": "Créer une demande",
    "Kostenlose Offerte anfragen": "Demander une offre gratuite",
    "Regionale Offerten": "Offres régionales",
    "Offerten vergleichen.": "Comparer les offres.",
    "Kostenlos": "Gratuit",
    "Unverbindlich": "Sans engagement",
    "Regionale Firmen": "Entreprises régionales",
    "Schnelle Rückmeldungen": "Réponses rapides",
    "In 3 Schritten zur Offerte": "Une offre en 3 étapes",
    "1. Anfrage senden": "1. Envoyer une demande",
    "2. Anbieter erhalten": "2. Recevoir des prestataires",
    "3. Offerten vergleichen": "3. Comparer les offres",
    "Weitere Orte": "Autres localités",
    "Ähnliche Services": "Services similaires",
    "Weitere beliebte Kombinationen":
      "Autres combinaisons populaires",
    "Beliebt": "Populaire",
    "Termin auswählen": "Choisir une date",
    "Wunschdatum": "Date souhaitée",
    "Uhrzeit": "Heure",
    "Ihre unverbindliche Preisindikation":
      "Votre estimation de prix sans engagement",
    "ÜBERSICHT": "APERÇU",
    "Dienstleistung": "Service",
    "Kunde": "Client",
    "Ort": "Lieu",
    "Termin": "Date",
    "Noch offen": "Pas encore indiqué",
    "Noch nicht gewählt": "Pas encore choisi",
    "UNVERBINDLICHE PREISINDIKATION":
      "ESTIMATION DE PRIX SANS ENGAGEMENT",
    "Definitive Offerte anfragen":
      "Demander une offre définitive",
    "Keine Zahlung erforderlich":
      "Aucun paiement requis",
    "Keine automatische Buchung":
      "Aucune réservation automatique",
    "Persönliche Prüfung":
      "Vérification personnelle",
    "Definitiver Preis vor Auftrag":
      "Prix définitif avant le mandat",
    "Jetzt definitive Offerte anfragen":
      "Demander maintenant l'offre définitive",
    "100% Abgabegarantie":
      "Garantie de remise à 100 %",
    "Geprüfte Anbieter":
      "Prestataires vérifiés",
    "Schnelle Terminvergabe":
      "Prise de rendez-vous rapide",
    "Sichere Zahlung":
      "Paiement sécurisé",
  },

  it: {
    "Vorteile": "Vantaggi",
    "So funktioniert es": "Come funziona",
    "Einloggen": "Accedi",
    "Kostenlos starten": "Inizia gratuitamente",
    "Datenschutz": "Protezione dati",
    "Impressum": "Note legali",
    "Häufige Fragen": "Domande frequenti",
    "Dienstleistungen": "Servizi",
    "Anbieter": "Fornitori",
    "Regionen": "Regioni",
    "Versicherungen": "Assicurazioni",
    "Für Anbieter": "Per i fornitori",
    "Suche": "Cerca",
    "Auftrag starten": "Avvia richiesta",
    "Anbieter ansehen": "Visualizza fornitori",
    "Anfrage starten": "Avvia richiesta",
    "Kostenlose Offerte anfragen":
      "Richiedi un preventivo gratuito",
    "Regionale Offerten": "Preventivi regionali",
    "Offerten vergleichen.": "Confronta i preventivi.",
    "Kostenlos": "Gratuito",
    "Unverbindlich": "Senza impegno",
    "Regionale Firmen": "Aziende regionali",
    "Schnelle Rückmeldungen": "Risposte rapide",
    "In 3 Schritten zur Offerte":
      "Preventivo in 3 passaggi",
    "1. Anfrage senden": "1. Invia richiesta",
    "2. Anbieter erhalten": "2. Ricevi fornitori",
    "3. Offerten vergleichen": "3. Confronta preventivi",
    "Weitere Orte": "Altre località",
    "Ähnliche Services": "Servizi simili",
    "Weitere beliebte Kombinationen":
      "Altre combinazioni popolari",
    "Beliebt": "Popolare",
    "Termin auswählen": "Scegli la data",
    "Wunschdatum": "Data desiderata",
    "Uhrzeit": "Ora",
    "Ihre unverbindliche Preisindikation":
      "La tua stima di prezzo non vincolante",
    "ÜBERSICHT": "PANORAMICA",
    "Dienstleistung": "Servizio",
    "Kunde": "Cliente",
    "Ort": "Località",
    "Termin": "Data",
    "Noch offen": "Non ancora indicato",
    "Noch nicht gewählt": "Non ancora selezionato",
    "UNVERBINDLICHE PREISINDIKATION":
      "STIMA DI PREZZO NON VINCOLANTE",
    "Definitive Offerte anfragen":
      "Richiedi preventivo definitivo",
    "Keine Zahlung erforderlich":
      "Nessun pagamento richiesto",
    "Keine automatische Buchung":
      "Nessuna prenotazione automatica",
    "Persönliche Prüfung":
      "Verifica personale",
    "Definitiver Preis vor Auftrag":
      "Prezzo definitivo prima dell'incarico",
    "Jetzt definitive Offerte anfragen":
      "Richiedi ora il preventivo definitivo",
    "100% Abgabegarantie":
      "Garanzia di consegna al 100%",
    "Geprüfte Anbieter":
      "Fornitori verificati",
    "Schnelle Terminvergabe":
      "Appuntamento rapido",
    "Sichere Zahlung":
      "Pagamento sicuro",
  },

  sq: {
    "Vorteile": "Përfitimet",
    "So funktioniert es": "Si funksionon",
    "Einloggen": "Hyr",
    "Kostenlos starten": "Fillo falas",
    "Datenschutz": "Privatësia",
    "Impressum": "Të dhënat ligjore",
    "Häufige Fragen": "Pyetje të shpeshta",
    "Dienstleistungen": "Shërbime",
    "Anbieter": "Ofrues",
    "Regionen": "Rajone",
    "Versicherungen": "Sigurime",
    "Für Anbieter": "Për ofruesit",
    "Suche": "Kërko",
    "Auftrag starten": "Fillo kërkesën",
    "Anbieter ansehen": "Shiko ofruesit",
    "Anfrage starten": "Fillo kërkesën",
    "Kostenlose Offerte anfragen": "Kërko ofertë falas",
    "Regionale Offerten": "Oferta rajonale",
    "Offerten vergleichen.": "Krahaso ofertat.",
    "Kostenlos": "Falas",
    "Unverbindlich": "Pa detyrim",
    "Regionale Firmen": "Kompani rajonale",
    "Schnelle Rückmeldungen": "Përgjigje të shpejta",
    "In 3 Schritten zur Offerte": "Oferta në 3 hapa",
    "1. Anfrage senden": "1. Dërgo kërkesën",
    "2. Anbieter erhalten": "2. Merr ofrues",
    "3. Offerten vergleichen": "3. Krahaso ofertat",
    "Weitere Orte": "Vende të tjera",
    "Ähnliche Services": "Shërbime të ngjashme",
    "Weitere beliebte Kombinationen":
      "Kombinime të tjera të njohura",
    "Beliebt": "Popullore",
    "Termin auswählen": "Zgjidh termin",
    "Wunschdatum": "Data e dëshiruar",
    "Uhrzeit": "Ora",
    "ÜBERSICHT": "PËRMBLEDHJE",
    "Dienstleistung": "Shërbimi",
    "Kunde": "Klienti",
    "Ort": "Vendi",
    "Termin": "Termini",
    "Noch offen": "Ende e hapur",
    "Noch nicht gewählt": "Nuk është zgjedhur",
  },

  tr: {
    "Vorteile": "Avantajlar",
    "So funktioniert es": "Nasıl çalışır",
    "Einloggen": "Giriş yap",
    "Kostenlos starten": "Ücretsiz başla",
    "Datenschutz": "Gizlilik",
    "Impressum": "Yasal bildirim",
    "Häufige Fragen": "Sık sorulan sorular",
    "Dienstleistungen": "Hizmetler",
    "Anbieter": "Sağlayıcılar",
    "Regionen": "Bölgeler",
    "Versicherungen": "Sigortalar",
    "Für Anbieter": "Sağlayıcılar için",
    "Suche": "Ara",
    "Auftrag starten": "Talep oluştur",
    "Anbieter ansehen": "Sağlayıcıları görüntüle",
    "Anfrage starten": "Talep başlat",
    "Kostenlose Offerte anfragen": "Ücretsiz teklif iste",
    "Regionale Offerten": "Bölgesel teklifler",
    "Offerten vergleichen.": "Teklifleri karşılaştır.",
    "Kostenlos": "Ücretsiz",
    "Unverbindlich": "Bağlayıcı değil",
    "Regionale Firmen": "Bölgesel firmalar",
    "Schnelle Rückmeldungen": "Hızlı yanıtlar",
    "In 3 Schritten zur Offerte": "3 adımda teklif",
    "1. Anfrage senden": "1. Talep gönder",
    "2. Anbieter erhalten": "2. Sağlayıcıları al",
    "3. Offerten vergleichen": "3. Teklifleri karşılaştır",
    "Weitere Orte": "Diğer yerler",
    "Ähnliche Services": "Benzer hizmetler",
    "Weitere beliebte Kombinationen":
      "Diğer popüler kombinasyonlar",
    "Beliebt": "Popüler",
    "Termin auswählen": "Tarih seç",
    "Wunschdatum": "İstenen tarih",
    "Uhrzeit": "Saat",
    "ÜBERSICHT": "ÖZET",
    "Dienstleistung": "Hizmet",
    "Kunde": "Müşteri",
    "Ort": "Yer",
    "Termin": "Tarih",
    "Noch offen": "Henüz belirtilmedi",
    "Noch nicht gewählt": "Henüz seçilmedi",
  },

  pt: {
    "Vorteile": "Vantagens",
    "So funktioniert es": "Como funciona",
    "Einloggen": "Iniciar sessão",
    "Kostenlos starten": "Começar grátis",
    "Datenschutz": "Privacidade",
    "Impressum": "Informação legal",
    "Häufige Fragen": "Perguntas frequentes",
    "Dienstleistungen": "Serviços",
    "Anbieter": "Prestadores",
    "Regionen": "Regiões",
    "Versicherungen": "Seguros",
    "Für Anbieter": "Para prestadores",
    "Suche": "Pesquisa",
    "Auftrag starten": "Criar pedido",
    "Anbieter ansehen": "Ver prestadores",
    "Anfrage starten": "Iniciar pedido",
    "Kostenlose Offerte anfragen":
      "Pedir orçamento gratuito",
    "Regionale Offerten": "Orçamentos regionais",
    "Offerten vergleichen.": "Comparar orçamentos.",
    "Kostenlos": "Grátis",
    "Unverbindlich": "Sem compromisso",
    "Regionale Firmen": "Empresas regionais",
    "Schnelle Rückmeldungen": "Respostas rápidas",
    "In 3 Schritten zur Offerte":
      "Orçamento em 3 passos",
    "1. Anfrage senden": "1. Enviar pedido",
    "2. Anbieter erhalten": "2. Receber prestadores",
    "3. Offerten vergleichen": "3. Comparar orçamentos",
    "Weitere Orte": "Outras localidades",
    "Ähnliche Services": "Serviços semelhantes",
    "Weitere beliebte Kombinationen":
      "Outras combinações populares",
    "Beliebt": "Popular",
    "Termin auswählen": "Selecionar data",
    "Wunschdatum": "Data pretendida",
    "Uhrzeit": "Hora",
    "ÜBERSICHT": "RESUMO",
    "Dienstleistung": "Serviço",
    "Kunde": "Cliente",
    "Ort": "Local",
    "Termin": "Data",
    "Noch offen": "Ainda em aberto",
    "Noch nicht gewählt": "Ainda não selecionado",
  },

  es: {
    "Vorteile": "Ventajas",
    "So funktioniert es": "Cómo funciona",
    "Einloggen": "Iniciar sesión",
    "Kostenlos starten": "Empezar gratis",
    "Datenschutz": "Privacidad",
    "Impressum": "Aviso legal",
    "Häufige Fragen": "Preguntas frecuentes",
    "Dienstleistungen": "Servicios",
    "Anbieter": "Proveedores",
    "Regionen": "Regiones",
    "Versicherungen": "Seguros",
    "Für Anbieter": "Para proveedores",
    "Suche": "Buscar",
    "Auftrag starten": "Crear solicitud",
    "Anbieter ansehen": "Ver proveedores",
    "Anfrage starten": "Iniciar solicitud",
    "Kostenlose Offerte anfragen":
      "Solicitar presupuesto gratuito",
    "Regionale Offerten": "Presupuestos regionales",
    "Offerten vergleichen.": "Comparar presupuestos.",
    "Kostenlos": "Gratis",
    "Unverbindlich": "Sin compromiso",
    "Regionale Firmen": "Empresas regionales",
    "Schnelle Rückmeldungen": "Respuestas rápidas",
    "In 3 Schritten zur Offerte":
      "Presupuesto en 3 pasos",
    "1. Anfrage senden": "1. Enviar solicitud",
    "2. Anbieter erhalten": "2. Recibir proveedores",
    "3. Offerten vergleichen": "3. Comparar presupuestos",
    "Weitere Orte": "Otras localidades",
    "Ähnliche Services": "Servicios similares",
    "Weitere beliebte Kombinationen":
      "Otras combinaciones populares",
    "Beliebt": "Popular",
    "Termin auswählen": "Seleccionar fecha",
    "Wunschdatum": "Fecha deseada",
    "Uhrzeit": "Hora",
    "ÜBERSICHT": "RESUMEN",
    "Dienstleistung": "Servicio",
    "Kunde": "Cliente",
    "Ort": "Lugar",
    "Termin": "Fecha",
    "Noch offen": "Pendiente",
    "Noch nicht gewählt": "Aún no seleccionado",
  },
};

const originals = new WeakMap<Text, string>();
const attributeOriginals =
  new WeakMap<Element, Map<string, string>>();

function translateValue(
  value: string,
  locale: Locale
): string {
  if (locale === "de") {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return value;
  }

  const translated =
    translations[locale]?.[trimmed];

  if (!translated) {
    return value;
  }

  const prefix =
    value.match(/^\s*/)?.[0] ?? "";

  const suffix =
    value.match(/\s*$/)?.[0] ?? "";

  return `${prefix}${translated}${suffix}`;
}

function translateDocument(locale: Locale) {
  document.documentElement.lang = locale;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const parent = textNode.parentElement;

    if (
      parent &&
      ![
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "CODE",
        "PRE",
      ].includes(parent.tagName)
    ) {
      if (!originals.has(textNode)) {
        originals.set(
          textNode,
          textNode.nodeValue ?? ""
        );
      }

      const original =
        originals.get(textNode) ?? "";

      textNode.nodeValue =
        translateValue(original, locale);
    }

    node = walker.nextNode();
  }

  const attributes = [
    "placeholder",
    "title",
    "aria-label",
    "alt",
  ];

  document
    .querySelectorAll("*")
    .forEach((element) => {
      let stored =
        attributeOriginals.get(element);

      if (!stored) {
        stored = new Map();
        attributeOriginals.set(
          element,
          stored
        );
      }

      for (const attribute of attributes) {
        const current =
          element.getAttribute(attribute);

        if (
          current !== null &&
          !stored.has(attribute)
        ) {
          stored.set(attribute, current);
        }

        const original =
          stored.get(attribute);

        if (original !== undefined) {
          element.setAttribute(
            attribute,
            translateValue(
              original,
              locale
            )
          );
        }
      }
    });
}

export default function GlobalPageTranslator() {
  useEffect(() => {
    let currentLocale = getLocale();
    let scheduled = false;

    const run = () => {
      currentLocale = getLocale();
      translateDocument(currentLocale);
    };

    const schedule = () => {
      if (scheduled) return;

      scheduled = true;

      requestAnimationFrame(() => {
        scheduled = false;
        translateDocument(currentLocale);
      });
    };

    run();

    const observer =
      new MutationObserver(schedule);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const handleLocale = () => {
      currentLocale = getLocale();
      run();
    };

    window.addEventListener(
      "auftrago-language-change",
      handleLocale
    );

    window.addEventListener(
      "auftrago:locale-change",
      handleLocale
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "auftrago-language-change",
        handleLocale
      );

      window.removeEventListener(
        "auftrago:locale-change",
        handleLocale
      );
    };
  }, []);

  return null;
}
