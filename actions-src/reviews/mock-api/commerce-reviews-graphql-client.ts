import { ReviewsResponse } from "../../types/review";
import { executeGraphQL } from "./graphql-client";
import { GraphqlClientParams } from "./types/request";

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
  } = {}
): Promise<ReviewsResponse> {
  const productIdString = String(productId);
  const page = String(options.page || 1);
  const perPage = String(options.perPage || 10);
  const sort = options.sort || "date";
  const direction = options.direction || "desc";

  const variables = {
    productId: productIdString,
    perPage: perPage,
    page: page,
    sort: sort,
    direction: direction,
    clientId: params.GC_CLIENT_ID_REVIEW,
    operationName: "ProductReviews",
  };

  try {
    const data: any = await executeGraphQL(PRODUCT_REVIEWS_QUERY, variables, params);

    if (!data?.productReviews?.response) {
      throw new Error("Failed to fetch reviews: Invalid data structure");
    }

    return {
      reviews: data.productReviews.response.reviews || [],
      pagination: data.productReviews.response.pagination || {},
      averageScore: data.productReviews.response.bottomLine?.averageScore || 0,
      totalReviews: data.productReviews.response.bottomLine?.totalReviews || 0,
    };
  } catch (error: unknown) {
    throw new Error(`Failed to fetch reviews for product ${productId}: ${String(error)}`);
  }
}
