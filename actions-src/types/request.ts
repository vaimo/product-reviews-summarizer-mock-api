/**
 * Copyright © Vaimo Group. All rights reserved.
 * See LICENSE.txt for license details.
 */
export interface BaseParams {
  __ow_headers?: Record<string, string>;
  __ow_body?: string;
  LOG_LEVEL?: string;
  [key: string]: unknown;
}

export interface DataParams<T> {
  data: T;
}

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export interface AppResponse {
  statusCode: HttpStatus;
  body: any;
}
