import { ReviewsResponse } from "../../types/review";
import { executeGraphQL } from "./graphql-client";
import { GraphqlClientParams } from "./types/request";

interface ProductReviewsGraphQLResponse {
  productReviews: {
    status: {
      code: string;
      message: string;
    };
    response: {
      pagination: {
        page: number;
        perPage: number;
        total: number;
      };
      bottomLine: {
        averageScore: number;
        totalReviews: number;
      };
      reviews: Array<{
        id: string;
        score: number;
        votesUp: number;
        votesDown: number;
        content: string;
        title: string;
        createdAt: string;
        deleted: boolean;
        verifiedBuyer: boolean;
        user: {
          userType: string;
          displayName: string;
        };
      }>;
    };
  };
}

const PRODUCT_REVIEWS_QUERY = `
query ProductReviews($productId: String!, $perPage: String, $page: String, $sort: String, $direction: String, $clientId: String!) {
  productReviews(
    productId: $productId
    perPage: $perPage
    page: $page
    sort: $sort
    direction: $direction
    clientId: $clientId
  ) {
    status {
      code
      message
    }
    response {
      pagination {
        page
        perPage: per_page
        total
      }
      bottomLine: bottomline {
        averageScore: average_score
        totalReviews: total_review
      }
      reviews {
        id
        score
        votesUp: votes_up
        votesDown: votes_down
        content
        title
        createdAt: created_at
        deleted
        verifiedBuyer: verified_buyer
        user {
          userType: user_type
          displayName: display_name
        }
      }
    }
  }
}`;

export async function fetchReviewsForProduct(
  productId: string,
  params: GraphqlClientParams,
  options: {
    page?: number | string;
    perPage?: number | string;
    sort?: string;
    direction?: string;
    storeCode?: string;
  } = {}
): Promise<ReviewsResponse> {
  const productIdString = String(productId);
  const page = String(options.page || 1);
  const perPage = String(options.perPage || 10);
  const sort = options.sort || "date";
  const direction = options.direction || "desc";
  const storeCode = options.storeCode;

  const variables = {
    productId: productIdString,
    perPage: perPage,
    page: page,
    sort: sort,
    direction: direction,
    clientId: params.GC_CLIENT_ID_REVIEW,
    operationName: "ProductReviews",
  };

  // Prepare headers - include Store header if storeCode is provided
  const additionalHeaders: Record<string, string> = {};
  if (storeCode) {
    additionalHeaders.Store = storeCode;
  }

  try {
    const data = await executeGraphQL(PRODUCT_REVIEWS_QUERY, variables, params, additionalHeaders) as ProductReviewsGraphQLResponse;

    if (!data?.productReviews?.response) {
      throw new Error("Failed to fetch reviews: Invalid data structure");
    }

    return {
      reviews: (data.productReviews.response.reviews || []).map(review => ({
        id: review.id,
        score: review.score,
        content: review.content,
        title: review.title,
        createdAt: review.createdAt,
      })),
      pagination: {
        page: data.productReviews.response.pagination?.page || 1,
        perPage: data.productReviews.response.pagination?.perPage || 10,
        total: data.productReviews.response.pagination?.total || 0,
      },
      averageScore: data.productReviews.response.bottomLine?.averageScore || 0,
      totalReviews: data.productReviews.response.bottomLine?.totalReviews || 0,
    };
  } catch (error: unknown) {
    throw new Error(`Failed to fetch reviews for product ${productId}: ${String(error)}`);
  }
}
