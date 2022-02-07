import { withIronSessionApiRoute } from "iron-session/next";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";
import trim from "validator/lib/trim";
import bcryptjs from "bcryptjs";

import { sessionOptions } from "../../lib/iron-session/session";
import { getUserDetailsByEmail } from "../../lib/database";
import { createErrorPayload } from "../../lib/errors";

export default withIronSessionApiRoute(async (req, res) => {

  let { email, password } = await req.body;

  // If 'email' or 'password' is not seen in POST request body, then return error.
  if (!email || !password) return res.status(400).json(createErrorPayload(104));

  // Trims the email and password.
  email = trim(email);
  password = trim(password);

  // Checks if the email and password are empty.
  if (isEmpty(email) || isEmpty(password)) return res.status(401).json(createErrorPayload(105));

  if (email.length > 500 || password.length > 150) return res.status(401).json(createErrorPayload(106));

  // Checks if the email is an email address.
  if (!isEmail(email)) return res.status(401).json(createErrorPayload(103));

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
    const checkPassword = await bcryptjs.compare(password, result.data.password).then(res => {
      return res;
    })

    if (!checkPassword) return res.status(401).json(createErrorPayload(102));

    // Saves session to browser.
    req.session.user = {
      isLoggedIn: true,
      ref: result.ref,
      email: email,
      name: result.data.name,
      userType: result.data.userType
    };

    await req.session.save();

    res.status(200).json({ error: false });

  } catch (error) {
    res.status(500).json(createErrorPayload(300));
  }
}, sessionOptions);