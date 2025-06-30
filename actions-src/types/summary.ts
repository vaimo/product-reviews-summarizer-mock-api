export interface SummaryData {
  processId: string;
  product: {
    id: string;
    sku: string;
    name: string;
  };
  summary: Summary;
  totalReviews: number;
  timestamp: string;
  lastProcessedReviewTimestamp?: string;
}

export interface Summary {
  thinking: string;
  summary: string;
  sentiment: "positive" | "negative" | "mixed";
  pros: string[];
  cons: string[];
  features: ReviewFeature[];
}

export interface ReviewFeature {
  name: string;
  description: string;
  quotes: string[];
}
