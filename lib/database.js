import { Client, Get, Match, Index, Identify, Paginate } from "faunadb";
import { createErrorPayload } from "./errors";

// Sets up connection to database.
// Secrets are in .env.local file in root folder.
const client = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN,
});

export async function runQuery(method) {
  let response;

  await client.query(method)
  .then(ret => {
    response = {
      error: false,
      result: ret
    }
  }).catch(e => {
    response = {
      error: true,
      result: e
    }
  });

  return response;
}

export async function getUserByEmail(email) {
  return await runQuery(
    Get(
      Match(
        Index("user_by_email"), email
      )
    )
  )
}

// Gets user details from the database based on the provided email address.
export async function authenticate(email, password) {

  const authResult = await runQuery(
    Identify(
      Match(
        Index("user_by_email"), email
      ), password
    )
  );

  if (authResult.error) return authResult;
  if (!authResult.result) return {
    error: false,
    result: {
      auth: false
    }
  }

  const user = await getUserByEmail(email);

  if (user.error) return user;

  return {
    error: false,
    result: {
      ...user.result,
      auth: true,
      refID: user.result.ref.id
    }
  }
}

export async function getUsersByUserType(userType = "student") {
  const result = await client.query(
    Paginate(
      Match(Index("users_by_userType"), userType)
    )
  );

  if (!result.data) return createErrorPayload(99);
  if (result.data.length === 0) return { error: false, result: [] }

  const reply = result.data.map((value) => {
    return {
      refID: value[0].id,
      name: value[1],
      email: value[2],
    }
  });

  return {
    error: false,
    result: reply
  }
}