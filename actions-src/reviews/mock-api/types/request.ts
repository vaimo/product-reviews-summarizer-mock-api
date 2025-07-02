import { BaseParams, DataParams } from "../../../types/request";

/**
 * Copyright © Vaimo Group. All rights reserved.
 * See LICENSE.txt for license details.
 */
export interface ReviewRequest {
  productId: string;
  page?: string;
  perPage?: string;
  sort?: string;
  direction?: string;
  storeCode?: string;
}

export interface GraphqlClientParams {
  GC_CLIENT_ID_REVIEW: string;
  GC_GRAPHQL_ENDPOINT: string;
}

export type MockFunctionParams = BaseParams & GraphqlClientParams & DataParams<ReviewRequest>;
