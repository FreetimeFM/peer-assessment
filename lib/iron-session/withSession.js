import { withIronSessionSsr, withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "./session";
import { errorResponse } from "lib/errors";

/**
 * Used for handling API data in the backend.
 * @param {*} handler The callback method which takes in the request and response objects.
 */
export function withSessionApi(handler) {
  return withIronSessionApiRoute(async function (req, res) {
    if (!req.session.user) return errorResponse(res, 302);
    return await handler({req, res});
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

    if (handler) {
      let handlerData = await handler({req, res});

      if (!handlerData) return {
        props: {
          user: req.session.user
        }
      }

      if (handlerData.props) handlerData.props = {
        ...handlerData.props,
          user: req.session.user,
      }
      else handlerData.props = { user: req.session.user }
      return handlerData;
    }

    return {
      props: {
        user: req.session.user,
      }
    }

  }, sessionOptions);
}
