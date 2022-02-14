import { Client, Get, Match, Index, Identify } from "faunadb";

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

export async function getUsersByUserType(userType = "teacher") {
  const response = await client.query(
    Paginate(
      Match(Index("users_by_userType"), userType)
    )
  );

  console.log(response);
}