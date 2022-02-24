import { withSessionApi } from "lib/iron-session/withSession";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { createAssessment } from "lib/database";

export default withSessionApi(async function ({req, res}) {

  try {
    if (!req.body) return res.status(400).json(createErrorPayload(301));

    await createAssessment({
      ...req.body,
      teacherRef: req.session.user.refID
    })

    return res.status(200).json({
      error: false
    });
  } catch (error) {
    console.error(error)
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})