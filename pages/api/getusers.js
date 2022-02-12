import { withSessionApi } from "lib/iron-session/withSession";
import { createErrorPayload } from "lib/errors";
import { getAllUsers } from "lib/database";

export default function (req, res) {
  const { user, size, afterRefId } = JSON.parse(req.body);

  if (!user) return res.json(createErrorPayload(302));
  if (user.userType !== "admin") return res.json(createErrorPayload(303));

  return res.status(200).json({ error: false });

  return res.status(200).json(getAllUsers(size, afterRefId));
}