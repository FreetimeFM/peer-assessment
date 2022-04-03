import { getAssessmentDetailsByAssessmentRefID, getAssessmentStage, ifStudentCompletedAssessment } from "lib/database";
import { createErrorPayload, getHttpStatus, errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({req, res}) => {
  try {
    if (!req.body.assessmentRefID) return res.status(getHttpStatus(301)).json(createErrorPayload(301));

    const id = req.body.assessmentRefID;
    if (!isInt(id)) return res.status(getHttpStatus(150)).json(createErrorPayload(150));

    let completed = null, stage = null;

    if (req.session.user.userType === "student") {
      stage = await getAssessmentStage(id);
      if (stage.error) return res.status(getHttpStatus(100)).json(createErrorPayload(100));

      if (stage.result !== "assess") return res.status(200).json({
        error: false,
        result: {
          redirect: true,
          stage: stage.result
        }
      })

      completed = await ifStudentCompletedAssessment([id], req.session.user.refID);
      if (completed.error) return res.status(getHttpStatus(100)).json(createErrorPayload(100));

      if (completed.result[0]) return res.status(200).json({
        error: false,
        result: {
          redirect: true,
          completed: completed.result,
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
      result: {
        redirect: false,
        ...result
      }
    })
  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
})