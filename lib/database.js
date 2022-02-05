import { Client, Call, Create } from "faunadb";

// Sets up connection to database.
// Secrets are in .env.local file in root folder.
const client = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN,
});

// Gets user details from the database based on the provided email address.
export async function getUserDetailsByEmail(email) {
  try {
    return {
      error: false,
      result: await client.query(Call("get_user_login_details", email)),
    };
  } catch (e) {
    return {
      error: true,
      result: e,
    };
  }
}

export async function createAssessment({
  lecturerRefs,
  name,
  briefDescription,
  description,
  dates
}) {

}