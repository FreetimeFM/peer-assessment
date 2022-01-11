export function getErrorMessage(errorCode) {
  return ErrorMessages.find(error => error.code === errorCode).message;
}

const ErrorMessages = [
  {
    code: 100,
    message: "Unknown database error."
  },
  {
    code: 101,
    message: "Account doesn't exist."
  },
  {
    code: 102,
    message: "Incorrect login details."
  },
  {
    code: 103,
    message: "Incorrect email address format."
  },
  {
    code: 104,
    message: "Missing 'email' or 'password' in POST request."
  },
  {
    code: 200,
    message: "Unknown client-side error."
  },
  {
    code: 300,
    message: "Unknown server-side error."
  }
]