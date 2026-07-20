"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ProviderStatus =
  | "PENDING"
  | "APPROVED"
  | "BLOCKED";

type ProviderProfile = {
  email: string;
  companyName: string;
  contactName: string;
  phone: string;
  slug: string;
  logoUrl: string;
  website: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  serviceCategories: string[];
  serviceRegions: string[];
  status: ProviderStatus;
  createdAt: string;
};

type Props = {
  initialProfile: ProviderProfile;
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

type UpdatedProviderResponse = {
  companyName: string;
  contactName: string;
  phone: string | null;
  slug: string | null;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  serviceCategories: string[];
  serviceRegions: string[];
};

const MAX_LOGO_SIZE = 4 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const SERVICE_OPTIONS = [
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Fensterreinigung",
  "Grundreinigung",
  "Büroreinigung",
  "Baureinigung",
  "Hauswartung",
  "Gartenpflege",
  "Winterdienst",
  "Umzug",
  "Räumung",
  "Entsorgung",
  "Transport",
  "Malerarbeiten",
];

const REGION_OPTIONS = [
  "Aargau",
  "Zürich",
  "Luzern",
  "Solothurn",
  "Zug",
  "Bern",
  "Basel-Stadt",
  "Basel-Landschaft",
  "Schwyz",
  "St. Gallen",
  "Thurgau",
  "Schaffhausen",
  "Nidwalden",
  "Obwalden",
  "Uri",
  "Glarus",
  "Freiburg",
  "Waadt",
  "Wallis",
  "Tessin",
];

function getInitials(companyName: string): string {
  const words = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "AP";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function formatMemberSince(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "unbekannt";
  }

  return new Intl.DateTimeFormat("de-CH", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function calculateProfileStrength(
  profile: ProviderProfile,
  previewLogo: string
): number {
  const checks = [
    profile.companyName.trim().length > 0,
    profile.contactName.trim().length > 0,
    profile.phone.trim().length > 0,
    previewLogo.trim().length > 0,
    profile.website.trim().length > 0,
    profile.description.trim().length >= 50,
    profile.address.trim().length > 0,
    profile.postalCode.trim().length > 0,
    profile.city.trim().length > 0,
    profile.serviceCategories.length > 0,
    profile.serviceRegions.length > 0,
    profile.slug.trim().length > 0,
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}

function InputField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  maxLength,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-white/75">
        {label}

        {required ? (
          <span className="ml-1 text-sky-300">*</span>
        ) : null}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        onChange={onChange}
        className="min-h-[54px] w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-[15px] text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/40 focus:bg-white/[0.075] focus:ring-4 focus:ring-sky-400/10 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  );
}

function SelectionChips({
  options,
  selected,
  disabled,
  onToggle,
}: {
  options: string[];
  selected: string[];
  disabled: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selected.includes(option);

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(option)}
            className={
              isSelected
                ? "inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                : "inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-white/55 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <span
              className={
                isSelected
                  ? "flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300 text-xs font-black text-[#03130d]"
                  : "flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-xs text-white/35"
              }
            >
              {isSelected ? "✓" : "+"}
            </span>

            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function ProviderProfileForm({
  initialProfile,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const objectUrlRef =
    useRef<string | null>(null);

  const [profile, setProfile] =
    useState<ProviderProfile>(initialProfile);

  const [logoFile, setLogoFile] =
    useState<File | null>(null);

  const [previewLogo, setPreviewLogo] =
    useState(initialProfile.logoUrl);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    isDeletingLogo,
    setIsDeletingLogo,
  ] = useState(false);

  const [message, setMessage] =
    useState<MessageState>(null);

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );
      }
    };
  }, []);

  const profileStrength = useMemo(
    () =>
      calculateProfileStrength(
        profile,
        previewLogo
      ),
    [profile, previewLogo]
  );

  const initials =
    getInitials(profile.companyName);

  const memberSince =
    formatMemberSince(profile.createdAt);

  const hasSavedLogo =
    profile.logoUrl.trim().length > 0;

  const hasSelectedLogo =
    logoFile !== null;

  const isBusy =
    isSaving || isDeletingLogo;

  const publicProfilePath = profile.slug
    ? `/anbieter/${profile.slug}`
    : "";

  const publicProfileUrl = profile.slug
    ? `${
        typeof window !== "undefined"
          ? window.location.origin
          : "https://www.auftrago.ch"
      }${publicProfilePath}`
    : "";

  function clearObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(
        objectUrlRef.current
      );

      objectUrlRef.current = null;
    }
  }

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function updateField(
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));

    setMessage(null);
  }

  function toggleCategory(value: string) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      serviceCategories:
        currentProfile.serviceCategories.includes(
          value
        )
          ? currentProfile.serviceCategories.filter(
              (item) => item !== value
            )
          : [
              ...currentProfile.serviceCategories,
              value,
            ],
    }));

    setMessage(null);
  }

  function toggleRegion(value: string) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      serviceRegions:
        currentProfile.serviceRegions.includes(
          value
        )
          ? currentProfile.serviceRegions.filter(
              (item) => item !== value
            )
          : [
              ...currentProfile.serviceRegions,
              value,
            ],
    }));

    setMessage(null);
  }

  function handleLogoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !ALLOWED_LOGO_TYPES.includes(
        file.type
      )
    ) {
      setMessage({
        type: "error",
        text:
          "Bitte verwende ein JPG-, PNG- oder WEBP-Bild.",
      });

      resetFileInput();
      return;
    }

    if (file.size <= 0) {
      setMessage({
        type: "error",
        text:
          "Die ausgewählte Datei ist leer.",
      });

      resetFileInput();
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setMessage({
        type: "error",
        text:
          "Das Firmenlogo darf maximal 4 MB gross sein.",
      });

      resetFileInput();
      return;
    }

    clearObjectUrl();

    const objectUrl =
      URL.createObjectURL(file);

    objectUrlRef.current = objectUrl;

    setLogoFile(file);
    setPreviewLogo(objectUrl);
    setMessage(null);
  }

  function removeSelectedLogo() {
    clearObjectUrl();
    setLogoFile(null);
    setPreviewLogo(profile.logoUrl);
    resetFileInput();
    setMessage(null);
  }

  async function deleteSavedLogo() {
    if (!hasSavedLogo || isBusy) {
      return;
    }

    const confirmed =
      window.confirm(
        "Möchtest du dein Firmenlogo wirklich entfernen?"
      );

    if (!confirmed) {
      return;
    }

    setIsDeletingLogo(true);
    setMessage(null);

    try {
      const response = await fetch(
        "/api/provider/profile",
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Das Firmenlogo konnte nicht entfernt werden."
        );
      }

      clearObjectUrl();
      setLogoFile(null);
      setPreviewLogo("");

      setProfile((currentProfile) => ({
        ...currentProfile,
        logoUrl: "",
      }));

      resetFileInput();

      setMessage({
        type: "success",
        text:
          data.message ??
          "Das Firmenlogo wurde entfernt.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Das Firmenlogo konnte nicht entfernt werden.",
      });
    } finally {
      setIsDeletingLogo(false);
    }
  }

  async function copyPublicProfileUrl() {
    if (!publicProfileUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        publicProfileUrl
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setMessage({
        type: "error",
        text:
          "Der Profil-Link konnte nicht kopiert werden.",
      });
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();

      formData.append(
        "companyName",
        profile.companyName
      );

      formData.append(
        "contactName",
        profile.contactName
      );

      formData.append(
        "phone",
        profile.phone
      );

      formData.append(
        "website",
        profile.website
      );

      formData.append(
        "description",
        profile.description
      );

      formData.append(
        "address",
        profile.address
      );

      formData.append(
        "postalCode",
        profile.postalCode
      );

      formData.append(
        "city",
        profile.city
      );

      formData.append(
        "serviceCategories",
        JSON.stringify(
          profile.serviceCategories
        )
      );

      formData.append(
        "serviceRegions",
        JSON.stringify(
          profile.serviceRegions
        )
      );

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch(
        "/api/provider/profile",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Das Profil konnte nicht gespeichert werden."
        );
      }

      const updatedProvider =
        data.provider as UpdatedProviderResponse;

      clearObjectUrl();

      setProfile((currentProfile) => ({
        ...currentProfile,
        companyName:
          updatedProvider.companyName,
        contactName:
          updatedProvider.contactName,
        phone:
          updatedProvider.phone ?? "",
        slug:
          updatedProvider.slug ?? "",
        logoUrl:
          updatedProvider.logoUrl ?? "",
        website:
          updatedProvider.website ?? "",
        description:
          updatedProvider.description ?? "",
        address:
          updatedProvider.address ?? "",
        postalCode:
          updatedProvider.postalCode ?? "",
        city:
          updatedProvider.city ?? "",
        serviceCategories:
          updatedProvider.serviceCategories ??
          [],
        serviceRegions:
          updatedProvider.serviceRegions ??
          [],
      }));

      setPreviewLogo(
        updatedProvider.logoUrl ?? ""
      );

      setLogoFile(null);
      resetFileInput();

      setMessage({
        type: "success",
        text:
          data.message ??
          "Dein Firmenprofil wurde gespeichert.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Das Profil konnte nicht gespeichert werden.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl" />

        <div className="absolute right-[-12%] top-[18%] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute bottom-[-18%] left-[30%] h-[440px] w-[440px] rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-sky-200/75 transition hover:text-sky-100"
            >
              ← Zurück zum Dashboard
            </Link>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Firmenprofil
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Dein Anbieterprofil
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-white/50">
              Vervollständige deine
              Firmendaten, Leistungen und
              Einsatzgebiete.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                  Profilstärke
                </div>

                <div className="mt-1 text-2xl font-black">
                  {profileStrength}%
                </div>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-sky-300/30 bg-sky-400/10 text-sm font-black text-sky-100">
                {profileStrength}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]"
        >
          <section className="space-y-6">
            <article className="rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                📷 Firmenlogo
              </h2>

              <p className="mt-2 text-sm text-white/40">
                JPG, PNG oder WEBP,
                maximal 4 MB.
              </p>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-sky-400/20 to-indigo-500/20">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt="Firmenlogo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black">
                      {initials}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isBusy}
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#04101d] disabled:opacity-50"
                  >
                    {hasSavedLogo
                      ? "Logo ändern"
                      : "Logo auswählen"}
                  </button>

                  {hasSelectedLogo ? (
                    <button
                      type="button"
                      onClick={removeSelectedLogo}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold"
                    >
                      Auswahl entfernen
                    </button>
                  ) : null}

                  {hasSavedLogo &&
                  !hasSelectedLogo ? (
                    <button
                      type="button"
                      onClick={deleteSavedLogo}
                      className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-100"
                    >
                      {isDeletingLogo
                        ? "Wird gelöscht..."
                        : "Logo löschen"}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                Unternehmensangaben
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Firmenname"
                  name="companyName"
                  value={profile.companyName}
                  placeholder="Muster GmbH"
                  required
                  maxLength={150}
                  onChange={updateField}
                />

                <InputField
                  label="Ansprechpartner"
                  name="contactName"
                  value={profile.contactName}
                  placeholder="Max Muster"
                  required
                  maxLength={150}
                  onChange={updateField}
                />

                <InputField
                  label="E-Mail"
                  name="email"
                  value={profile.email}
                  placeholder=""
                  disabled
                  onChange={updateField}
                />

                <InputField
                  label="Telefon"
                  name="phone"
                  value={profile.phone}
                  placeholder="+41 79 123 45 67"
                  onChange={updateField}
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Webseite"
                    name="website"
                    value={profile.website}
                    placeholder="www.meine-firma.ch"
                    onChange={updateField}
                  />
                </div>
              </div>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                📍 Firmenadresse
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <InputField
                    label="Strasse und Hausnummer"
                    name="address"
                    value={profile.address}
                    placeholder="Musterstrasse 10"
                    onChange={updateField}
                  />
                </div>

                <InputField
                  label="Postleitzahl"
                  name="postalCode"
                  value={profile.postalCode}
                  placeholder="8000"
                  onChange={updateField}
                />

                <InputField
                  label="Ort"
                  name="city"
                  value={profile.city}
                  placeholder="Zürich"
                  onChange={updateField}
                />
              </div>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                🧹 Dienstleistungen
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Wähle alle Leistungen aus,
                die dein Unternehmen anbietet.
              </p>

              <div className="mt-6">
                <SelectionChips
                  options={SERVICE_OPTIONS}
                  selected={
                    profile.serviceCategories
                  }
                  disabled={isBusy}
                  onToggle={toggleCategory}
                />
              </div>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                🌍 Einsatzgebiete
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Wähle die Kantone und Regionen
                aus, in denen du Aufträge
                ausführst.
              </p>

              <div className="mt-6">
                <SelectionChips
                  options={REGION_OPTIONS}
                  selected={
                    profile.serviceRegions
                  }
                  disabled={isBusy}
                  onToggle={toggleRegion}
                />
              </div>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                ✨ Firmenbeschreibung
              </h2>

              <textarea
                name="description"
                value={profile.description}
                placeholder="Beschreibe dein Unternehmen, deine Erfahrung und deine besonderen Stärken..."
                maxLength={1500}
                rows={8}
                disabled={isBusy}
                onChange={updateField}
                className="mt-6 w-full resize-none rounded-[22px] border border-white/10 bg-white/[0.055] px-4 py-4 text-[15px] leading-7 text-white outline-none placeholder:text-white/25 focus:border-sky-300/40"
              />

              <div className="mt-2 text-right text-xs text-white/30">
                {profile.description.length}
                /1&apos;500 Zeichen
              </div>
            </article>

            {message ? (
              <div
                role="alert"
                className={
                  message.type === "success"
                    ? "rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-bold text-emerald-100"
                    : "rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-bold text-red-100"
                }
              >
                {message.text}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isBusy}
              className="flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-3 text-sm font-black text-white disabled:opacity-60"
            >
              {isSaving
                ? "Profil wird gespeichert..."
                : "💾 Firmenprofil speichern"}
            </button>
          </section>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a1325]">
              <div className="h-28 bg-gradient-to-r from-sky-400/30 via-indigo-500/25 to-cyan-300/20" />

              <div className="px-6 pb-7">
                <div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-4 border-[#0b162b] bg-gradient-to-br from-sky-400 to-indigo-500">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt={profile.companyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black">
                      {initials}
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-2xl font-semibold">
                  {profile.companyName ||
                    "Deine Firma"}
                </h2>

                <p className="mt-1 text-sm text-white/45">
                  {profile.city ||
                    "Standort nicht angegeben"}
                </p>

                <div className="mt-4">
                  {profile.status ===
                  "APPROVED" ? (
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                      ✓ Freigegeben
                    </span>
                  ) : profile.status ===
                    "BLOCKED" ? (
                    <span className="rounded-full bg-red-400/10 px-3 py-1.5 text-xs font-bold text-red-200">
                      Gesperrt
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-200">
                      In Prüfung
                    </span>
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold uppercase text-white/35">
                      Profil vollständig
                    </span>

                    <span className="font-black text-sky-200">
                      {profileStrength}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-300 to-indigo-400"
                      style={{
                        width: `${Math.max(
                          4,
                          profileStrength
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {profile.serviceCategories.length >
                0 ? (
                  <div className="mt-6">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                      Leistungen
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.serviceCategories
                        .slice(0, 6)
                        .map((service) => (
                          <span
                            key={service}
                            className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-white/65"
                          >
                            {service}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : null}

                {profile.serviceRegions.length >
                0 ? (
                  <div className="mt-6">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                      Einsatzgebiete
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.serviceRegions
                        .slice(0, 6)
                        .map((region) => (
                          <span
                            key={region}
                            className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-100"
                          >
                            📍 {region}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 border-t border-white/10 pt-6">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    Öffentliches Profil
                  </div>

                  {profile.slug ? (
                    <>
                      <div className="mt-3 break-all rounded-2xl bg-white/[0.045] p-3 text-xs text-sky-200">
                        {publicProfileUrl}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={copyPublicProfileUrl}
                          className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-bold"
                        >
                          {copied
                            ? "✓ Kopiert"
                            : "Link kopieren"}
                        </button>

                        <Link
                          href={publicProfilePath}
                          target="_blank"
                          className="flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-xs font-black text-[#04101d]"
                        >
                          Profil öffnen
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-white/40">
                      Speichere dein Profil,
                      damit deine öffentliche
                      Profiladresse erstellt
                      wird.
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-white/10 pt-5 text-xs text-white/35">
                  Mitglied seit {memberSince}
                </div>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}