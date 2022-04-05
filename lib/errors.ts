import { NextApiResponse } from "next";

type ErrorPayload = {
  error: boolean,
  result: {
    errorCode: number,
    message: string,
    clientMessage: string,
  }
}

/**
 * Returns a JSON object containing error details of a specified error code.
 * @param errorCode The specific code of the error.
 * @returns The error payload containing data about the error.
 */
export function createErrorPayload(errorCode: number): ErrorPayload {
  return {
    error: true,
    result: {
      errorCode: errorCode,
      ...ErrorMessages[errorCode],
    }
  };
}

/**
 * Gets the HTTP status code of the error.
 * @param errorCode The specific code of the error.
 * @returns The HTTP status code of the error.
 */
export function getHttpStatus(errorCode: number): number {
  return ErrorMessages[errorCode].httpStatusCode;
}

/**
 * Returns a response with the details of the error in the body.
 * @param res The NextApiResponse object.
 * @param errorCode The specific code of the error.
 * @returns A response with the error payload in the body.
 */
export function errorResponse(res: NextApiResponse, errorCode: number) {
  return res.status(getHttpStatus(errorCode)).json(createErrorPayload(errorCode))
}

/**
 * A list of error messages.
 */
export const ErrorMessages = {
  99: {
    message: "No data returned from the database.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
    httpStatusCode: 200,
  },
  100: {
    message: "Unknown database error.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
    httpStatusCode: 500,
  },

  101: {
    message: "Account doesn't exist.",
    clientMessage: "The details you have entered are incorrect.",
    httpStatusCode: 404,
  },
  102: {
    message: "Incorrect login details.",
    clientMessage: "The details you have entered are incorrect.",
    httpStatusCode: 401,
  },
  103: {
    message: "Incorrect email address format.",
    clientMessage: "The email address is in an incorrect format.",
    httpStatusCode: 401,
  },
  104: {
    message: "Missing 'email' or 'password' in POST request.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
    httpStatusCode: 400,
  },
  105: {
    message: "Empty email/password entry.",
    clientMessage: "The email or password cannot be empty.",
    httpStatusCode: 401,
  },
  106: {
    message: "email/password entry too long.",
    clientMessage: "The email or password is too long.",
    httpStatusCode: 401,
  },
  150: {
    message: "Validation failed.",
    clientMessage: "The inputs have failed the validation tests.",
    httpStatusCode: 403
  },
  160: {
    message: "Assessment already completed.",
    clientMessage: "You have already completed this assessment. You cannot submit any more answers.",
    httpStatusCode: 403
  },
  161: {
    message: "Assessment doesn't exist.",
    clientMessage: "The assessment doesn't exist.",
    httpStatusCode: 404
  },
  170: {
    message: "Cannot change stage.",
    clientMessage: "The stage cannot be changed.",
    httpStatusCode: 403
  },
  200: {
    message: "Unknown client-side error.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
    httpStatusCode: 500,
  },

  300: {
    message: "Unknown server-side error.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
    httpStatusCode: 500,
  },
  301: {
    message: "Missing data in request.",
    clientMessage: "The request doesn't contain any data or has missing data.",
    httpStatusCode: 400,
  },
  302: {
    message: "Unauthorised access.",
    clientMessage: "The client's session does not contain the relevant credentials.",
    httpStatusCode: 403,
  },
  303: {
    message: "Unauthorised access for user type.",
    clientMessage: "The client's user type is not sufficient to grant access.",
    httpStatusCode: 403,
  },
};
