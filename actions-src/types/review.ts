export interface Review {
  id: string;
  score: number;
  content: string;
  title: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: Pagination;
  averageScore: number;
  totalReviews: number;
}
