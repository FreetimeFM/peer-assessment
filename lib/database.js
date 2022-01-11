import { Client, Get, Match, Index } from "faunadb";

const client = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN
})

