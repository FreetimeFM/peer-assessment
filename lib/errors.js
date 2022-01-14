export function getErrorMessage(errorCode) {
  return ErrorMessages[errorCode];
}

export const ErrorMessages = {
  100: "Unknown database error.",

  101: "Account doesn't exist.",
  102: "Incorrect login details.",
  103: "Incorrect email address format.",
  104: "Missing 'email' or 'password' in POST request.",
  105: "The email or password field are empty.",
  200: "Unknown client-side error.",

  300: "Unknown server-side error.",
}