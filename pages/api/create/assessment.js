import { withSessionApi } from "lib/iron-session/withSession";
import { createErrorPayload } from "lib/errors";
import { createAssessment } from "lib/database";

export default withSessionApi(async function (req, res) {

  if (!req.body) return res.status(400).json(createErrorPayload(301));

  const db = await createAssessment({
    ...req.body,
    lecturerRef: req.session.user.ref
  })

  return {
    error: false
  };
})