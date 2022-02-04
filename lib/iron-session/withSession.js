import { withIronSessionSsr, withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "./session";

export function withSessionApi(handler) {
  return withIronSessionApiRoute(async function ({req, res}) {

    if (req.session.user === undefined) {
      res.statusCode = 302;

      return {
        props: {
          user: { isLoggedIn: false },
        },
      };
    }

    return {
      props: {
        user: req.session.user,
        ...await handler({req, res})
      }
    }

  }, sessionOptions);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(async function ({req, res}) {

    if (req.session.user === undefined) {
      res.statusCode = 302;

      return {
        props: {
          user: { isLoggedIn: false },
        },
        redirect: {
          permanent: false,
          destination: "/"
        }
      };
    }

    return {
      props: {
        user: req.session.user,
        ...await handler({req, res})
      }
    }

  }, sessionOptions);
}
