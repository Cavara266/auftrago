export type AdzunaJob = {
  id: string;
  title: string;
  description: string;
  redirectUrl: string;
  company: string;
  location: string;
  created: string;
  category: string;
  salaryMin: number | null;
  salaryMax: number | null;
};

type AdzunaResult = {
  id?: string | number;
  title?: string;
  description?: string;
  redirect_url?: string;
  created?: string;
  salary_min?: number;
  salary_max?: number;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
  };
  category?: {
    label?: string;
    tag?: string;
  };
};

type AdzunaResponse = {
  count?: number;
  results?: AdzunaResult[];
};

export type JobSearchOptions = {
  page?: number;
  query?: string;
  location?: string;
  resultsPerPage?: number;
};

export async function searchAdzunaJobs({
  page = 1,
  query = "",
  location = "",
  resultsPerPage = 20,
}: JobSearchOptions) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_API_KEY;

  if (!appId || !appKey) {
    throw new Error("ADZUNA_APP_ID oder ADZUNA_API_KEY fehlt.");
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: String(resultsPerPage),
    "content-type": "application/json",
    sort_by: "date",
  });

  if (query.trim()) {
    params.set("what", query.trim());
  }

  if (location.trim()) {
    params.set("where", location.trim());
  }

  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/ch/search/${page}?${params.toString()}`,
    {
      next: {
        revalidate: 900,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Adzuna API Fehler: HTTP ${response.status}`);
  }

  const data = (await response.json()) as AdzunaResponse;

  const jobs: AdzunaJob[] = (data.results ?? []).map((job) => ({
    id: String(job.id ?? ""),
    title: job.title?.trim() || "Stellenangebot",
    description: job.description?.trim() || "",
    redirectUrl: job.redirect_url?.trim() || "",
    company: job.company?.display_name?.trim() || "Unternehmen",
    location: job.location?.display_name?.trim() || "Schweiz",
    created: job.created || "",
    category:
      job.category?.label?.trim() ||
      job.category?.tag?.trim() ||
      "Weitere",
    salaryMin:
      typeof job.salary_min === "number" ? job.salary_min : null,
    salaryMax:
      typeof job.salary_max === "number" ? job.salary_max : null,
  }));

  return {
    count: data.count ?? jobs.length,
    jobs,
  };
}
