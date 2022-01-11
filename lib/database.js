import { Client, Get, Match, Index } from "faunadb";

const client = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN
})

export async function getUserDetailsByEmail(email) {

  try {

    return {
      error: false,
      result: await client.query(
        Get(
          Match(
            Index("user_by_email"),
            email
          )
        )
      )
    }
    
  } catch (e) {
    return {
      error: true,
      result: e
    }
  }
}