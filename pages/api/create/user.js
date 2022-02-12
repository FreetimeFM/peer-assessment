import { withSessionApi } from "lib/iron-session/withSession";
import { createUser, getUserByEmail } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import trim from "validator/lib/trim";

async function validate(name, email, userType) {

  let validationError = [];

  // Checks if the name is too long or short.
  if (isEmpty(name)) validationError.push("Name cannot be empty.");
  if (name.length > 50) validationError.push("Name is too long. Maximum 50 characters.");

  // Checks if the email input is a valid email address and also if too long or short.
  if (isEmpty(email)) validationError.push("Email address cannot be empty.");
  if (email.length > 500) validationError.push("Email address is too long. Maximum 500 characters.");
  if (!isEmail(email)) validationError.push("Email address does not have a valid format.");

  // Validates the userType by checking if the input value belongs to any elements in the array. This most likely will not be run unless someone
  // meddles with the code on the client or server side.
  if (!["student", "teacher", "admin"].some(value => value === userType)) validationError.push("Role must be either 'Student', 'Teacher' or 'Admin'.");

  // If there are errors return list of current errors before going further.
  if (validationError.length >= 1) return validationError;

  const existenceCheck = await getUserByEmail(email);
  console.log(result);

  if (!result.error) {
    if (existenceCheck.result.email === email) {
      validationError.push("A user with this email address exists. Please use another address.");
      return validationError;
    }

    validationError.push("An error has occured.")
  }
  return validationError;
}

export default withSessionApi(async ({req, res}) => {
  try {
    let { name, email, userType } = req.body;

    // If the there is no data in the body or if the body is missing required data.
    if (!req.body) return res.status(getHttpStatus(301)).json(createErrorPayload(301));
    if (!name || !email || !userType) return res.status(getHttpStatus(301)).json(createErrorPayload(301));

    // Trims leading and trailing whitespace.
    name = trim(name);
    email = trim(email);

    // Validates inputs.
    const validationError = await validate(name, email, userType);

    // If there are validation errors.
    if (validationError.length >= 1)
      return res.status(getHttpStatus(150)).json({
        ...createErrorPayload(150),
        validationError: validationError,
      });

    // Attempts to add user to the database.
    const dbResponse = createUser({
      name: name,
      email: email,
      userType: userType,
    });

    // If adding user to database failed.
    if (dbResponse.error) return res.status(getHttpStatus(100)).json(createErrorPayload(100));

    // If all went well.
    return res.status(200).json({ error: false });
  } catch (error) {

    // If something went wrong server side.
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})