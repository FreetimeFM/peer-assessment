import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/iron-session/session";
import { getUserDetailsByEmail } from "../../lib/database";
import { ErrorMessages } from "../../lib/errors";
import isEmail from "validator/lib/isEmail";
import bcryptjs from "bcryptjs";

function createErrorPayload(errorCode) {
  return {
    error: true,
    errorCode: errorCode,
    ...ErrorMessages[errorCode],
  };
}

function validateLoginDetails(email, password) {

  if (email === "" || password === "") return createErrorPayload(105);

  if (!isEmail(email)) return createErrorPayload(103);

  return {
    error: false,
  }
}

export default withIronSessionApiRoute(async (req, res) => {
  const { email, password } = await req.body;

  // If 'email' or 'password' is not seen in POST request body, then return error.
  if (!email || !password) return res.status(400).json(createErrorPayload(104));

  if (validateLoginDetails(email, password).error) return res.status(401).json(checkDetails);

  try {
    const details = await getUserDetailsByEmail(email); // Fetches user details by email.

    // If there has been a error.
    if (details.error) {

      // If the account doesn't exist.
      if (details.result.description === "Set not found.") return res.status(401).json(createErrorPayload(101));

      // Unknown error possibly from the database.
      return res.status(500).json(createErrorPayload(100));
    }

    const { result } = details;

    // Compare password input to hashed password.
    const checkPassword = await bcryptjs.compare(password, result[2]).then(res => {
      return res;
    })

    if (!checkPassword) return res.status(401).json(createErrorPayload(102));

    // Saves session to browser.
    req.session.user = {
      isLoggedIn: true,
      ref: result[0],
      email: email,
      name: result[1],
      userType: result[3]
    };
    await req.session.save();

    res.status(200).json({ error: false });

  } catch (error) {
    res.status(500).json(createErrorPayload(300));
  }
}, sessionOptions);