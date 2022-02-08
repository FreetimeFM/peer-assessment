import { Client, Get, Match, Index } from "faunadb";

// Sets up connection to database.
// Secrets are in .env.local file in root folder.
const client = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN,
});

// Gets user details from the database based on the provided email address.
export async function getUserDetailsByEmail(email) {
  let reply;

  await client.query(
    Get(
      Match(
        Index("get_user_login_by_email"), email
      )
    )
  ).then(ret => {
    reply = {
      error: false,
      result: ret
    }
  }).catch(e => {
    reply = {
      error: true,
      result: e
    }
  })

  return reply;
}

export async function createAssessment({
  lecturerRefs,
  name,
  briefDescription,
  description,
  dates
}) {

}