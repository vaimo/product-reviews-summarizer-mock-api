import { Core } from "@adobe/aio-sdk";
import axios from "axios";
import { GraphqlClientParams } from "./types/request";

const logger = Core.Logger("commerce-graphql-client", { level: "info" });

interface GraphQLResponse {
  data: unknown;
  errors?: Array<{ message: string; [key: string]: unknown }>;
}

/**
 * Selects the appropriate client ID based on the store code
 */
function getClientIdForStore(storeCode: string | undefined, params: GraphqlClientParams): string {
  if (!storeCode) {
    return params.GC_CLIENT_ID_REVIEW;
  }

  switch (storeCode.toUpperCase()) {
    case 'GB':
      return params.GC_CLIENT_ID_REVIEW_GB || params.GC_CLIENT_ID_REVIEW;
    case 'DE':
      return params.GC_CLIENT_ID_REVIEW_DE || params.GC_CLIENT_ID_REVIEW;
    case 'ES':
      return params.GC_CLIENT_ID_REVIEW_ES || params.GC_CLIENT_ID_REVIEW;
    default:
      return params.GC_CLIENT_ID_REVIEW;
  }
}

async function executeGraphQL(
  query: string,
  variables: Record<string, unknown>,
  params: GraphqlClientParams,
  additionalHeaders?: Record<string, string>
): Promise<unknown> {
  const endpoint = params.GC_GRAPHQL_ENDPOINT;

  try {
    const headers = {
      "Content-Type": "application/json",
      ...(additionalHeaders || {}),
    };

    const response = await axios({
      url: endpoint,
      method: "POST",
      headers: headers,
      data: {
        query,
        variables,
        operationName: variables.operationName || null,
      },
    });

    const result: GraphQLResponse = response.data;

    if (result.errors) {
      throw new Error("GraphQL query error: " + JSON.stringify(result.errors));
    }

    return result.data;
  } catch (error: unknown) {
    logger.error("Error executing GraphQL query: " + String(error));
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { data: unknown } };
      if (axiosError.response) {
        logger.error("Error response: " + JSON.stringify(axiosError.response.data));
      }
    }
    throw new Error(`Failed to execute GraphQL query: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export { executeGraphQL, getClientIdForStore };
