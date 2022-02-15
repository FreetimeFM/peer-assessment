import { getAllClasses } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({req, res}) => {
  try {

    if (req.session.user.userType !== "admin") return res.status(getHttpStatus(303)).json(createErrorPayload(303));

    return res.status(200).json({
      error: false,
      result: await getAllClasses()
    })
  } catch (error) {
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})