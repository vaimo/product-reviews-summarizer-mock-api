import { Core } from "@adobe/aio-sdk";
import axios from "axios";
import { GraphqlClientParams } from "./types/request";

const logger = Core.Logger("commerce-graphql-client", { level: "info" });

interface GraphQLResponse {
  data: any;
  errors?: any;
}

async function executeGraphQL(
  query: string,
  variables: Record<string, any>,
  params: GraphqlClientParams,
  additionalHeaders?: Record<string, string>
): Promise<any> {
  const endpoint = params.GC_GRAPHQL_ENDPOINT;

  if (!endpoint || !params.GC_CLIENT_ID_REVIEW) {
    throw new Error("Missing Commerce GraphQL endpoint data");
  }

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
  } catch (error: any) {
    logger.error("Error executing GraphQL query: " + String(error));
    if (error.response) {
      logger.error("Error response: " + JSON.stringify(error.response.data));
    }
    throw new Error(`Failed to execute GraphQL query: ${error.message}`);
  }
}

export { executeGraphQL };
