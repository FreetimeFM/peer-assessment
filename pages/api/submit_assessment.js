import { withSessionApi } from "lib/iron-session/withSession";
import { createErrorPayload, getHttpStatus } from "lib/errors";
import { submitAssessmentAnswers } from "lib/database";

export default withSessionApi(async ({req, res}) => {
  try {
    if (req.session.user.userType !== "student") return res.status(getHttpStatus(303)).json(createErrorPayload(303));
    const { assessmentRefID, answers } = req.body;

    console.log(req.body);

    if (!assessmentRefID || !answers) return res.status(getHttpStatus(301)).json(createErrorPayload(301));

    return res.status(200).json({
      ...await submitAssessmentAnswers(req.session.user.refID, assessmentRefID, answers)
    });

  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
});