import { withSessionApi } from "lib/iron-session/withSession";
import { errorResponse } from "lib/errors";
import { submitMarkingResponses } from "lib/database";

export default withSessionApi(async ({req, res}) => {
  try {
    if (req.session.user.userType !== "student") return errorResponse(res, 303);
    const { assessmentRefID, targetUserRefID, responses } = req.body;

    // TODO: Validate input.

    if (!assessmentRefID || !targetUserRefID || !responses) return errorResponse(res, 301);

    const result = await submitMarkingResponses(assessmentRefID, targetUserRefID, responses);
    if (result.error) errorResponse(res, 100);

    return res.status(200).json({
      error: false
    });

  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
});