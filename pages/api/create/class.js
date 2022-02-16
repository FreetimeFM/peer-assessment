import { createClass } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({req, res}) => {

  try {
    if (req.session.user.userType !== "admin") return res.status(getHttpStatus(303)).json(createErrorPayload(303));

    const { name, teachers, students } = req.body;

    if (!name || !teachers || !students) return res.status(getHttpStatus(301)).json(createErrorPayload(301));
    if (name.length === 0 || name.length > 70) return res.status(getHttpStatus(150)).json(createErrorPayload(150));
    if (!isInt(teachers)) return res.status(getHttpStatus(150)).json(createErrorPayload(150));
    if (typeof students !== "object") return res.status(getHttpStatus(150)).json(createErrorPayload(150));

    await createClass(name, teachers, students);
    res.status(200).json({error: false});
  } catch (error) {
    console.log(error);
    res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})