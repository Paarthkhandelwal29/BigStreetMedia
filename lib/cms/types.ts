export type PortfolioCategory =
  | "OOH"
  | "Transit"
  | "Events"
  | "Exhibitions"
  | "Retail Launches"
  | "Special Activations";

export type PortfolioWorkRecord = {
  id: string;
  brandName: string;
  category: PortfolioCategory;
  format: string;
  city: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MediaInventoryRecord = {
  id: string;
  city: string;
  mediaType: string;
  size: string;
  location: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePortfolioWorkInput = Omit<
  PortfolioWorkRecord,
  "id" | "createdAt" | "updatedAt"
>;

export type CaseStudyRecord = {
  id: string;
  title: string;
  slug?: string;
  brandId?: string;
  brandName?: string;
  industry?: string;
  campaignType?: string;
  challenge?: string;
  objective?: string;
  duration?: string;
  cities?: string;
  briefType?: string;
  featured: boolean;
  status: "draft" | "published";
  testimonialQuote?: string;
  testimonialName?: string;
  testimonialTitle?: string;
  strategyPoints: { id?: string; caseStudyId?: string; content: string; sortOrder: number }[];
  executionPoints: { id?: string; caseStudyId?: string; content: string; sortOrder: number }[];
  mediaLabels: { id?: string; caseStudyId?: string; label: string; sortOrder: number }[];
  results: { id?: string; caseStudyId?: string; label: string; value: string; sortOrder: number }[];
  portfolioItemIds: string[];
  portfolioMediaIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateMediaInventoryInput = Omit<
  MediaInventoryRecord,
  "id" | "createdAt" | "updatedAt"
>;

export type ServiceFormatImageRecord = {
  id: string;
  serviceSlug: string;
  formatName: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceFormatImageInput = Omit<
  ServiceFormatImageRecord,
  "id" | "createdAt" | "updatedAt"
>;
