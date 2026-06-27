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

export type CreateMediaInventoryInput = Omit<
  MediaInventoryRecord,
  "id" | "createdAt" | "updatedAt"
>;
