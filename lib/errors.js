// Returns json containing description of specified error.
export function createErrorPayload(errorCode) {
  return {
    error: true,
    errorCode: errorCode,
    ...ErrorMessages[errorCode],
  };
}

// Contains list of error codes and their respective messages.
export const ErrorMessages = {
  100: {
    message: "Unknown database error.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
  },

  101: {
    message: "Account doesn't exist.",
    clientMessage: "The details you have entered are incorrect.",
  },
  102: {
    message: "Incorrect login details.",
    clientMessage: "The details you have entered are incorrect.",
  },
  103: {
    message: "Incorrect email address format.",
    clientMessage: "The email address is in an incorrect format.",
  },
  104: {
    message: "Missing 'email' or 'password' in POST request.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
  },
  105: {
    message: "Empty email/password entry.",
    clientMessage: "The email or password cannot be empty.",
  },
  106: {
    message: "email/password entry too long.",
    clientMessage: "The email or password is too long."
  },
  200: {
    message: "Unknown client-side error.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
  },

  300: {
    message: "Unknown server-side error.",
    clientMessage: "An error has occured. Please contact your adminstrator.",
  },
  301: {
    message: "Empty POST body.",
    clientMessage: "The POST request doesn't contain any data."
  }
};
