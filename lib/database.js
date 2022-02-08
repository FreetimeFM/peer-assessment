import { Client, Get, Match, Index } from "faunadb";

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
// Gets user details from the database based on the provided email address.
export async function getUserDetailsByEmail(email) {
  try {
    return {
      error: false,
      result: await client.query(Get(Match(Index("get_user_login_by_email"), email))),
    };
  } catch (e) {
    return {
      error: true,
      result: e,
    };
  }
}
