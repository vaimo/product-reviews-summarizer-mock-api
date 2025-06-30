import Oauth1a from "oauth-1.0a";
import crypto from "crypto";
import axios, { AxiosResponse } from "axios";

interface OauthOptions {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  storeCode?: string;
  version?: string;
}

interface Logger {
  debug: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

interface RequestData {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
}

/**
 * This function returns the Adobe commerce OAuth client
 *
 * @returns {object} - The Oauth client
 * @param {object} options - include the information to configure oauth
 * @param {object} logger - Logger
 */
function getOauthClient(options: OauthOptions, logger: Logger) {
  const instance: Record<string, any> = {};

  // Remove trailing slash if any
  const serverUrl = options.url;
  const apiVersion = options.version;
  const oauth = new Oauth1a({
    consumer: {
      key: options.consumerKey,
      secret: options.consumerSecret,
    },
    signature_method: "HMAC-SHA256",
    hash_function: hashFunctionSha256,
  });
  const token = {
    key: options.accessToken,
    secret: options.accessTokenSecret,
  };

  /**
   * This function creates the sha 256 hash
   *
   * @returns  {string} - returns generated hash
   * @param {string} baseString - base string
   * @param {string} key - key to encrypt
   */
  function hashFunctionSha256(baseString: string, key: string): string {
    return crypto.createHmac("sha256", key).update(baseString).digest("base64");
  }

  /**
   * This function makes the call to the API
   *
   * @returns {object} - returns the call response
   * @param {object} requestData - include the request data
   * @param {string} requestToken - access token
   * @param {object} customHeaders - include custom headers
   */
  async function apiCall(
    requestData: RequestData,
    requestToken = "",
    customHeaders: Record<string, string> = {}
  ): Promise<any> {
    try {
      logger.debug(
        `Fetching URL: ${requestData.url} with method: ${requestData.method}`
      );

      const headers = {
        ...(requestToken
          ? { Authorization: `Bearer ${requestToken}` }
          : oauth.toHeader(oauth.authorize(requestData, token))),
        ...customHeaders,
      };

      const response: AxiosResponse = await axios({
        url: requestData.url,
        method: requestData.method,
        headers,
        data: requestData.body,
        responseType: "json",
      });

      return response.data;
    } catch (error: any) {
      logger.error(`Error fetching URL ${requestData.url}: ${error}`);
      if (error.response?.data) {
        logger.error(
          `Error body ${requestData.url}: ${JSON.stringify(
            error.response.data
          )}`
        );
      }
      throw error;
    }
  }

  instance.consumerToken = async function (loginData: Record<string, unknown>) {
    return apiCall({
      url: createUrl("integration/customer/token"),
      method: "POST",
      body: loginData,
    });
  };

  instance.get = async function (resourceUrl: string, requestToken = "") {
    const requestData: RequestData = {
      url: createUrl(resourceUrl),
      method: "GET",
    };
    return apiCall(requestData, requestToken);
  };

  /**
   * This function creates the full URL
   *
   * @returns {string} - generated URL
   * @param {string} resourceUrl - Adobe commerce rest API resource URL
   */
  function createUrl(resourceUrl: string): string {
    return `${serverUrl}${apiVersion}/${resourceUrl}`;
  }

  instance.post = async function (
    resourceUrl: string,
    data: Record<string, unknown>,
    requestToken = "",
    customHeaders: Record<string, string> = {}
  ) {
    const requestData: RequestData = {
      url: createUrl(resourceUrl),
      method: "POST",
      body: data,
    };
    return apiCall(requestData, requestToken, customHeaders);
  };

  instance.put = async function (
    resourceUrl: string,
    data: Record<string, unknown>,
    requestToken = "",
    customHeaders: Record<string, string> = {}
  ) {
    const requestData: RequestData = {
      url: createUrl(resourceUrl),
      method: "PUT",
      body: data,
    };
    return apiCall(requestData, requestToken, customHeaders);
  };

  instance.delete = async function (resourceUrl: string, requestToken = "") {
    const requestData: RequestData = {
      url: createUrl(resourceUrl),
      method: "DELETE",
    };
    return apiCall(requestData, requestToken);
  };

  return instance;
}

/**
 * This function creates the oauth client to use for calling Adobe commerce API
 *
 * @returns {object} - returns the oauth client
 * @param {object} options - define the options for the client
 * @param {object} logger - define the Logger
 */
export function getCommerceOauthClient(options: OauthOptions, logger: Logger) {
  options.version = "V1";
  options.url = `${options.url}/rest/${options.storeCode}/`;
  return getOauthClient(options, logger);
}
