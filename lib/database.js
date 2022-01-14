import { Client, Get, Match, Index } from "faunadb";

// Sets up connection to database.
// Secrets are in .env.local file in root folder.
const client = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN,
});

// Gets user details from the database based on the provided email address.
export default async function getUserDetailsByEmail(email) {
  try {
    return {
      error: false,
      result: await client.query(Get(Match(Index("user_by_email"), email))),
    };
  } catch (e) {
    return {
      error: true,
      result: e,
    };
  }
}
