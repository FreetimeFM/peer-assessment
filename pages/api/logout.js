import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/iron-session/session";

export default withIronSessionApiRoute(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
  res.end();
}, sessionOptions);