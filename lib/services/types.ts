export type ServiceQuestionType =
  | "text"
  | "number"
  | "date"
  | "email"
  | "tel"
  | "select";

export type ServiceQuestion = {
  key: string;
  label: string;
  type: ServiceQuestionType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export type ServiceDefinition = {
  slug: string;
  title: string;
  short: string;
  category: string;
  icon: string;
  description: string;
  longDescription: string;
  keywords: string[];
  leadPrice: number;
  questions: ServiceQuestion[];
  featured?: boolean;
};

export type ServiceCategoryDefinition = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  serviceCount: number;
};
