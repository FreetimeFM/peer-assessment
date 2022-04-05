import { isLastStage, stages } from "lib/assessmentStages";
import { getAssessmentStage, changeAssessmentStage } from "lib/database";
import { errorResponse } from "lib/errors";
import { withSessionApi } from "lib/iron-session/withSession";
import isInt from "validator/lib/isInt";

/*
 * Changes the assessment stage.
 */
export default withSessionApi(async ({ req, res }) => {
  try {
    // Validates user type and input.
    if (req.session.user.userType === "student") return errorResponse(res, 303);
    const { assessmentRefID, stage } = req.body;
    if (!assessmentRefID || !stage) return errorResponse(res, 301);
    if (!isInt(req.body.assessmentRefID)) return errorResponse(res, 150);

    // Checks if the stage value exists in the array of pre defined stages.
    if (!stages.find(s => s.value === stage)) return errorResponse(res, 170);

    // Gets the current stage of the assessment and checks if it is the last stage.
    const currentStage = await getAssessmentStage(req.body.assessmentRefID);
    if (currentStage.error) return errorResponse(res, 100);
    if (isLastStage(currentStage.result)) return errorResponse(res, 170);

    // Changes the assessment stage and returns new assessment data.
    const data = await changeAssessmentStage(req.body.assessmentRefID, req.session.user.refID, stage);
    if (data.error) return errorResponse(res, 100);
    return res.status(200).json({ error: false });

  } catch (error) {
    console.error(error);
    return errorResponse(res, 300);
  }
});
