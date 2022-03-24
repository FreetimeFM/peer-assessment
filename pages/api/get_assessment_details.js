import { getAssessmentDetailsByAssessmentRefID, ifStudentCompletedAssessment } from "lib/database";
import { createErrorPayload, getHttpStatus, errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({req, res}) => {
  try {
    if (!req.body.assessmentRefID) return res.status(getHttpStatus(301)).json(createErrorPayload(301));

    const id = req.body.assessmentRefID.toString();
    if (!isInt(id)) return res.status(getHttpStatus(150)).json(createErrorPayload(150));

    let completed = null;

    if (req.session.user.userType === "student") {
      completed = await ifStudentCompletedAssessment([id], req.session.user.refID);
      if (completed.error) return res.status(getHttpStatus(100)).json(createErrorPayload(100));
      if (completed.result[0]) return res.status(200).json({
        error: false,
        result: {
          completed: true
        }
      })
    }

    const { error, result } = await getAssessmentDetailsByAssessmentRefID(id, req.session.user.refID)

    if (error) {
      if (!result) return res.status(getHttpStatus(150)).json(createErrorPayload(150));
      else return res.status(getHttpStatus(100)).json(createErrorPayload(100));
    }

    return res.status(200).json({
      error: false,
      result: result
    })
  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})