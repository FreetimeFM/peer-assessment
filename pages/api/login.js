import { withIronSessionApiRoute } from "iron-session/next";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import trim from "validator/lib/trim";

import { sessionOptions } from "../../lib/iron-session/session";
import { authenticate } from "../../lib/database";
import { createErrorPayload } from "../../lib/errors";

export default withIronSessionApiRoute(async (req, res) => {

  let { email, password } = await req.body;

  // If 'email' or 'password' is not seen in POST request body, then return error.
  if (!email || !password) return res.status(400).createErrorPayload(104);

  // Trims the email and password.
  email = trim(email);
  password = trim(password);

  // Checks if the email and password are empty.
  if (isEmpty(email) || isEmpty(password)) return res.status(401).json(createErrorPayload(105));

  if (email.length > 500 || password.length > 150) return res.status(401).json(createErrorPayload(106));

  // Checks if the email is an email address.
  if (!isEmail(email)) return res.status(401).json(createErrorPayload(103));

  try {
    const details = await authenticate(email, password); // Fetches user details by email.

    // Unknown error possibly from the database.
    if (details.error) return res.status(500).json(createErrorPayload(100));

    const { result } = details;

    // Incorrect details or account doesn't exist.
    if (!result.auth) return res.status(401).json(createErrorPayload(102));

    console.log({
      ...result.data,
      refID: result.refID,
      isLoggedIn: true,
    })

    // Saves session to browser.
    req.session.user = {
      ...result.data,
      refID: result.refID,
      isLoggedIn: true,
    };

    await req.session.save();
    res.status(200).json({ error: false });

  } catch (error) {
    res.status(500).json(createErrorPayload(300));
  }
}, sessionOptions);