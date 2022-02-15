import { createClass } from "lib/database";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";

export default withSessionApi(async ({req, res}) => {

  try {
    if (req.session.user.userType !== "admin") return res.status(getHttpStatus(303)).json(createErrorPayload(303));

    const { name, teachers, students } = req.body;

    if (!name || !teachers || !students) return res.status(getHttpStatus(301)).json(createErrorPayload(301));

    await createClass(name, teachers, students);

    res.status(200).json({error: false});
  } catch (error) {
    console.log(error);
    res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})