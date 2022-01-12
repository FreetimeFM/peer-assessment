import { withIronSessionApiRoute } from "iron-session/next";
import { getErrorMessage } from "../../lib/errors";
function createErrorPayload(errorCode) {
  return {
    error: true,
    errorCode: errorCode,
    message: getErrorMessage(errorCode),
  };
}

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