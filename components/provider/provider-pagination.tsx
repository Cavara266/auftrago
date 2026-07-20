import Link from "next/link";

type ProviderPaginationProps = {
  currentPage: number;
  totalPages: number;
  query: string;
  selectedService: string;
  selectedRegion: string;
};

function createDirectoryUrl({
  query,
  service,
  region,
  page,
}: {
  query: string;
  service: string;
  region: string;
  page: number;
}): string {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (service) {
    params.set("service", service);
  }

  if (region) {
    params.set("region", region);
  }

  if (page > 1) {
    params.set("page", page.toString());
  }

  const queryString = params.toString();

  return queryString
    ? `/anbieter-finden?${queryString}`
    : "/anbieter-finden";
}

function getVisiblePages(
  currentPage: number,
  totalPages: number
): number[] {
  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);

  for (
    let page = currentPage - 2;
    page <= currentPage + 2;
    page += 1
  ) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort(
    (firstPage, secondPage) =>
      firstPage - secondPage
  );
}

export default function ProviderPagination({
  currentPage,
  totalPages,
  query,
  selectedService,
  selectedRegion,
}: ProviderPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(
    currentPage,
    totalPages
  );

  return (
    <nav
      aria-label="Seitennavigation"
      className="mt-10 flex flex-wrap items-center justify-center gap-3"
    >
      {currentPage > 1 ? (
        <Link
          href={createDirectoryUrl({
            query,
            service: selectedService,
            region: selectedRegion,
            page: currentPage - 1,
          })}
          className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
        >
          ← Zurück
        </Link>
      ) : null}

      {visiblePages.map((pageNumber, index) => {
        const previousPage =
          visiblePages[index - 1];

        const showSeparator =
          previousPage !== undefined &&
          pageNumber - previousPage > 1;

        return (
          <div
            key={pageNumber}
            className="flex items-center gap-3"
          >
            {showSeparator ? (
              <span className="text-white/25">
                …
              </span>
            ) : null}

            <Link
              href={createDirectoryUrl({
                query,
                service: selectedService,
                region: selectedRegion,
                page: pageNumber,
              })}
              aria-current={
                pageNumber === currentPage
                  ? "page"
                  : undefined
              }
              className={
                pageNumber === currentPage
                  ? "flex h-12 min-w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-4 text-sm font-black text-white"
                  : "flex h-12 min-w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white/65 transition hover:bg-white/[0.09] hover:text-white"
              }
            >
              {pageNumber}
            </Link>
          </div>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={createDirectoryUrl({
            query,
            service: selectedService,
            region: selectedRegion,
            page: currentPage + 1,
          })}
          className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
        >
          Weiter →
        </Link>
      ) : null}
    </nav>
  );
}