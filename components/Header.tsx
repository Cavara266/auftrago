import Link from "next/link";

const nav = [
  { href: "/", label: "Start" },
  { href: "/anfrage", label: "Anfrage eingeben" },
  { href: "/leads", label: "Auftrag suchen" },
  { href: "/partner/preise", label: "Preise & Credits" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-[12px] tracking-[0.35em] text-white/80">AUFTRAGO</div>
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80">
            Premium Vermittlung
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {nav.map((x) => (
            <Link
              key={x.href}
              href={x.href}
              className="rounded-full border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/8"
            >
              {x.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}