"use client";

import { useMemo, useState } from "react";

type ServiceKey =
  | "umzugsreinigung"
  | "grundreinigung"
  | "baureinigung"
  | "fensterreinigung"
  | "unterhaltsreinigung"
  | "bueroreinigung"
  | "treppenhausreinigung"
  | "hauswartung"
  | "fassadenreinigung"
  | "teppichreinigung"
  | "gartenpflege"
  | "winterdienst"
  | "umzug"
  | "transport"
  | "moebelmontage"
  | "entsorgung"
  | "raeumung"
  | "malerarbeiten"
  | "bodenleger"
  | "elektriker"
  | "sanitaer";

type PaymentOption = "deposit" | "full";

const services: Record<
  ServiceKey,
  {
    name: string;
    icon: string;
    description: string;
    basePrice: number;
    sqmPrice: number;
    minPrice: number;
  }
> = {
  umzugsreinigung: {
    name: "Umzugsreinigung",
    icon: "🏠",
    description: "Endreinigung mit Abgabegarantie.",
    basePrice: 420,
    sqmPrice: 5.2,
    minPrice: 590,
  },
  grundreinigung: {
    name: "Grundreinigung",
    icon: "✨",
    description: "Intensive Reinigung für Wohnung, Haus oder Gewerbe.",
    basePrice: 280,
    sqmPrice: 4.6,
    minPrice: 390,
  },
  baureinigung: {
    name: "Baureinigung",
    icon: "🏗️",
    description: "Grob-, Zwischen- und Bauendreinigung.",
    basePrice: 650,
    sqmPrice: 7.5,
    minPrice: 750,
  },
  fensterreinigung: {
    name: "Fensterreinigung",
    icon: "🪟",
    description: "Fenster, Rahmen, Glasflächen und Storen.",
    basePrice: 180,
    sqmPrice: 2.8,
    minPrice: 220,
  },
  unterhaltsreinigung: {
    name: "Unterhaltsreinigung",
    icon: "🧽",
    description: "Regelmässige Reinigung für Privatkunden.",
    basePrice: 120,
    sqmPrice: 1.8,
    minPrice: 150,
  },
  bueroreinigung: {
    name: "Büroreinigung",
    icon: "💼",
    description: "Regelmässige Reinigung von Büros und Gewerbeflächen.",
    basePrice: 160,
    sqmPrice: 2.1,
    minPrice: 190,
  },
  treppenhausreinigung: {
    name: "Treppenhausreinigung",
    icon: "🪜",
    description: "Treppen, Geländer, Eingänge und Gemeinschaftsflächen.",
    basePrice: 180,
    sqmPrice: 2.2,
    minPrice: 220,
  },
  hauswartung: {
    name: "Hauswartung",
    icon: "🏢",
    description: "Betreuung von Liegenschaften und Objekten.",
    basePrice: 320,
    sqmPrice: 1.7,
    minPrice: 390,
  },
  fassadenreinigung: {
    name: "Fassadenreinigung",
    icon: "🏙️",
    description: "Reinigung von Fassaden und Aussenflächen.",
    basePrice: 480,
    sqmPrice: 7.2,
    minPrice: 650,
  },
  teppichreinigung: {
    name: "Teppichreinigung",
    icon: "🧶",
    description: "Professionelle Tiefenreinigung von Teppichflächen.",
    basePrice: 140,
    sqmPrice: 4.4,
    minPrice: 190,
  },
  gartenpflege: {
    name: "Gartenpflege",
    icon: "🌿",
    description: "Rasen, Hecken, Pflege und saisonale Arbeiten.",
    basePrice: 180,
    sqmPrice: 1.4,
    minPrice: 220,
  },
  winterdienst: {
    name: "Winterdienst",
    icon: "❄️",
    description: "Schneeräumung, Salzen und sichere Zugangswege.",
    basePrice: 180,
    sqmPrice: 1.2,
    minPrice: 220,
  },
  umzug: {
    name: "Umzug",
    icon: "🚚",
    description: "Privatumzug, Firmenumzug und Umzugshelfer.",
    basePrice: 520,
    sqmPrice: 2.2,
    minPrice: 690,
  },
  transport: {
    name: "Transport",
    icon: "🚛",
    description: "Möbel-, Stückgut- und Kleintransporte.",
    basePrice: 290,
    sqmPrice: 3.2,
    minPrice: 350,
  },
  moebelmontage: {
    name: "Möbelmontage",
    icon: "🛠️",
    description: "Aufbau und Demontage von Möbeln.",
    basePrice: 180,
    sqmPrice: 22,
    minPrice: 220,
  },
  entsorgung: {
    name: "Entsorgung",
    icon: "♻️",
    description: "Sperrgut, Möbel und fachgerechte Entsorgung.",
    basePrice: 290,
    sqmPrice: 4.2,
    minPrice: 350,
  },
  raeumung: {
    name: "Räumung",
    icon: "📦",
    description: "Keller-, Wohnungs- und Haushaltsräumungen.",
    basePrice: 480,
    sqmPrice: 7.5,
    minPrice: 690,
  },
  malerarbeiten: {
    name: "Malerarbeiten",
    icon: "🎨",
    description: "Innenanstriche, Renovationen und Ausbesserungen.",
    basePrice: 390,
    sqmPrice: 11.5,
    minPrice: 590,
  },
  bodenleger: {
    name: "Bodenleger",
    icon: "🪵",
    description: "Verlegung von Laminat, Vinyl, Parkett und Teppich.",
    basePrice: 420,
    sqmPrice: 38,
    minPrice: 690,
  },
  elektriker: {
    name: "Elektriker",
    icon: "⚡",
    description: "Installationen, Reparaturen und elektrische Arbeiten.",
    basePrice: 240,
    sqmPrice: 85,
    minPrice: 290,
  },
  sanitaer: {
    name: "Sanitär",
    icon: "🚿",
    description: "Armaturen, Leitungen, Reparaturen und Installationen.",
    basePrice: 260,
    sqmPrice: 90,
    minPrice: 320,
  },
};

