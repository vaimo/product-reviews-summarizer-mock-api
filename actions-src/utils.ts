import { BaseParams } from "./types/request";

interface Logger {
  info: (message: string) => void;
}

/**
 *
 * Returns a log ready string of the action input parameters.
 * The `Authorization` header content will be replaced by '<hidden>'.
 *
 * @param {BaseParams} params action input parameters.
 *
 * @returns {string}
 *
 */
function stringParameters(params: BaseParams): string {
  // hide authorization token without overriding params
  let headers = params.__ow_headers || {};
  if (headers.authorization) {
    headers = { ...headers, authorization: '<hidden>' };
  }
  return JSON.stringify({ ...params, __ow_headers: headers });
}

/**
 *
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {Record<string, any>} obj object to check.
 * @param {string[]} required list of required keys.
 *
 * @returns {string[]}
 * @private
 */
function getMissingKeys(obj: Record<string, any>, required: string[]): string[] {
  return required.filter(r => {
    const splits = r.split('.');
    const last = splits[splits.length - 1];
    const traverse = splits.slice(0, -1).reduce((tObj, split) => {
      tObj = (tObj[split] || {});
      return tObj;
    }, obj);
    return traverse[last] === undefined || traverse[last] === '';
  });
}

/**
 *
 * Returns the list of missing keys giving an object and its required keys.
 * A parameter is missing if its value is undefined or ''.
 * A value of 0 or null is not considered as missing.
 *
 * @param {BaseParams} params action input parameters.
 * @param {string[]} requiredHeaders list of required input headers.
 * @param {string[]} requiredParams list of required input parameters.
 *
 * @returns {string | null} if the return value is not null, then it holds an error message describing the missing inputs.
 *
 */
function checkMissingRequestInputs(
  params: BaseParams,
  requiredParams: string[] = [],
  requiredHeaders: string[] = []
): string | null {
  let errorMessage: string | null = null;

  requiredHeaders = requiredHeaders.map(h => h.toLowerCase());
  const missingHeaders = getMissingKeys(params.__ow_headers || {}, requiredHeaders);
  if (missingHeaders.length > 0) {
    errorMessage = `missing header(s) '${missingHeaders}'`;
  }

  const missingParams = getMissingKeys(params, requiredParams);
  if (missingParams.length > 0) {
    if (errorMessage) {
      errorMessage += ' and ';
    } else {
      errorMessage = '';
    }
    errorMessage += `missing parameter(s) '${missingParams}'`;
  }

  return errorMessage;
}

/**
 *
 * Extracts the bearer token string from the Authorization header in the request parameters.
 *
 * @param {BaseParams} params action input parameters.
 *
 * @returns {string | undefined} the token string or undefined if not set in request headers.
 *
 */
function getBearerToken(params: BaseParams): string | undefined {
  if (
    params.__ow_headers &&
    params.__ow_headers.authorization &&
    params.__ow_headers.authorization.startsWith('Bearer ')
  ) {
    return params.__ow_headers.authorization.substring('Bearer '.length);
  }
  return undefined;
}

/**
 *
 * Returns an error response object and attempts to log.info the status code and error message
 *
 * @param {number} statusCode the error status code.
 * @param {string} message the error message.
 * @param {Logger} [logger] an optional logger instance object with an `info` method.
 *
 * @returns {object} the error object, ready to be returned from the action main's function.
 *
 */
function errorResponse(
  statusCode: number,
  message: string,
  logger?: Logger
): { error: { statusCode: number; body: { error: string } } } {
  if (logger && typeof logger.info === 'function') {
    logger.info(`${statusCode}: ${message}`);
  }
  return {
    error: {
      statusCode,
      body: {
        error: message,
      },
    },
  };
}

export {
  errorResponse,
  getBearerToken,
  stringParameters,
  checkMissingRequestInputs,
};
