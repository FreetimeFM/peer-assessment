import { withSessionApi } from "lib/iron-session/withSession";
import { errorResponse } from "lib/errors";
import { submitMarkingResponses, submitAssessmentFeedback } from "lib/database";

export default withSessionApi(async ({req, res}) => {
  try {
    if (req.session.user.userType === "student") {
      const { assessmentRefID, targetUserRefID, responses } = req.body;

      // TODO: Validate input.

      if (!assessmentRefID || !targetUserRefID || !responses) return errorResponse(res, 301);

      const result = await submitMarkingResponses(assessmentRefID, req.session.user.refID, targetUserRefID, responses);
      if (result.error) return errorResponse(res, 100);

      return res.status(200).json({
        error: false
      });
    } else if (req.session.user.userType === "teacher") {

      const { assessmentRefID, userRefID, overallComment, markingCriteria } = req.body;

      // TODO: Validate input.
      if (!assessmentRefID || !userRefID || !overallComment || !markingCriteria) return errorResponse(res, 301);

      const result = await submitAssessmentFeedback(req.body);
      if (result.error) return errorResponse(res, 100);

      return res.status(200).json({
        error: false
      });

    } else {
      return errorResponse(res, 302);
    }


  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
});