import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
export default withIronSessionApiRoute(async (req, res) => {
  try {

    const user = { isLoggedIn: true, details: details.result };
    req.session.user = user;
    await req.session.save();
    res.json(user);

  } catch (error) {
    res.status(500).json(createErrorPayload(300));
  }

}, sessionOptions);