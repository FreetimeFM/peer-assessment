import { withSessionApi } from "lib/iron-session/withSession";
import { createErrorPayload } from "lib/errors";
import { getAllUsers } from "lib/database";

export default withSessionApi((req, res) => {

  const { size, afterRefId } = req.body;

  // Block students from accessing.
  if (req.session.user.userType === "student") return res.status(403).json(createErrorPayload(302));

  return getAllUsers(size, afterRefId);
})