import { BaseParams, DataParams } from "../../../types/request";

/**
 * Copyright © Vaimo Group. All rights reserved.
 * See LICENSE.txt for license details.
 */
export interface ReviewRequest {
  productId: string;
  productSku: string;
  page?: string;
  perPage?: string;
  sort?: string;
  direction?: string;
  storeCode?: string;
}

export interface GraphqlClientParams {
  GC_CLIENT_ID_REVIEW: string;
  GC_CLIENT_ID_REVIEW_GB?: string;
  GC_CLIENT_ID_REVIEW_DE?: string;
  GC_CLIENT_ID_REVIEW_ES?: string;
  GC_GRAPHQL_ENDPOINT: string;
}

export type MockFunctionParams = BaseParams & GraphqlClientParams & DataParams<ReviewRequest>;
