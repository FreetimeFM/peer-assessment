import { withSessionApi } from "lib/iron-session/withSession";
import { errorResponse } from "lib/errors";

export default withSessionApi(async ({req, res}) => {
  try {
    if (req.session.user.userType !== "student") return errorResponse(res, 303);
    const { assessmentRefID, responses } = req.body;
    console.log(req.body);

    // TODO: Validate input.

    if (!assessmentRefID || !responses) return errorResponse(res, 301);

    return res.status(200).json({
      error: false
    });

  } catch (error) {
    console.error(error);
    return res.status(getHttpStatus(300)).json(createErrorPayload(300));
  }
});