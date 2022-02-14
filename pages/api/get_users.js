import { withSessionApi } from "lib/iron-session/withSession";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { getUsers } from "lib/database";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({ req, res }) => {
  try {
    if (req.session.user.userType !== "admin") return res.status(getHttpStatus(303)).json(createErrorPayload(303));

    const { size, afterRefID } = req.body;

    if (size) {
      if (!isInt(size.toString())) size = undefined;
    }

    if (afterRefID) {
      if (!isInt(afterRefID)) afterRefID = undefined;
    }

    res.status(200).json({ ...await getUsers(size, afterRefID) });

  } catch (error) {
    res.status(getHttpStatus(300)),json(createErrorPayload(300));
  }
})