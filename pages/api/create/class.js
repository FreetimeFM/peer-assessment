import { createErrorPayload, getHttpStatus } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";


export default withSessionApi(({req, res}) => {

  try {
    if (req.session.user.userType !== "admin") return res.status(getHttpStatus(303)).json(createErrorPayload(303));

    const { name, teachers, students } = req.body;

    console.log(req.body);

    res.status(200).json({error: false});
  } catch (error) {
    res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})