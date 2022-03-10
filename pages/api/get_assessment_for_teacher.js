import { getAssessmentDetailsByAssessmentRefID, ifAssessmentExists, getAssessmentAnswers } from "lib/database";
import { errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({req, res}) => {
  try {
    if (req.session.user.userType === "student") return errorResponse(res, 303);
    if (!req.body.assessmentRefID) return errorResponse(res, 301);

    const id = req.body.assessmentRefID.toString();
    if (!isInt(id)) return errorResponse(res, 150);

    const { error: checkError, result: checkResult } = await ifAssessmentExists(id);
    if (!checkResult) return errorResponse(res, 161);

    const { error: detailsError, result: detailsResult } = await getAssessmentDetailsByAssessmentRefID(id);
    const { error: answersError, result: answersResult } = await getAssessmentAnswers(id);

    if (checkError || detailsError || answersError) return errorResponse(res, 300);

    return res.status(200).json({
      error: false,
      result: {
        details: detailsResult,
        answers: answersResult
      }
    })
  } catch (error) {
    console.error(error);
    return errorResponse(res, 300);
  }
})