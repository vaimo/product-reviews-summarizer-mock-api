import { initializeLogger, logError } from "../../logger";
import { actionErrorResponse } from "../../responses";
import { AppResponse, HttpStatus } from "../../types/request";
import { fetchReviewsForProduct } from "./commerce-reviews-graphql-client";
import { MockFunctionParams } from "./types/request";

export async function main(params: MockFunctionParams): Promise<AppResponse> {
  initializeLogger("product-reviews-summarizer-mock-api");

  try {
    const reviews = await fetchReviewsForProduct(params.data.productId, params, {
      page: params.data.page,
      perPage: params.data.perPage,
      sort: params.data.sort,
      direction: params.data.direction,
      storeCode: params.data.storeCode,
    });

    return {
      statusCode: HttpStatus.OK,
      body: reviews,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logError(`Server error: ${errorMessage}`);
    return actionErrorResponse(HttpStatus.INTERNAL_ERROR, `Request failed: ${errorMessage}`);
  }
}
