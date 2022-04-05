import { getAssessmentStage, getMarkingDetailsForStudent } from "lib/database";
import { errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

export default withSessionApi(async ({req, res}) => {
  try {
    if (!req.body.assessmentRefID) return errorResponse(res, 301);
    const id = req.body.assessmentRefID;

    if (!isInt(id)) return errorResponse(res, 150);
    if (req.session.user.userType !== "student") return errorResponse(res, 303);

    const stage = await getAssessmentStage(id);
    if (stage.error) return errorResponse(res, 100);

    if (stage.result !== "mark") return res.status(200).json({
      error: false,
      result: {
        redirect: true,
        stage: stage.result
      }
    })

    const { error, result } = await getMarkingDetailsForStudent(id, req.session.user.refID);
    if (error) return errorResponse(res, 100);

    return res.status(200).json({ error: false, result: result });

  } catch (error) {
    console.error(error);
    return errorResponse(res, 300);
  }
})