const fieldConfigurations: Record<
  ServiceKey,
  {
    objectLabel: string;
    roomsLabel: string;
    areaLabel: string;
    bathroomsLabel: string;
    floorLabel: string;
    stepDescription: string;
  }
> = {
  umzugsreinigung: {
    objectLabel: "Objektart",
    roomsLabel: "Zimmer",
    areaLabel: "Wohnfläche m²",
    bathroomsLabel: "Badezimmer / Nasszellen",
    floorLabel: "Stockwerk",
    stepDescription: "Objektgrösse und Ausstattung für die Endreinigung.",
  },
  grundreinigung: {
    objectLabel: "Objektart",
    roomsLabel: "Räume",
    areaLabel: "Reinigungsfläche m²",
    bathroomsLabel: "Badezimmer / Nasszellen",
    floorLabel: "Stockwerk",
    stepDescription: "Fläche, Räume und Verschmutzungsgrad erfassen.",
  },
  baureinigung: {
    objectLabel: "Bauobjekt",
    roomsLabel: "Räume / Einheiten",
    areaLabel: "Baufläche m²",
    bathroomsLabel: "Nasszellen",
    floorLabel: "Etagen",
    stepDescription: "Baufläche und Umfang der Bauendreinigung.",
  },
  fensterreinigung: {
    objectLabel: "Objektart",
    roomsLabel: "Anzahl Fenster",
    areaLabel: "Glasfläche m²",
    bathroomsLabel: "Anzahl Storen",
    floorLabel: "Stockwerk",
    stepDescription: "Fensteranzahl, Glasfläche und Zugänglichkeit.",
  },
  unterhaltsreinigung: {
    objectLabel: "Objektart",
    roomsLabel: "Räume",
    areaLabel: "Reinigungsfläche m²",
    bathroomsLabel: "Nasszellen",
    floorLabel: "Stockwerk",
    stepDescription: "Fläche und Umfang des Reinigungseinsatzes.",
  },
  bueroreinigung: {
    objectLabel: "Büroart",
    roomsLabel: "Büroräume",
    areaLabel: "Bürofläche m²",
    bathroomsLabel: "Nasszellen",
    floorLabel: "Etage",
    stepDescription: "Bürofläche, Räume und Gemeinschaftsbereiche.",
  },
  treppenhausreinigung: {
    objectLabel: "Liegenschaft",
    roomsLabel: "Treppenhäuser",
    areaLabel: "Gesamtfläche m²",
    bathroomsLabel: "Eingangsbereiche",
    floorLabel: "Etagen",
    stepDescription: "Treppenhäuser, Etagen und Gemeinschaftsflächen.",
  },
  hauswartung: {
    objectLabel: "Liegenschaftstyp",
    roomsLabel: "Anzahl Einheiten",
    areaLabel: "Gesamtfläche m²",
    bathroomsLabel: "Treppenhäuser",
    floorLabel: "Etagen",
    stepDescription: "Grösse und Umfang der Liegenschaftsbetreuung.",
  },
  fassadenreinigung: {
    objectLabel: "Gebäudeart",
    roomsLabel: "Fassadenseiten",
    areaLabel: "Fassadenfläche m²",
    bathroomsLabel: "Zugänge / Abschnitte",
    floorLabel: "Gebäudehöhe / Etagen",
    stepDescription: "Fassadenfläche, Höhe und Zugänglichkeit.",
  },
  teppichreinigung: {
    objectLabel: "Objektart",
    roomsLabel: "Räume",
    areaLabel: "Teppichfläche m²",
    bathroomsLabel: "Fleckenbereiche",
    floorLabel: "Stockwerk",
    stepDescription: "Teppichfläche und Reinigungsumfang.",
  },
  gartenpflege: {
    objectLabel: "Grundstückstyp",
    roomsLabel: "Heckenmeter",
    areaLabel: "Gartenfläche m²",
    bathroomsLabel: "Bäume / Sträucher",
    floorLabel: "Zugangserschwernis",
    stepDescription: "Gartenfläche, Hecken und Pflanzenbestand.",
  },
  winterdienst: {
    objectLabel: "Objektart",
    roomsLabel: "Zugangsbereiche",
    areaLabel: "Räumfläche m²",
    bathroomsLabel: "Treppen / Rampen",
    floorLabel: "Gefällestufe",
    stepDescription: "Räumfläche, Zugänge und Gefahrenstellen.",
  },
  umzug: {
    objectLabel: "Umzugsart",
    roomsLabel: "Zimmer",
    areaLabel: "Distanz in km",
    bathroomsLabel: "Benötigte Helfer",
    floorLabel: "Stockwerk",
    stepDescription: "Umfang, Distanz, Helfer und Zugänglichkeit.",
  },
  transport: {
    objectLabel: "Transportart",
    roomsLabel: "Anzahl Gegenstände",
    areaLabel: "Distanz in km",
    bathroomsLabel: "Benötigte Helfer",
    floorLabel: "Stockwerk",
    stepDescription: "Transportgut, Distanz und Trageaufwand.",
  },
  moebelmontage: {
    objectLabel: "Montageart",
    roomsLabel: "Anzahl Möbel",
    areaLabel: "Geschätzte Arbeitsstunden",
    bathroomsLabel: "Demontagen",
    floorLabel: "Stockwerk",
    stepDescription: "Anzahl Möbel und geschätzter Montageaufwand.",
  },
  entsorgung: {
    objectLabel: "Entsorgungsart",
    roomsLabel: "Räume",
    areaLabel: "Volumen in m³",
    bathroomsLabel: "Schwere Gegenstände",
    floorLabel: "Stockwerk",
    stepDescription: "Volumen, Gewicht und Zugänglichkeit.",
  },
  raeumung: {
    objectLabel: "Räumungsart",
    roomsLabel: "Räume",
    areaLabel: "Räumfläche m²",
    bathroomsLabel: "Schwere Gegenstände",
    floorLabel: "Stockwerk",
    stepDescription: "Fläche, Räume und Menge des Räumungsguts.",
  },
  malerarbeiten: {
    objectLabel: "Objektart",
    roomsLabel: "Räume",
    areaLabel: "Malerfläche m²",
    bathroomsLabel: "Türen / Rahmen",
    floorLabel: "Stockwerk",
    stepDescription: "Zu streichende Fläche und Anzahl Räume.",
  },
  bodenleger: {
    objectLabel: "Bodenart",
    roomsLabel: "Räume",
    areaLabel: "Bodenfläche m²",
    bathroomsLabel: "Türübergänge",
    floorLabel: "Stockwerk",
    stepDescription: "Bodenfläche, Räume und Verlegeaufwand.",
  },
  elektriker: {
    objectLabel: "Auftragsart",
    roomsLabel: "Arbeitsstellen",
    areaLabel: "Leitungsmeter",
    bathroomsLabel: "Geräte / Anschlüsse",
    floorLabel: "Etage",
    stepDescription: "Arbeitsstellen, Leitungen und Installationen.",
  },
  sanitaer: {
    objectLabel: "Auftragsart",
    roomsLabel: "Arbeitsstellen",
    areaLabel: "Leitungsmeter",
    bathroomsLabel: "Armaturen / Geräte",
    floorLabel: "Etage",
    stepDescription: "Armaturen, Leitungen und Installationsumfang.",
  },
};

