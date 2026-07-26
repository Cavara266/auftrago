import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export default function Breadcrumbs({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-slate-400">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}

            {index === items.length - 1 ? (
              <span aria-current="page" className="font-semibold text-white">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition hover:text-sky-400"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
