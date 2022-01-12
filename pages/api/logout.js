import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/iron-session/session";

export default withIronSessionApiRoute(async (req, res) => {
  req.session.destroy();
  res.status(200);
  res.end();
}, sessionOptions);