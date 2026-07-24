export type AnalyticsKpi = {
  label: string;
  value: string | number;
  sub: string;
  trend?: number | null;
};

export type DailyPoint = {
  key: string;
  label: string;
  leads: number;
  registrations: number;
  leadPurchases: number;
  creditRevenue: number;
};

export type RankingItem = {
  label: string;
  value: number;
  detail?: string;
};

export type LiveFeedItem = {
  id: string;
  dateLabel: string;
  icon: string;
  title: string;
  description: string;
  detail: string;
};

export type ForecastData = {
  projectedRevenue: number;
  projectedLeads: number;
  projectedProviders: number;
  confidence: number;
};
