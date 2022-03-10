// Returns json containing description of specified error.
export function createErrorPayload(errorCode) {
  return {
    error: true,
    errorCode: errorCode,
    ...ErrorMessages[errorCode],
  };
}

export function getHttpStatus(errorCode) {
  return ErrorMessages[errorCode].httpStatusCode;
}

export function errorResponse(res, errorCode) {
  res.status(getHttpStatus(errorCode)).json(createErrorPayload(errorCode))
}

// Contains list of error codes and their respective messages.
export const ErrorMessages = {
  99: {
    message: "No data returned from the database.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
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