function formatPrice(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export default function PreisrechnerPage() {
  const [service, setService] = useState<ServiceKey>("umzugsreinigung");
  const [objectType, setObjectType] = useState("Wohnung");
  const [rooms, setRooms] = useState(3.5);
  const [area, setArea] = useState(80);
  const [bathrooms, setBathrooms] = useState(1);
  const [floor, setFloor] = useState(1);
  const [lift, setLift] = useState(true);

  const [balcony, setBalcony] = useState(false);
  const [cellar, setCellar] = useState(false);
  const [attic, setAttic] = useState(false);
  const [garage, setGarage] = useState(false);
  const [storen, setStoren] = useState(false);
  const [lamellen, setLamellen] = useState(false);
  const [oven, setOven] = useState(true);
  const [hood, setHood] = useState(true);
  const [fridge, setFridge] = useState(false);
  const [washer, setWasher] = useState(false);
  const [dryer, setDryer] = useState(false);
  const [carpet, setCarpet] = useState(false);
  const [heavyDirt, setHeavyDirt] = useState(false);
  const [constructionDirt, setConstructionDirt] = useState(false);
  const [mold, setMold] = useState(false);
  const [express, setExpress] = useState(false);

  const [photos, setPhotos] = useState<File[]>([]);
  const [aiDone, setAiDone] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00");
  const [payment, setPayment] = useState<PaymentOption>("deposit");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedReview, setAcceptedReview] = useState(false);

  const selected = services[service];
  const fieldConfig = fieldConfigurations[service];

  const calculation = useMemo(() => {
    const safeArea = Math.max(Number(area) || 0, 1);
    const safeRooms = Math.max(Number(rooms) || 0, 1);
    const safeBathrooms = Math.max(Number(bathrooms) || 0, 0);
    const safeFloor = Math.max(Number(floor) || 0, 0);

    let total = 0;

    switch (service) {
      case "umzugsreinigung":
        total =
          420 +
          safeArea * 5.2 +
          safeRooms * 95 +
          safeBathrooms * 120;
        break;

      case "grundreinigung":
        total =
          280 +
          safeArea * 4.6 +
          safeRooms * 70 +
          safeBathrooms * 90;
        break;

      case "baureinigung":
        total =
          650 +
          safeArea * 7.5 +
          safeRooms * 90 +
          safeBathrooms * 110;
        break;

      case "fensterreinigung":
        total =
          160 +
          safeRooms * 24 +
          safeArea * 4.5 +
          safeBathrooms * 18;
        break;

      case "unterhaltsreinigung":
        total =
          100 +
          safeArea * 1.8 +
          safeRooms * 18 +
          safeBathrooms * 25;
        break;

      case "bueroreinigung":
        total =
          130 +
          safeArea * 2.1 +
          safeRooms * 15 +
          safeBathrooms * 30;
        break;

      case "treppenhausreinigung":
        total =
          160 +
          safeArea * 2.2 +
          safeRooms * 75 +
          safeFloor * 35;
        break;

      case "hauswartung":
        total =
          280 +
          safeArea * 1.7 +
          safeRooms * 45 +
          safeBathrooms * 70 +
          safeFloor * 25;
        break;

      case "fassadenreinigung":
        total =
          480 +
          safeArea * 7.2 +
          safeRooms * 95 +
          safeFloor * 120;
        break;

      case "teppichreinigung":
        total =
          140 +
          safeArea * 4.4 +
          safeRooms * 25 +
          safeBathrooms * 35;
        break;

      case "gartenpflege":
        total =
          180 +
          safeArea * 1.4 +
          safeRooms * 14 +
          safeBathrooms * 45;
        break;

      case "winterdienst":
        total =
          180 +
          safeArea * 1.2 +
          safeRooms * 35 +
          safeBathrooms * 25;
        break;

      case "umzug":
        total =
          520 +
          safeRooms * 220 +
          safeArea * 4.2 +
          safeBathrooms * 130 +
          safeFloor * 90;
        break;

      case "transport":
        total =
          290 +
          safeRooms * 28 +
          safeArea * 3.2 +
          safeBathrooms * 120 +
          safeFloor * 70;
        break;

      case "moebelmontage":
        total =
          180 +
          safeRooms * 65 +
          safeArea * 95 +
          safeBathrooms * 45;
        break;

      case "entsorgung":
        total =
          290 +
          safeArea * 85 +
          safeRooms * 75 +
          safeBathrooms * 80 +
          safeFloor * 70;
        break;

      case "raeumung":
        total =
          480 +
          safeArea * 7.5 +
          safeRooms * 130 +
          safeBathrooms * 90 +
          safeFloor * 75;
        break;

      case "malerarbeiten":
        total =
          390 +
          safeArea * 11.5 +
          safeRooms * 95 +
          safeBathrooms * 45;
        break;

      case "bodenleger":
        total =
          420 +
          safeArea * 38 +
          safeRooms * 80 +
          safeBathrooms * 35;
        break;

      case "elektriker":
        total =
          240 +
          safeRooms * 95 +
          safeArea * 18 +
          safeBathrooms * 85;
        break;

      case "sanitaer":
        total =
          260 +
          safeRooms * 110 +
          safeArea * 22 +
          safeBathrooms * 95;
        break;

      default:
        total =
          selected.basePrice +
          safeArea * selected.sqmPrice;
    }

    const cleaningServices: ServiceKey[] = [
      "umzugsreinigung",
      "grundreinigung",
      "baureinigung",
      "fensterreinigung",
      "unterhaltsreinigung",
      "bueroreinigung",
      "treppenhausreinigung",
      "fassadenreinigung",
      "teppichreinigung",
    ];

    const accessServices: ServiceKey[] = [
      "umzugsreinigung",
      "grundreinigung",
      "baureinigung",
      "fensterreinigung",
      "umzug",
      "transport",
      "entsorgung",
      "raeumung",
      "malerarbeiten",
      "bodenleger",
    ];

    if (
      accessServices.includes(service) &&
      safeFloor > 0 &&
      !lift
    ) {
      total += safeFloor * 90;
    }

    if (balcony) total += 80;
    if (cellar) total += 120;
    if (attic) total += 120;
    if (garage) total += 150;

    if (cleaningServices.includes(service)) {
      if (storen) total += 160;
      if (lamellen) total += 220;
      if (oven) total += 45;
      if (hood) total += 45;
      if (fridge) total += 45;
      if (washer) total += 40;
      if (dryer) total += 40;
      if (carpet) total += 180;
    }

    if (heavyDirt) {
      total += Math.max(220, total * 0.12);
    }

    if (constructionDirt) {
      total += Math.max(320, total * 0.18);
    }

    if (mold) {
      total += 280;
    }

    if (express) {
      total += Math.max(220, total * 0.15);
    }

    const objectTypeFactors: Record<string, number> = {
      Wohnung: 1,
      Haus: 1.12,
      Büro: 1.08,
      Gewerbe: 1.18,
      Neubau: 1.22,
    };

    total *= objectTypeFactors[objectType] ?? 1;

    const totalPrice = Math.max(
      total,
      selected.minPrice
    );

    const roundedTotal =
      Math.round(totalPrice / 10) * 10;

    const fullPaymentPrice =
      Math.round((roundedTotal * 0.9) / 10) * 10;

    const depositPrice =
      Math.round((roundedTotal * 0.5) / 10) * 10;

    return {
      totalPrice: roundedTotal,
      fullPaymentPrice,
      depositPrice,
    };
  }, [
    selected,
    service,
    objectType,
    area,
    rooms,
    bathrooms,
    floor,
    lift,
    balcony,
    cellar,
    attic,
    garage,
    storen,
    lamellen,
    oven,
    hood,
    fridge,
    washer,
    dryer,
    carpet,
    heavyDirt,
    constructionDirt,
    mold,
    express,
  ]); 

  const amountToday =
    payment === "full" ? calculation.fullPaymentPrice : calculation.depositPrice;

  const canCheckout =
    date &&
    firstName &&
    lastName &&
    email &&
    phone &&
    street &&
    zip &&
    city &&
    acceptedTerms &&
    acceptedReview;

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    const uploaded = Array.from(files);
    setPhotos(uploaded);
    setAiDone(false);

    setTimeout(() => {
      setAiDone(true);
    }, 1300);
  }

  function startCheckout() {
    if (!canCheckout) return;

    const params = new URLSearchParams({
      service: selected.name,
      total: String(calculation.totalPrice),
      amount_today: String(amountToday),
      payment,
      date,
      time,
      objectType,
      rooms: String(rooms),
      area: String(area),
      bathrooms: String(bathrooms),
      floor: String(floor),
      lift: String(lift),
      firstName,
      lastName,
      email,
      phone,
      street,
      zip,
      city,
      notes,
    });

    window.location.href = `/api/stripe/booking-checkout?${params.toString()}`;
  }

  return (
    <main className="page">
      <style jsx global>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 6%, rgba(56, 189, 248, 0.22), transparent 32%),
            radial-gradient(circle at 85% 10%, rgba(234, 179, 8, 0.1), transparent 25%),
            linear-gradient(135deg, #030615 0%, #070b20 50%, #02030b 100%);
          color: #fff;
          padding: 28px 18px 44px;
          font-family: Arial, sans-serif;
        }

        .wrap {
          max-width: 1320px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          font-weight: 950;
          letter-spacing: 0.08em;
          font-size: 24px;
        }

        .brand-mark {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: grid;
          place-items: center;
          box-shadow: 0 0 34px rgba(168, 85, 247, 0.36);
        }

        .brand small {
          display: block;
          color: #cbd5e1;
          font-size: 11px;
          letter-spacing: 0.22em;
          margin-top: 3px;
        }

        .trustbar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .trust-pill {
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.055);
          color: #e5e7eb;
          border-radius: 16px;
          padding: 12px 16px;
          font-weight: 850;
          display: flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(12px);
        }

        .hero {
          text-align: center;
          margin: 16px 0 34px;
        }

        .eyebrow {
          display: inline-flex;
          border: 1px solid rgba(110, 231, 183, 0.35);
          background: rgba(99, 102, 241, 0.1);
          color: #7dd3fc;
          border-radius: 999px;
          padding: 10px 20px;
          font-weight: 950;
          letter-spacing: 0.16em;
          margin-bottom: 18px;
        }

        .title {
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.95;
          letter-spacing: -3px;
          margin: 0 0 18px;
        }

        .subtitle {
          max-width: 860px;
          margin: 0 auto;
          color: #cbd5e1;
          font-size: 20px;
          line-height: 1.55;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          align-items: start;
        }

        .panel,
        .result {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.035));
          border-radius: 28px;
          padding: 26px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
          backdrop-filter: blur(18px);
        }

        .step {
          margin-bottom: 16px;
          padding: 22px;
          border-radius: 22px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.08);
        }

        .step-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .step-no {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #38bdf8, #6366f1);
          color: white;
          font-weight: 950;
          box-shadow: 0 0 24px rgba(16,185,129,.35);
        }

        .step h2,
        .step h3 {
          margin: 0;
          font-size: 22px;
        }

        .step-desc {
          color: #94a3b8;
          font-size: 14px;
          margin-top: 4px;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .service-card {
          min-height: 118px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(2, 8, 6, 0.5);
          color: white;
          border-radius: 18px;
          padding: 15px;
          cursor: pointer;
          text-align: left;
          transition: 0.2s ease;
        }

        .service-card:hover,
        .service-card.active {
          border-color: rgba(56, 189, 248, 0.8);
          background: rgba(99, 102, 241, 0.13);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.12);
        }

        .service-icon {
          font-size: 26px;
          display: block;
          margin-bottom: 10px;
        }

        .service-card strong {
          display: block;
          font-size: 15px;
          margin-bottom: 5px;
        }

        .service-card span:last-child {
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.35;
        }

        .two,
        .three {
          display: grid;
          gap: 14px;
        }

        .two {
          grid-template-columns: 1fr 1fr;
        }

        .three {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .field {
          margin-bottom: 14px;
        }

        .field label {
          display: block;
          color: #cbd5e1;
          font-weight: 850;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(0,0,0,.26);
          color: white;
          padding: 14px 15px;
          border-radius: 13px;
          font-size: 15px;
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: rgba(52,211,153,.75);
          box-shadow: 0 0 0 3px rgba(52,211,153,.12);
        }

        .field textarea {
          min-height: 96px;
          resize: vertical;
        }

        .extras-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .check {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 13px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(0,0,0,.23);
          color: #e5e7eb;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
        }

        .check input {
          width: 18px;
          height: 18px;
          accent-color: #6366f1;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 16px;
        }

        .upload-box {
          border: 1.8px dashed rgba(110,231,183,.35);
          background: rgba(16,185,129,.06);
          border-radius: 18px;
          padding: 25px;
          text-align: center;
          color: #cbd5e1;
        }

        .upload-box strong {
          display: block;
          color: white;
          margin-bottom: 6px;
        }

        .upload-box input {
          margin-top: 14px;
          max-width: 100%;
        }

        .ai-box {
          border-radius: 18px;
          padding: 18px;
          background: rgba(0,0,0,.22);
          border: 1px solid rgba(255,255,255,.09);
          color: #c4b5fd;
          line-height: 1.65;
          font-size: 14px;
        }

        .badge {
          display: inline-flex;
          color: #c4b5fd;
          background: rgba(168,85,247,.18);
          border: 1px solid rgba(168,85,247,.35);
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .result {
          position: sticky;
          top: 20px;
          background:
            radial-gradient(circle at 70% 0%, rgba(168,85,247,.25), transparent 34%),
            linear-gradient(180deg, rgba(6,78,59,.66), rgba(2,8,6,.88));
          border-color: rgba(52,211,153,.35);
          box-shadow:
            0 30px 100px rgba(0,0,0,.42),
            0 0 50px rgba(16,185,129,.12);
        }

        .result-label {
          color: #bfdbfe;
          font-weight: 900;
          font-size: 18px;
          margin-bottom: 12px;
        }

        .price {
          font-size: clamp(50px, 5.8vw, 74px);
          font-weight: 950;
          letter-spacing: -3px;
          color: #c4b5fd;
          margin: 0 0 18px;
          line-height: 0.95;
          text-shadow: 0 0 28px rgba(52,211,153,.24);
        }

        .result-text {
          color: #cbd5e1;
          line-height: 1.55;
          margin-bottom: 22px;
        }

        .summary {
          background: rgba(0,0,0,.25);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .summary-title {
          font-size: 13px;
          letter-spacing: .08em;
          color: #bfdbfe;
          font-weight: 950;
          margin-bottom: 10px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,.08);
          color: #cbd5e1;
        }

        .row:last-child {
          border-bottom: 0;
        }

        .row strong {
          color: white;
          text-align: right;
        }

        .payment {
          display: block;
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(0,0,0,.25);
          cursor: pointer;
          margin-bottom: 14px;
          transition: 0.2s ease;
        }

        .payment.active {
          border-color: rgba(52,211,153,.9);
          background: rgba(16,185,129,.13);
          box-shadow: 0 0 32px rgba(16,185,129,.12);
        }

        .payment input {
          accent-color: #6366f1;
          margin-right: 10px;
          width: 18px;
          height: 18px;
        }

        .payment strong {
          display: inline-block;
          font-size: 19px;
          color: white;
          margin-bottom: 8px;
        }

        .payment p {
          color: #cbd5e1;
          margin: 2px 0;
          line-height: 1.4;
        }

        .green {
          color: #a78bfa;
          font-weight: 950;
        }

        .total {
          background: rgba(168,85,247,.08);
          border-radius: 18px;
          padding: 16px;
          margin: 16px 0;
          border: 1px solid rgba(168,85,247,.18);
        }

        .terms {
          display: flex;
          gap: 10px;
          padding: 13px;
          border-radius: 14px;
          background: rgba(255,255,255,.075);
          border: 1px solid rgba(255,255,255,.08);
          margin-bottom: 10px;
          color: #e5e7eb;
          font-size: 13px;
          line-height: 1.45;
          cursor: pointer;
        }

        .terms input {
          width: 18px;
          height: 18px;
          accent-color: #6366f1;
          flex-shrink: 0;
        }

        .button {
          width: 100%;
          border: 0;
          border-radius: 18px;
          padding: 20px;
          font-size: 18px;
          font-weight: 950;
          color: #ffffff;
          background: linear-gradient(135deg, #38bdf8, #6366f1);
          box-shadow: 0 18px 45px rgba(168,85,247,.25);
          cursor: pointer;
          margin-top: 16px;
        }

        .button:disabled {
          opacity: .45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .note {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.55;
          margin-top: 16px;
          text-align: center;
        }

        .bottom-trust {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 24px;
        }

        .trust-card {
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.045);
          border-radius: 18px;
          padding: 18px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .trust-card span {
          color: #facc15;
          font-size: 24px;
        }

        .trust-card strong {
          display: block;
          margin-bottom: 4px;
        }

        .trust-card p {
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.4;
        }

        @media (max-width: 980px) {
          .topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .grid,
          .two,
          .three,
          .upload-grid,
          .bottom-trust {
            grid-template-columns: 1fr;
          }

          .service-grid,
          .extras-grid {
            grid-template-columns: 1fr 1fr;
          }

          .result {
            position: static;
          }
        }

        @media (max-width: 560px) {
          .service-grid,
          .extras-grid {
            grid-template-columns: 1fr;
          }

          .panel,
          .result,
          .step {
            padding: 18px;
          }
        }
      `}</style>

      <div className="wrap">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">🔥</div>
            <div>
              AUFTRAGO
              <small>PREISRECHNER</small>
            </div>
          </div>

          <div className="trustbar">
            <div className="trust-pill">🛡️ 100% Abgabegarantie</div>
            <div className="trust-pill">🏷️ Transparente Preise</div>
            <div className="trust-pill">🔒 Sichere Zahlung</div>
          </div>
        </div>

        <section className="hero">
          <div className="eyebrow">ONLINE BUCHUNG</div>
          <h1 className="title">Preis sofort berechnen & Termin reservieren</h1>
          <p className="subtitle">
            Dienstleistung auswählen, Angaben erfassen, Termin reservieren und sicher
            online bezahlen. Jede Buchung wird vor der definitiven Bestätigung geprüft.
          </p>
        </section>

        <div className="grid">
          <section className="panel">
            <div className="step">
              <div className="step-head">
                <div className="step-no">1</div>
                <div>
                  <h2>Dienstleistung wählen</h2>
                  <div className="step-desc">Wählen Sie die gewünschte Dienstleistung.</div>
                </div>
              </div>

              <div className="service-grid">
                {Object.entries(services).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    className={`service-card ${service === key ? "active" : ""}`}
                    onClick={() => setService(key as ServiceKey)}
                  >
                    <span className="service-icon">{item.icon}</span>
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">2</div>
                <div>
                  <h3>Objektangaben</h3>
                  <div className="step-desc">{fieldConfig.stepDescription}</div>
                </div>
              </div>

              <div className="three">
                <div className="field">
                  <label>{fieldConfig.objectLabel}</label>
                  <select value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                    <option>Wohnung</option>
                    <option>Haus</option>
                    <option>Büro</option>
                    <option>Gewerbe</option>
                    <option>Neubau</option>
                  </select>
                </div>

                <div className="field">
                  <label>{fieldConfig.roomsLabel}</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>{fieldConfig.areaLabel}</label>
                  <input
                    type="number"
                    min="1"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="three">
                <div className="field">
                  <label>{fieldConfig.bathroomsLabel}</label>
                  <input
                    type="number"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>{fieldConfig.floorLabel}</label>
                  <input
                    type="number"
                    min="0"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                  />
                </div>

                <CheckBox label="Lift vorhanden" checked={lift} onChange={setLift} />
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">3</div>
                <div>
                  <h3>Extras auswählen</h3>
                  <div className="step-desc">Alle Zusatzarbeiten direkt erfassen.</div>
                </div>
              </div>

              <div className="extras-grid">
                <CheckBox label="Balkon / Terrasse" checked={balcony} onChange={setBalcony} />
                <CheckBox label="Keller" checked={cellar} onChange={setCellar} />
                <CheckBox label="Estrich" checked={attic} onChange={setAttic} />
                <CheckBox label="Garage" checked={garage} onChange={setGarage} />
                <CheckBox label="Storen" checked={storen} onChange={setStoren} />
                <CheckBox label="Lamellenstoren" checked={lamellen} onChange={setLamellen} />
                <CheckBox label="Backofen" checked={oven} onChange={setOven} />
                <CheckBox label="Dampfabzug" checked={hood} onChange={setHood} />
                <CheckBox label="Kühlschrank" checked={fridge} onChange={setFridge} />
                <CheckBox label="Waschmaschine" checked={washer} onChange={setWasher} />
                <CheckBox label="Tumbler" checked={dryer} onChange={setDryer} />
                <CheckBox label="Teppichreinigung" checked={carpet} onChange={setCarpet} />
                <CheckBox label="Starke Verschmutzung" checked={heavyDirt} onChange={setHeavyDirt} />
                <CheckBox label="Bauverschmutzung" checked={constructionDirt} onChange={setConstructionDirt} />
                <CheckBox label="Schimmel / Spezial" checked={mold} onChange={setMold} />
                <CheckBox label="Express-Termin" checked={express} onChange={setExpress} />
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">4</div>
                <div>
                  <h3>Fotos hochladen</h3>
                  <div className="step-desc">Optional, aber empfohlen für eine schnelle Prüfung.</div>
                </div>
              </div>

              <div className="upload-grid">
                <div className="upload-box">
                  <strong>Fotos hier hochladen</strong>
                  <p>Wohnung, Küche, Badezimmer, Fenster oder Storen.</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotos(e.target.files)}
                  />
                </div>

                <div className="ai-box">
                  <div className="badge">KI-Prüfung</div>
                  {!photos.length && (
                    <>
                      ✅ Preisvalidierung
                      <br />
                      ✅ Schnellere Bearbeitung
                      <br />
                      ✅ Weniger Rückfragen
                    </>
                  )}
                  {photos.length > 0 && !aiDone && <strong>KI analysiert Ihre Fotos...</strong>}
                  {photos.length > 0 && aiDone && (
                    <>
                      <strong>Analyse abgeschlossen</strong>
                      <br />
                      ✅ {photos.length} Foto(s) erhalten
                      <br />
                      ✅ Prüfung durch Auftrago/Cavara
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">5</div>
                <div>
                  <h3>Kundendaten</h3>
                  <div className="step-desc">Für die Buchungsbestätigung und Rückfragen.</div>
                </div>
              </div>

              <div className="three">
                <div className="field">
                  <label>Vorname</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="field">
                  <label>Nachname</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="field">
                  <label>E-Mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>Telefon</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="field">
                <label>Adresse</label>
                <input value={street} onChange={(e) => setStreet(e.target.value)} />
              </div>

              <div className="three">
                <div className="field">
                  <label>PLZ</label>
                  <input value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>

                <div className="field">
                  <label>Ort</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

                <div className="field">
                  <label>Bemerkungen</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">6</div>
                <div>
                  <h3>Termin auswählen</h3>
                  <div className="step-desc">Der Termin wird nach Zahlung reserviert.</div>
                </div>
              </div>

              <div className="two">
                <div className="field">
                  <label>Wunschdatum</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="field">
                  <label>Uhrzeit</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)}>
                    <option>08:00</option>
                    <option>09:00</option>
                    <option>10:00</option>
                    <option>13:00</option>
                    <option>14:00</option>
                    <option>15:00</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <aside className="result">
            <div className="result-label">Ihr provisorischer Buchungspreis</div>

            <h2 className="price">CHF {formatPrice(calculation.totalPrice)}</h2>

            <p className="result-text">
              Dieser Preis basiert auf Ihren Angaben. Nach der Buchung prüfen wir alles nochmals.
              Falls etwas nicht passt, melden wir uns vor der definitiven Bestätigung.
            </p>

            <div className="summary">
              <div className="summary-title">ÜBERSICHT</div>
              <div className="row">
                <span>Dienstleistung</span>
                <strong>{selected.name}</strong>
              </div>
              <div className="row">
                <span>{fieldConfig.objectLabel}</span>
                <strong>{objectType}</strong>
              </div>
              <div className="row">
                <span>{fieldConfig.roomsLabel}</span>
                <strong>{rooms}</strong>
              </div>
              <div className="row">
                <span>{fieldConfig.areaLabel}</span>
                <strong>{area}</strong>
              </div>
              <div className="row">
                <span>Kunde</span>
                <strong>{firstName || lastName ? `${firstName} ${lastName}` : "Noch offen"}</strong>
              </div>
              <div className="row">
                <span>Ort</span>
                <strong>{zip || city ? `${zip} ${city}` : "Noch offen"}</strong>
              </div>
              <div className="row">
                <span>Termin</span>
                <strong>{date ? `${date}, ${time}` : "Noch nicht gewählt"}</strong>
              </div>
            </div>

            <label
              className={`payment ${payment === "deposit" ? "active" : ""}`}
              onClick={() => setPayment("deposit")}
            >
              <input
                type="radio"
                checked={payment === "deposit"}
                onChange={() => setPayment("deposit")}
              />
              <strong>50 % Anzahlung</strong>
              <p>Heute bezahlen: CHF {formatPrice(calculation.depositPrice)}</p>
              <p>Restzahlung am Ausführungstag.</p>
            </label>

            <label
              className={`payment ${payment === "full" ? "active" : ""}`}
              onClick={() => setPayment("full")}
            >
              <input
                type="radio"
                checked={payment === "full"}
                onChange={() => setPayment("full")}
              />
              <strong>100 % Sofortzahlung</strong>
              <p className="green">10 % Rabatt sichern</p>
              <p>Heute bezahlen: CHF {formatPrice(calculation.fullPaymentPrice)}</p>
            </label>

            <div className="total">
              <div className="row">
                <span>Total</span>
                <strong>CHF {formatPrice(calculation.totalPrice)}</strong>
              </div>
              <div className="row">
                <span>Heute bezahlen</span>
                <strong>CHF {formatPrice(amountToday)}</strong>
              </div>
              {payment === "deposit" && (
                <div className="row">
                  <span>Restzahlung am Ausführungstag</span>
                  <strong>
                    CHF {formatPrice(calculation.totalPrice - calculation.depositPrice)}
                  </strong>
                </div>
              )}
            </div>

            <label className="terms">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              Ich akzeptiere die AGB und Zahlungsbedingungen.
            </label>

            <label className="terms">
              <input
                type="checkbox"
                checked={acceptedReview}
                onChange={(e) => setAcceptedReview(e.target.checked)}
              />
              Ich bin damit einverstanden, dass Auftrago meine Buchung nach Eingang nochmals prüft und den endgültigen Preis sowie den Termin vor der Bestätigung freigibt.
            </label>

            <button className="button" disabled={!canCheckout} onClick={startCheckout}>
              🔒 Jetzt Termin reservieren & bezahlen
            </button>

            <p className="note">
              Sichere Zahlung via Stripe. Ohne Ihre Zustimmung entstehen keine Zusatzkosten.
            </p>
          </aside>
        </div>

        <div className="bottom-trust">
          <div className="trust-card">
            <span>🛡️</span>
            <div>
              <strong>100% Abgabegarantie</strong>
              <p>Ideal für Umzugsreinigungen und Übergaben.</p>
            </div>
          </div>

          <div className="trust-card">
            <span>👥</span>
            <div>
              <strong>Geprüfte Anbieter</strong>
              <p>Aufträge werden professionell geprüft und bearbeitet.</p>
            </div>
          </div>

          <div className="trust-card">
            <span>📅</span>
            <div>
              <strong>Schnelle Terminvergabe</strong>
              <p>Reservierung direkt online möglich.</p>
            </div>
          </div>

          <div className="trust-card">
            <span>🔒</span>
            <div>
              <strong>Sichere Zahlung</strong>
              <p>Bezahlung über Stripe mit Anzahlung oder Sofortzahlung.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CheckBox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}